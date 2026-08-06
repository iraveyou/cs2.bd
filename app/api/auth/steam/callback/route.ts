import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getPlayerSummary } from '../../../../../lib/steam/client';
import { encode } from 'next-auth/jwt';

const STEAM_OPENID = 'https://steamcommunity.com/openid';

function getBaseUrl() {
  const base = process.env.NEXTAUTH_URL || 'https://cs2-bd.vercel.app';
  return base.replace(/\/+$/, '');
}

async function verifySteamOpenId(params: URLSearchParams): Promise<string | null> {
  const verifyParams = new URLSearchParams();
  for (const [key, value] of params.entries()) {
    if (key.startsWith('openid.')) {
      verifyParams.set(key, value);
    }
  }
  verifyParams.set('openid.mode', 'check_authentication');

  try {
    const res = await fetch(`${STEAM_OPENID}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verifyParams.toString(),
    });
    const text = await res.text();
    if (!text.includes('is_valid:true')) return null;
  } catch {
    return null;
  }

  const claimedId = params.get('openid.claimed_id');
  if (!claimedId) return null;
  const match = claimedId.match(/\/id\/(\d+)$/) || claimedId.match(/\/profiles\/(\d+)$/);
  return match ? match[1] : null;
}

async function signInViaCredentials(user: { id: string; steamId: string; name: string | null; email: string | null; role: string }, redirectTo?: string) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not set');
  }
  const maxAge = 30 * 24 * 60 * 60;

  const token = await encode({
    token: {
      userId: user.id,
      role: user.role,
      steamId: user.steamId,
      sub: user.id,
      name: user.name,
      email: user.email,
    },
    secret,
    maxAge,
  });

  const baseUrl = getBaseUrl();
  const secure = baseUrl.startsWith('https');

  const response = NextResponse.redirect(redirectTo || baseUrl);
  response.cookies.set(secure ? '__Secure-next-auth.session-token' : 'next-auth.session-token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure,
    maxAge,
  });
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const baseUrl = getBaseUrl();

  try {
    const steamId64 = await verifySteamOpenId(searchParams);
    if (!steamId64) {
      return NextResponse.redirect(
        `${baseUrl}/auth/signin?error=SteamAuthFailed`
      );
    }

    const roleParam = searchParams.get('role') || 'buyer';
    const newUserRole = roleParam === 'seller' ? 'SELLER_APPLICANT' : 'USER';

    let existingUser = await prisma.user.findUnique({
      where: { steamId: steamId64 },
    });

    if (!existingUser) {
      let playerName: string | null = null;
      try {
        const player = await getPlayerSummary(steamId64);
        if (player) playerName = player.personaname;
      } catch (e) {
        console.error('Failed to fetch Steam player summary:', e);
      }

      const displayName = playerName || `SteamUser_${steamId64.slice(-6)}`;
      const email = `${steamId64}@steam.cs2bd`;

      try {
        existingUser = await prisma.user.create({
          data: {
            steamId: steamId64,
            name: displayName,
            email,
            role: newUserRole,
          },
        });
      } catch (e) {
        console.error('Failed to create Steam user:', e);
        return NextResponse.redirect(
          `${baseUrl}/auth/signin?error=AccountCreationFailed`
        );
      }
    }

    const redirectDest = roleParam === 'seller' && existingUser.role === 'SELLER_APPLICANT'
      ? `${baseUrl}/seller/dashboard`
      : existingUser.role === 'SELLER' || existingUser.role === 'SELLER_APPLICANT' || existingUser.role === 'ADMIN'
        ? `${baseUrl}/seller/dashboard`
        : `${baseUrl}/buyer/dashboard`;

    return signInViaCredentials({
      id: existingUser.id,
      steamId: existingUser.steamId!,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    }, redirectDest);
  } catch (error) {
    console.error('Steam callback error:', error);
    return NextResponse.redirect(
      `${baseUrl}/auth/signin?error=SteamAuthFailed`
    );
  }
}

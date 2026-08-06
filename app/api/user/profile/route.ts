import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth/nextauth';
import { prisma } from '../../../../lib/prisma';
import { getPlayerSummary } from '../../../../lib/steam/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 });
  }

  const userId = (session as any).userId;
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'No user ID in session' }, { status: 400 });
  }

  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      steamId: true,
      tradeUrl: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true, favorites: true, reviews: true } },
    },
  });

  if (!profile) {
    return NextResponse.json({ ok: false, error: 'Profile not found' }, { status: 404 });
  }

  let steamPlayer = null;
  if (profile.steamId) {
    try {
      steamPlayer = await getPlayerSummary(profile.steamId);
    } catch (e) {
      console.error('Failed to fetch Steam player summary:', e);
    }
  }

  return NextResponse.json({ ok: true, profile, steamPlayer });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 });
  }

  const userId = (session as any).userId;
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'No user ID in session' }, { status: 400 });
  }

  const body = await req.json();
  const { name, email, phone, tradeUrl } = body;

  try {
    const data: Record<string, string | null> = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined && email) data.email = email;
    if (phone !== undefined) data.phone = phone || null;
    if (tradeUrl !== undefined) data.tradeUrl = tradeUrl || null;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, phone: true, tradeUrl: true },
    });

    return NextResponse.json({ ok: true, user });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

const STEAM_OPENID = 'https://steamcommunity.com/openid';

function getBaseUrl() {
  const base = process.env.NEXTAUTH_URL || 'https://cs2-bd.vercel.app';
  return base.replace(/\/+$/, '');
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get('role') || 'buyer';
  const realm = getBaseUrl();
  const returnTo = `${realm}/api/auth/steam/callback?role=${role}`;

  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': returnTo,
    'openid.realm': realm,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  });

  return NextResponse.redirect(`${STEAM_OPENID}/login?${params.toString()}`);
}

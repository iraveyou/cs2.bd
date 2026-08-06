import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth/nextauth';
import { getNotifications } from '../../../lib/notification-utils';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 });
  }

  const userId = (session as any).userId;
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'No user ID' }, { status: 400 });
  }

  const notifications = await getNotifications(userId);
  return NextResponse.json({ ok: true, notifications });
}

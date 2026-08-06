import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth/nextauth';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  dismissNotification,
  dismissAllNotifications,
} from '../../../lib/notification-utils';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 });
    }

    const userId = (session as any).userId;
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'No user ID' }, { status: 400 });
    }

    const url = new URL(req.url);
    const unreadOnly = url.searchParams.get('unread') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    const [notifications, unreadCount] = await Promise.all([
      getNotifications(userId, { limit, unreadOnly }),
      getUnreadCount(userId),
    ]);

    return NextResponse.json({ ok: true, notifications, unreadCount });
  } catch (err: any) {
    console.error('Notifications fetch error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 });
    }

    const userId = (session as any).userId;
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'No user ID' }, { status: 400 });
    }

    const body = await req.json();
    const { action, id } = body;

    switch (action) {
      case 'mark-read': {
        if (!id) return NextResponse.json({ ok: false, error: 'Missing notification id' }, { status: 400 });
        const updated = await markAsRead(id, userId);
        return NextResponse.json({ ok: true, notification: updated });
      }
      case 'mark-all-read': {
        const result = await markAllAsRead(userId);
        return NextResponse.json({ ok: true, count: result.count });
      }
      default:
        return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Notifications PATCH error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 });
    }

    const userId = (session as any).userId;
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'No user ID' }, { status: 400 });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'all') {
      const result = await dismissAllNotifications(userId);
      return NextResponse.json({ ok: true, count: result.count });
    }

    const id = url.searchParams.get('id');
    if (id) {
      const deleted = await dismissNotification(id, userId);
      return NextResponse.json({ ok: true, deleted });
    }

    return NextResponse.json({ ok: false, error: 'Missing notification id or action' }, { status: 400 });
  } catch (err: any) {
    console.error('Notifications DELETE error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Failed' }, { status: 500 });
  }
}

import { prisma } from './prisma';
import { sendEmail } from './mail';

export type NotificationType = 'order' | 'payment' | 'seller' | 'system' | 'delivery';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  userId: string;
  isRead: boolean;
  createdAt: Date;
}

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  channel?: 'browser' | 'email' | 'both';
}) {
  const channel = params.channel || 'both';
  try {
    const notif = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        data: {
          title: params.title,
          message: params.message,
          link: params.link || null,
        },
        channel: channel === 'both' ? 'browser' : channel,
      },
    });

    if (channel === 'email' || channel === 'both') {
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
        select: { email: true, name: true },
      });
      if (user?.email) {
        sendEmail({
          to: user.email,
          subject: `CS2BD: ${params.title}`,
          category: params.type,
          title: params.title,
          message: params.message,
          link: params.link,
          userName: user.name || undefined,
        });
      }
    }

    return notif;
  } catch (e) {
    console.error('Notification error:', e);
    return null;
  }
}

export async function getNotifications(
  userId: string,
  options?: { limit?: number; unreadOnly?: boolean }
): Promise<AppNotification[]> {
  const notifs = await prisma.notification.findMany({
    where: {
      userId,
      ...(options?.unreadOnly ? { isRead: false } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: options?.limit ?? 20,
  });

  return notifs.map((n) => {
    const data = (n.data || {}) as any;
    return {
      id: n.id,
      type: (
        n.type === 'SELLER' ? 'seller' :
        n.type === 'ORDER' ? 'order' :
        n.type === 'PAYMENT' ? 'payment' :
        n.type === 'DELIVERY' ? 'delivery' : 'system'
      ) as NotificationType,
      title: data.title || '',
      message: data.message || '',
      link: data.link || '',
      userId: n.userId,
      isRead: n.isRead,
      createdAt: n.createdAt,
    };
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

export async function markAsRead(notificationId: string, userId: string) {
  const notif = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!notif) return null;
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function dismissNotification(notificationId: string, userId: string) {
  const notif = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!notif) return null;
  return prisma.notification.delete({
    where: { id: notificationId },
  });
}

export async function dismissAllNotifications(userId: string) {
  return prisma.notification.deleteMany({
    where: { userId },
  });
}

// ─── Business Event Notifiers ──────────────────────────────

export async function notifyBuyerOrderReserved(userId: string, orderId: string, itemName: string) {
  return createNotification({
    userId,
    type: 'order',
    title: 'Skin Reserved',
    message: `${itemName} has been reserved for you. Complete payment within 30 minutes.`,
    link: `/buyer/dashboard`,
    channel: 'both',
  });
}

export async function notifySellerNewOrder(sellerUserId: string, itemName: string, price: number) {
  return createNotification({
    userId: sellerUserId,
    type: 'order',
    title: 'New Order Received',
    message: `Someone ordered ${itemName} for ৳${Math.round(price / 100).toLocaleString()}. Prepare for delivery once payment is verified.`,
    link: `/seller/dashboard`,
    channel: 'both',
  });
}

export async function notifyPaymentVerified(buyerId: string, sellerId: string, itemName: string) {
  await Promise.all([
    createNotification({
      userId: buyerId,
      type: 'payment',
      title: 'Payment Verified',
      message: `Your payment for ${itemName} has been verified. Seller will deliver via Steam trade soon.`,
      link: `/buyer/dashboard`,
      channel: 'both',
    }),
    createNotification({
      userId: sellerId,
      type: 'payment',
      title: 'Payment Verified — Please Deliver',
      message: `Payment for ${itemName} has been confirmed. Please send the skin to the buyer via Steam trade immediately.`,
      link: `/seller/dashboard`,
      channel: 'both',
    }),
  ]);
}

export async function notifyPaymentRejected(buyerId: string, itemName: string, reason?: string) {
  return createNotification({
    userId: buyerId,
    type: 'payment',
    title: 'Payment Rejected',
    message: reason
      ? `Your payment for ${itemName} was rejected: ${reason}`
      : `Your payment for ${itemName} was not verified. Please contact support.`,
    link: `/buyer/dashboard`,
    channel: 'both',
  });
}

export async function notifyOrderDelivered(buyerId: string, itemName: string) {
  return createNotification({
    userId: buyerId,
    type: 'delivery',
    title: 'Skin Delivered!',
    message: `${itemName} has been delivered to your Steam account. Please confirm receipt and enjoy!`,
    link: `/buyer/inventory`,
    channel: 'both',
  });
}

export async function notifyOrderCompleted(sellerId: string, itemName: string, amount: number) {
  return createNotification({
    userId: sellerId,
    type: 'delivery',
    title: 'Order Completed',
    message: `Buyer confirmed receipt of ${itemName}. ৳${Math.round(amount / 100).toLocaleString()} has been released to you.`,
    link: `/seller/dashboard`,
    channel: 'both',
  });
}

export async function notifySellerApplicationSubmitted(userId: string) {
  return createNotification({
    userId,
    type: 'seller',
    title: 'Application Submitted',
    message: 'Your seller application has been submitted. Admin review is pending within 24 hours.',
    link: `/seller/dashboard`,
    channel: 'both',
  });
}

export async function notifySellerApproved(userId: string) {
  return createNotification({
    userId,
    type: 'seller',
    title: 'Seller Application Approved!',
    message: 'Congratulations! You are now a verified seller on CS2BD. Start listing your CS2 skins today.',
    link: `/seller/dashboard`,
    channel: 'both',
  });
}

export async function notifySellerRejected(userId: string, reason?: string) {
  return createNotification({
    userId,
    type: 'seller',
    title: 'Application Not Approved',
    message: reason
      ? `Your seller application was not approved: ${reason}`
      : 'Your seller application could not be approved at this time. Please try again.',
    link: `/seller/dashboard`,
    channel: 'both',
  });
}

export async function notifyAdminNewApplication() {
  return createNotification({
    userId: 'admin',
    type: 'seller',
    title: 'New Seller Application',
    message: 'A new seller application has been submitted and is pending review.',
    link: `/admin/sellers`,
    channel: 'browser',
  });
}

export async function notifyAdminNewPayment(paymentId: string, amount: number, method: string) {
  return createNotification({
    userId: 'admin',
    type: 'payment',
    title: 'New Payment to Verify',
    message: `A ৳${Math.round(amount / 100).toLocaleString()} ${method} payment needs verification.`,
    link: `/admin/payments`,
    channel: 'browser',
  });
}

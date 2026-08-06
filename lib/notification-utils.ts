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
  createdAt: Date;
}

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
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
        channel: 'browser',
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { email: true, name: true },
    });

    if (user?.email) {
      sendEmail({
        to: user.email,
        subject: `CS2BD: ${params.title}`,
        html: `<div style="background:#09090b;color:#fff;padding:24px;font-family:sans-serif;border-radius:12px;border:1px solid #1c1c26">
          <h1 style="color:#22c55e">CS2BD</h1>
          <h2>${params.title}</h2>
          <p>${params.message}</p>
          ${params.link ? `<a href="${params.link}" style="color:#22c55e">View Details →</a>` : ''}
          <hr style="border-color:#1c1c26;margin-top:16px"/>
          <p style="color:#666;font-size:12px">cs2bd Bangladesh CS2 Marketplace</p>
        </div>`,
      });
    }

    return notif;
  } catch (e) {
    console.error('Notification error:', e);
    return null;
  }
}

export async function getNotifications(userId: string, limit = 10): Promise<AppNotification[]> {
  const notifs = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return notifs.map((n) => {
    const data = (n.data || {}) as any;
    return {
      id: n.id,
      type: (n.type === 'SELLER' ? 'seller' : n.type === 'ORDER' ? 'order' : n.type === 'PAYMENT' ? 'payment' : 'system') as NotificationType,
      title: data.title || '',
      message: data.message || '',
      link: data.link || '',
      userId: n.userId,
      createdAt: n.createdAt,
    };
  });
}

export async function notifyBuyerOrderReserved(userId: string, orderId: string, itemName: string) {
  return createNotification({
    userId,
    type: 'order',
    title: 'Skin Reserved',
    message: `${itemName} has been reserved for you. Complete payment within 24 hours.`,
    link: `/buyer/dashboard`,
  });
}

export async function notifySellerNewOrder(sellerUserId: string, itemName: string, price: number) {
  return createNotification({
    userId: sellerUserId,
    type: 'order',
    title: 'New Order Received',
    message: `Someone ordered ${itemName} for ৳${Math.round(price / 100).toLocaleString()}. Prepare for delivery.`,
    link: `/seller/dashboard`,
  });
}

export async function notifyPaymentVerified(buyerId: string, sellerId: string, itemName: string) {
  await Promise.all([
    createNotification({
      userId: buyerId,
      type: 'payment',
      title: 'Payment Verified',
      message: `Your payment for ${itemName} has been verified. Seller will deliver soon.`,
      link: `/buyer/dashboard`,
    }),
    createNotification({
      userId: sellerId,
      type: 'payment',
      title: 'Payment Verified — Please Deliver',
      message: `Payment for ${itemName} has been confirmed. Please send the skin via Steam trade.`,
      link: `/seller/dashboard`,
    }),
  ]);
}

export async function notifyOrderDelivered(buyerId: string, itemName: string) {
  return createNotification({
    userId: buyerId,
    type: 'delivery',
    title: 'Skin Delivered',
    message: `${itemName} has been delivered to your Steam account! Confirm and enjoy.`,
    link: `/buyer/dashboard`,
  });
}

export async function notifySellerApplicationSubmitted(userId: string) {
  return createNotification({
    userId,
    type: 'seller',
    title: 'Application Submitted',
    message: 'Your seller application has been submitted. Admin review is pending within 24 hours.',
    link: `/seller/dashboard`,
  });
}

export async function notifySellerApproved(userId: string) {
  return createNotification({
    userId,
    type: 'seller',
    title: 'Seller Application Approved',
    message: 'Congratulations! You are now a verified seller. Start listing your CS2 skins.',
    link: `/seller/dashboard`,
  });
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth/nextauth';
import prisma from '../../../../../../lib/prisma';
import { notifyPaymentRejected } from '../../../../../../lib/notification-utils';

export async function POST(req: Request, context: any) {
  try {
    const session = await getServerSession(authOptions);
    const adminId = (session as any)?.userId ?? null;

    let id: any = context?.params?.id;
    if (id && typeof id.then === 'function') id = await id;
    if (id && typeof id === 'object' && id.id) id = id.id;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { order: { include: { items: { take: 1 } } } },
    });
    if (!payment) return NextResponse.json({ ok: false, message: 'Payment not found' }, { status: 404 });

    const orderId = payment.orderId;
    const itemName = (payment.order?.items[0]?.itemSnapshot as any)?.name || 'Skin';

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({ where: { id }, data: { status: 'REJECTED', rejectedAt: new Date(), adminVerifierId: adminId } });

      const items = await tx.orderItem.findMany({ where: { orderId } });
      for (const it of items) {
        await tx.listing.updateMany({ where: { id: it.listingId }, data: { stock: { increment: it.quantity } } });
      }

      await tx.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } });
      await tx.auditLog.create({ data: { actorId: adminId, action: 'PAYMENT_REJECT', targetType: 'Payment', targetId: id, meta: {} } });
    });

    if (payment.buyerId) {
      notifyPaymentRejected(payment.buyerId, itemName).catch(console.error);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, message: err.message || 'Error' }, { status: 500 });
  }
}

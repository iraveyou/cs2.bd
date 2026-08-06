import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth/nextauth';
import prisma from '../../../../../../lib/prisma';
import { notifyPaymentVerified } from '../../../../../../lib/notification-utils';

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

    const itemName = (payment.order?.items[0]?.itemSnapshot as any)?.name || 'Skin';

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({ where: { id }, data: { status: 'VERIFIED', verifiedAt: new Date(), adminVerifierId: adminId } });
      await tx.order.update({ where: { id: payment.orderId }, data: { status: 'AWAITING_DELIVERY' } });
      await tx.auditLog.create({ data: { actorId: adminId, action: 'PAYMENT_VERIFY', targetType: 'Payment', targetId: id, meta: {} } });
    });

    const order = await prisma.order.findUnique({ where: { id: payment.orderId }, select: { buyerId: true, store: { select: { userId: true } } } });

    if (order?.buyerId && order?.store?.userId) {
      notifyPaymentVerified(order.buyerId, order.store.userId, itemName).catch(console.error);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, message: err.message || 'Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth/nextauth';
import prisma from '../../../lib/prisma';
import {
  notifyBuyerOrderReserved,
  notifySellerNewOrder,
  notifyAdminNewPayment,
} from '../../../lib/notification-utils';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session as any)?.userId ?? null;

    const form = await req.formData();
    const listingId = form.get('listingId')?.toString() || null;
    const amountStr = form.get('amount')?.toString() || null;
    const method = form.get('method')?.toString() || null;
    const senderNumber = form.get('senderNumber')?.toString() || null;
    const transactionId = form.get('transactionId')?.toString() || null;
    const screenshot = form.get('screenshot') as File | null;

    if (!listingId) return NextResponse.json({ ok: false, message: 'Missing listingId' }, { status: 400 });
    if (!amountStr) return NextResponse.json({ ok: false, message: 'Missing amount' }, { status: 400 });

    const amountCents = Math.round(Number(amountStr) * 100);

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { store: { select: { userId: true, name: true } } },
    });
    if (!listing) return NextResponse.json({ ok: false, message: 'Listing not found' }, { status: 404 });
    if (listing.stock <= 0) return NextResponse.json({ ok: false, message: 'Out of stock' }, { status: 409 });

    const sellerUserId = listing.store?.userId || null;

    let mediaId: string | null = null;
    if (screenshot && typeof (screenshot as any).arrayBuffer === 'function') {
      try {
        const buffer = Buffer.from(await (screenshot as any).arrayBuffer());
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        const filename = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);
        const url = `/uploads/${filename}`;
        const media = await prisma.media.create({ data: { ownerId: userId, provider: 'local', url, width: null, height: null, sizeBytes: buffer.length, mimeType: 'image/jpeg' } });
        mediaId = media.id;
      } catch (e) {
        console.error('Failed to save screenshot', e);
      }
    }

    const reservedUntil = new Date(Date.now() + 30 * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.listing.updateMany({ where: { id: listingId, stock: { gt: 0 } }, data: { stock: { decrement: 1 } } });
      if (updated.count === 0) throw new Error('Failed to reserve item; out of stock');

      const order = await tx.order.create({
        data: {
          buyerId: userId,
          storeId: listing.storeId,
          totalCents: amountCents,
          currency: listing.currency,
          status: 'RESERVED',
          reservedUntil,
        },
      });

      await tx.orderItem.create({
        data: {
          orderId: order.id,
          listingId: listing.id,
          priceCents: listing.priceCents,
          quantity: 1,
          itemSnapshot: {
            name: listing.name,
            exterior: listing.exterior,
            floatValue: listing.floatValue,
            statTrak: listing.statTrak,
            sku: listing.sku,
          },
        },
      });

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          buyerId: userId,
          amountCents: amountCents,
          currency: listing.currency,
          status: 'SUBMITTED',
          paymentMethod: method || 'MANUAL',
          merchantNumber: null,
          buyerSenderNumber: senderNumber || null,
          transactionId: transactionId || null,
          screenshotMediaId: mediaId,
          submittedAt: new Date(),
        },
      });

      await tx.auditLog.create({ data: { actorId: userId, action: 'ORDER_RESERVE', targetType: 'Order', targetId: order.id, meta: { listingId, amountCents } } });

      return { orderId: order.id, paymentId: payment.id };
    });

    if (userId) {
      notifyBuyerOrderReserved(userId, result.orderId, listing.name).catch(console.error);
    }
    if (sellerUserId) {
      notifySellerNewOrder(sellerUserId, listing.name, listing.priceCents).catch(console.error);
    }
    notifyAdminNewPayment(result.paymentId, amountCents, method || 'MANUAL').catch(console.error);

    return NextResponse.json({ ok: true, id: result.paymentId, orderId: result.orderId });
  } catch (err: any) {
    console.error('payment submit error', err);
    return NextResponse.json({ ok: false, message: err.message || 'Error' }, { status: 500 });
  }
}

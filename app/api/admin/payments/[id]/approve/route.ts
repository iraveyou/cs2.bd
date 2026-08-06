import { NextResponse } from 'next/server'
import prisma from '../../../../../../lib/prisma'

export async function POST(req: Request, context: any) {
  try {
    let id: any = context?.params?.id
    if (id && typeof id.then === 'function') id = await id
    if (id && typeof id === 'object' && id.id) id = id.id

    const payment = await prisma.payment.findUnique({ where: { id } })
    if (!payment) return NextResponse.json({ ok: false, message: 'Payment not found' }, { status: 404 })

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({ where: { id }, data: { status: 'VERIFIED', verifiedAt: new Date(), adminVerifierId: null } })
      await tx.order.update({ where: { id: payment.orderId }, data: { status: 'AWAITING_DELIVERY' } })
      await tx.auditLog.create({ data: { actorId: null, action: 'PAYMENT_VERIFY', targetType: 'Payment', targetId: id, meta: {} } })
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ ok: false, message: err.message || 'Error' }, { status: 500 })
  }
}

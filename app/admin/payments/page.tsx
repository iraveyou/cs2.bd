import React from 'react'
import prisma from '../../../lib/prisma'
import AdminPaymentsClient from './AdminPaymentsClient'
import { requireAdmin } from '../../../lib/auth/guards'

export const metadata = {
  title: 'Admin — Payment Verification | cs2bd',
  description: 'Manual bKash & Nagad payment verification, fraud detection, and transaction history.',
}

export default async function AdminPaymentsPage() {
  await requireAdmin()
  const dbPayments = await prisma.payment.findMany({
    include: { order: true, buyer: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const initialPayments = dbPayments.map((p) => ({
    id: p.id,
    orderNumber: p.order ? `ORD-${p.order.orderNumber}` : `PAY-${p.id.slice(0, 8)}`,
    amount: (p.amountCents / 100).toLocaleString('en-BD'),
    method: p.paymentMethod || 'bKash',
    trxId: p.transactionId || '—',
    senderNumber: p.buyerSenderNumber || '—',
    submittedAt: p.createdAt.toISOString().replace('T', ' ').substring(0, 16),
    status: p.status as string,
    screenshotUrl: p.screenshotMediaId ? `/uploads/${p.screenshotMediaId}` : undefined,
  }))

  return <AdminPaymentsClient initialPayments={initialPayments} />
}

import prisma from '../prisma';
import { PaymentStatus, Currency } from '@prisma/client';

export interface SubmitPaymentDTO {
  orderId: string;
  buyerId: string;
  amountCents: number;
  paymentMethod: string; // bKash, Nagad
  merchantNumber: string;
  buyerSenderNumber: string;
  transactionId: string;
  screenshotMediaUrl?: string;
}

export class PaymentRepository {
  /**
   * Check for duplicate transaction ID across payments
   */
  async findByTransactionId(trxId: string) {
    return prisma.payment.findFirst({
      where: {
        transactionId: trxId.trim(),
      },
    });
  }

  /**
   * Submit manual bKash/Nagad payment proof
   */
  async submitPayment(dto: SubmitPaymentDTO) {
    // Check if transaction ID is already used
    const existingTrx = await this.findByTransactionId(dto.transactionId);
    const initialStatus = existingTrx ? PaymentStatus.DUPLICATE : PaymentStatus.SUBMITTED;

    return prisma.payment.create({
      data: {
        orderId: dto.orderId,
        buyerId: dto.buyerId,
        amountCents: dto.amountCents,
        currency: Currency.BDT,
        status: initialStatus,
        paymentMethod: dto.paymentMethod,
        merchantNumber: dto.merchantNumber,
        buyerSenderNumber: dto.buyerSenderNumber,
        transactionId: dto.transactionId.trim(),
        submittedAt: new Date(),
        flags: existingTrx ? { duplicateDetected: true, originalPaymentId: existingTrx.id } : undefined,
      },
    });
  }

  /**
   * Verify or reject payment (Admin Audit)
   */
  async verifyPayment(paymentId: string, verifierId: string, approve: boolean, reason?: string) {
    const status = approve ? PaymentStatus.VERIFIED : PaymentStatus.REJECTED;

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedAt: approve ? new Date() : undefined,
        rejectedAt: !approve ? new Date() : undefined,
        adminVerifierId: verifierId,
        meta: reason ? { auditReason: reason } : undefined,
      },
    });

    // If verified, update parent order to PENDING_VERIFICATION or AWAITING_DELIVERY
    if (approve) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'PENDING_VERIFICATION' },
      });
    }

    return payment;
  }

  /**
   * Find payments pending manual verification for Admin Queue
   */
  async findPendingPayments() {
    return prisma.payment.findMany({
      where: {
        status: { in: [PaymentStatus.SUBMITTED, PaymentStatus.FLAGGED, PaymentStatus.DUPLICATE] },
      },
      orderBy: { createdAt: 'asc' },
      include: {
        order: {
          include: {
            buyer: true,
            store: true,
          },
        },
      },
    });
  }
}

export const paymentRepository = new PaymentRepository();

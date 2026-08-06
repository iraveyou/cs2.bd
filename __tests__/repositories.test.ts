import { describe, it, expect } from 'vitest';
import { OrderCreateSchema, PaymentSubmitSchema, SignupSchema } from '../lib/validators';

describe('Marketplace Validators & Business Logic', () => {
  it('validates correct user signup input', () => {
    const validUser = {
      email: 'gamer@cs2bd.bd',
      password: 'SecurePassword123!',
      name: 'Tanvir Hossain',
      phone: '01711223344',
    };

    const result = SignupSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('rejects invalid Bangladeshi phone number during signup', () => {
    const invalidUser = {
      email: 'gamer@cs2bd.bd',
      password: 'SecurePassword123!',
      name: 'Tanvir Hossain',
      phone: '12345',
    };

    const result = SignupSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  it('validates bKash payment submission with valid phone & transaction reference', () => {
    const validPayment = {
      orderId: '123e4567-e89b-12d3-a456-426614174000',
      amountCents: 150000,
      paymentMethod: 'BKASH',
      buyerSenderNumber: '01811223344',
      transactionId: 'BK12345678',
    };

    const result = PaymentSubmitSchema.safeParse(validPayment);
    expect(result.success).toBe(true);
  });

  it('rejects payment submission without valid transaction reference', () => {
    const invalidPayment = {
      orderId: '123e4567-e89b-12d3-a456-426614174000',
      amountCents: 150000,
      paymentMethod: 'BKASH',
      buyerSenderNumber: '01811223344',
      transactionId: '123',
    };

    const result = PaymentSubmitSchema.safeParse(invalidPayment);
    expect(result.success).toBe(false);
  });
});

describe('Escrow & Fee Calculation Engine', () => {
  function calculateMarketplaceFee(priceCents: number, sellerTrustScore: number): { sellerAmountCents: number; feeCents: number } {
    const feePercent = sellerTrustScore >= 4.8 ? 0.015 : 0.025;
    const feeCents = Math.round(priceCents * feePercent);
    const sellerAmountCents = priceCents - feeCents;
    return { sellerAmountCents, feeCents };
  }

  it('calculates standard 2.5% marketplace fee for normal seller', () => {
    const { sellerAmountCents, feeCents } = calculateMarketplaceFee(100000, 4.2);
    expect(feeCents).toBe(2500);
    expect(sellerAmountCents).toBe(97500);
  });

  it('applies discounted 1.5% fee for top verified sellers (trustScore >= 4.8)', () => {
    const { sellerAmountCents, feeCents } = calculateMarketplaceFee(100000, 4.9);
    expect(feeCents).toBe(1500);
    expect(sellerAmountCents).toBe(98500);
  });
});

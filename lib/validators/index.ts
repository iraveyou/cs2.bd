import { z } from 'zod';

// Mirror Prisma enums locally so we don't depend on generated client types at validation time
const ListingCondition = z.enum([
  'FACTORY_NEW', 'MINT', 'WELL_WORN', 'FIELD_TESTED',
  'BATTLE_SCARRED', 'MINIMAL_WEAR', 'OTHER',
]);

const DeliveryMethod = z.enum([
  'INSTANT', 'MANUAL_STEAM_TRADE', 'KEY', 'OTHER',
]);

// User / Auth validation
export const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?(88)?01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
});

// Listing validation
export const ListingCreateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  exterior: ListingCondition,
  floatValue: z.number().min(0).max(1).nullable().optional(),
  paintSeed: z.number().int().nonnegative().nullable().optional(),
  pattern: z.string().nullable().optional(),
  statTrak: z.boolean().default(false),
  souvenir: z.boolean().default(false),
  rarity: z.string().optional(),
  priceCents: z.number().int().positive('Price must be greater than 0'),
  quantity: z.number().int().positive().default(1),
  stock: z.number().int().nonnegative().default(1),
  deliveryMethod: DeliveryMethod,
  steamLink: z.string().url('Invalid Steam trade/inspect link').nullable().optional(),
  tags: z.array(z.string()).default([]),
});

// Order validation (buying skins)
export const OrderCreateSchema = z.object({
  items: z.array(
    z.object({
      listingId: z.string().uuid('Invalid listing ID'),
      quantity: z.number().int().positive('Quantity must be at least 1'),
    })
  ).min(1, 'Order must contain at least one item'),
  paymentMethod: z.enum(['MANUAL_BKASH', 'MANUAL_NAGAD']),
});

// Payment submission validation (submitting transaction reference after manual payment)
export const PaymentSubmitSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  amountCents: z.number().int().positive('Amount must be positive'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  buyerSenderNumber: z.string().regex(/^\+?(88)?01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  transactionId: z.string().min(5, 'Transaction ID must be at least 5 characters long'),
  screenshotUrl: z.string().url('Invalid screenshot URL').optional(),
});

// Seller Application validation
export const SellerApplicationSchema = z.object({
  name: z.string().min(3, 'Full legal name is required'),
  nidNumber: z.string().min(10, 'NID must be at least 10 digits').max(17, 'NID must not exceed 17 digits'),
  facebookUrl: z.string().url('Invalid Facebook profile URL').optional(),
  steamUrl: z.string().url('Invalid Steam profile URL'),
  discordUsername: z.string().min(2, 'Invalid Discord username'),
  phone: z.string().regex(/^\+?(88)?01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  bankName: z.string().min(2, 'Bank name is required'),
  bankAccountNumber: z.string().min(8, 'Bank account number is required'),
  bkashNumber: z.string().regex(/^\+?(88)?01[3-9]\d{8}$/, 'Invalid bKash number').optional(),
  nagadNumber: z.string().regex(/^\+?(88)?01[3-9]\d{8}$/, 'Invalid Nagad number').optional(),
});

// Inferred types for use in components
export type SignupInput = z.infer<typeof SignupSchema>;
export type ListingCreateInput = z.infer<typeof ListingCreateSchema>;
export type OrderCreateInput = z.infer<typeof OrderCreateSchema>;
export type PaymentSubmitInput = z.infer<typeof PaymentSubmitSchema>;
export type SellerApplicationInput = z.infer<typeof SellerApplicationSchema>;

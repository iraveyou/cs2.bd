import prisma from '../prisma';
import { OrderStatus, Currency } from '@prisma/client';

export interface CreateOrderDTO {
  buyerId: string;
  storeId: string;
  listingId: string;
  priceCents: number;
  deliverySteamTradeUrl?: string;
}

export class OrderRepository {
  /**
   * Find order by ID with buyer, store, items, and payment details
   */
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        buyer: true,
        store: true,
        items: {
          include: {
            listing: true,
          },
        },
        payments: true,
        dispute: true,
      },
    });
  }

  /**
   * Create an escrow-protected marketplace order
   */
  async createOrder(dto: CreateOrderDTO) {
    const reservationMinutes = 30;
    const reservedUntil = new Date(Date.now() + reservationMinutes * 60 * 1000);

    return prisma.order.create({
      data: {
        buyerId: dto.buyerId,
        storeId: dto.storeId,
        totalCents: dto.priceCents,
        currency: Currency.BDT,
        status: OrderStatus.RESERVED,
        reservedUntil,
        deliveryInfo: dto.deliverySteamTradeUrl
          ? { tradeUrl: dto.deliverySteamTradeUrl }
          : undefined,
        items: {
          create: [
            {
              listingId: dto.listingId,
              priceCents: dto.priceCents,
              quantity: 1,
              itemSnapshot: { reservedAt: new Date().toISOString() },
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });
  }

  /**
   * Update order status safely
   */
  async updateStatus(id: string, status: OrderStatus) {
    const data: any = { status };
    if (status === OrderStatus.COMPLETED) {
      data.completedAt = new Date();
    }

    return prisma.order.update({
      where: { id },
      data,
    });
  }

  /**
   * List buyer orders
   */
  async findBuyerOrders(buyerId: string) {
    return prisma.order.findMany({
      where: { buyerId },
      orderBy: { createdAt: 'desc' },
      include: {
        store: true,
        items: {
          include: { listing: true },
        },
        payments: true,
      },
    });
  }
}

export const orderRepository = new OrderRepository();

import prisma from '../prisma';
import { ListingCondition, DeliveryMethod, Currency } from '@prisma/client';

export interface ListingFilter {
  category?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  minFloat?: number;
  maxFloat?: number;
  exterior?: ListingCondition;
  statTrak?: boolean;
  souvenir?: boolean;
  search?: string;
  storeId?: string;
  page?: number;
  limit?: number;
}

export interface CreateListingDTO {
  storeId: string;
  sku: string;
  name: string;
  description?: string;
  exterior: ListingCondition;
  floatValue?: number;
  paintSeed?: number;
  statTrak?: boolean;
  souvenir?: boolean;
  rarity?: string;
  priceCents: number;
  quantity?: number;
  stock?: number;
  deliveryMethod: DeliveryMethod;
  steamLink?: string;
  mediaUrls?: string[];
}

export class ListingRepository {
  /**
   * Find listing by unique ID with store and media details
   */
  async findById(id: string) {
    return prisma.listing.findUnique({
      where: { id },
      include: {
        store: true,
        media: true,
        stats: true,
      },
    });
  }

  /**
   * Find listings with flexible filtering, pagination and sorting
   */
  async findMany(filters: ListingFilter = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'ACTIVE',
    };

    if (filters.storeId) where.storeId = filters.storeId;
    if (filters.exterior) where.exterior = filters.exterior;
    if (filters.statTrak !== undefined) where.statTrak = filters.statTrak;
    if (filters.souvenir !== undefined) where.souvenir = filters.souvenir;

    if (filters.minPriceCents || filters.maxPriceCents) {
      where.priceCents = {};
      if (filters.minPriceCents) where.priceCents.gte = filters.minPriceCents;
      if (filters.maxPriceCents) where.priceCents.lte = filters.maxPriceCents;
    }

    if (filters.minFloat || filters.maxFloat) {
      where.floatValue = {};
      if (filters.minFloat) where.floatValue.gte = filters.minFloat;
      if (filters.maxFloat) where.floatValue.lte = filters.maxFloat;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          store: true,
          media: true,
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Create a new marketplace listing
   */
  async create(data: CreateListingDTO) {
    return prisma.listing.create({
      data: {
        storeId: data.storeId,
        sku: data.sku,
        name: data.name,
        description: data.description,
        exterior: data.exterior,
        floatValue: data.floatValue ? data.floatValue : undefined,
        paintSeed: data.paintSeed,
        statTrak: data.statTrak ?? false,
        souvenir: data.souvenir ?? false,
        rarity: data.rarity,
        currency: Currency.BDT,
        priceCents: data.priceCents,
        quantity: data.quantity ?? 1,
        stock: data.stock ?? 1,
        deliveryMethod: data.deliveryMethod,
        steamLink: data.steamLink,
        media: data.mediaUrls?.length
          ? {
              create: data.mediaUrls.map((url, idx) => ({
                mediaId: `med_${Date.now()}_${idx}`,
                type: 'IMAGE',
                url,
                isPrimary: idx === 0,
              })),
            }
          : undefined,
      },
      include: {
        store: true,
        media: true,
      },
    });
  }

  /**
   * Soft delete or archive a listing
   */
  async archive(id: string) {
    return prisma.listing.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }
}

export const listingRepository = new ListingRepository();

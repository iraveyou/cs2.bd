import type { Metadata } from 'next';
import MarketplaceClient from './marketplace-client';
import { prisma } from '../../lib/prisma';

export const metadata: Metadata = {
  title: 'CS2 Skins Marketplace — cs2bd',
  description: 'Browse thousands of CS2 skins listed by verified sellers in Bangladesh. Filter by rarity, weapon, float, and price. Pay via bKash & Nagad.',
};

export const dynamic = 'force-dynamic';

export default async function MarketplacePage() {
  const dbListings = await prisma.listing.findMany({
    where: { status: 'ACTIVE' },
    include: {
      store: { select: { name: true, slug: true, trustScore: true } },
      media: { where: { isPrimary: true }, take: 1, select: { url: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const listings = dbListings.map((l) => ({
    id: l.id,
    name: l.name,
    exterior: l.exterior,
    rarity: l.rarity || 'Covert',
    priceCents: l.priceCents,
    floatValue: l.floatValue ? Number(l.floatValue) : null,
    statTrak: l.statTrak,
    souvenir: l.souvenir,
    image: l.media[0]?.url || null,
    store: l.store ? { name: l.store.name, slug: l.store.slug, trustScore: l.store.trustScore } : null,
    slug: l.id,
  }));

  return <MarketplaceClient initialListings={listings} />;
}

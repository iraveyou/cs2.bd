import type { Metadata } from 'next';
import MarketplaceClient from './marketplace-client';
import { prisma } from '../../lib/prisma';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';

export const metadata: Metadata = {
  title: 'CS2 Skins Marketplace — Browse & Buy | cs2bd Bangladesh',
  description: 'Browse thousands of CS2 skins listed by verified sellers in Bangladesh. Filter by category, rarity, wear, float, and price. Pay securely via bKash & Nagad.',
  keywords: [
    'cs2 skins marketplace', 'buy cs2 skins', 'cs2 knife bd', 'cs2 gloves bangladesh',
    'cs2 ak-47 skins', 'cs2 awp skins', 'cs2 m4 skins', 'cs2 deagle skins',
    'counter strike 2 marketplace', 'steam skins bangladesh', 'cs2 skin shop bd',
  ],
  alternates: { canonical: `${baseUrl}/marketplace` },
  openGraph: {
    title: 'CS2 Skins Marketplace | cs2bd Bangladesh',
    description: 'Browse thousands of CS2 skins from verified Bangladeshi sellers. Filter and buy with bKash & Nagad.',
    url: `${baseUrl}/marketplace`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CS2 Skins Marketplace | cs2bd',
    description: 'Browse thousands of CS2 skins from verified Bangladeshi sellers.',
  },
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
    take: 24,
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

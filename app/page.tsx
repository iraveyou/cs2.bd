import type { Metadata } from 'next';
import HomeClient from './home/home-client';
import { prisma } from '../lib/prisma';
import { generateOrganizationSchema } from '../lib/seo/schema';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';

export const metadata: Metadata = {
  title: 'CS2BD — Bangladesh CS2 Skins Marketplace',
  description: 'Buy and sell CS2 skins securely in Bangladesh. Verified sellers, bKash & Nagad payment verification, lowest prices. Knives, Gloves, Rifles, Pistols & more.',
  keywords: [
    'cs2 skins bangladesh', 'cs2 marketplace bd', 'buy cs2 skins', 'sell cs2 skins',
    'cs2 knife bd', 'cs2 glove bangladesh', 'cs2 trading', 'bkash cs2', 'nagad cs2',
    'counter strike 2 marketplace', 'cs2 skin escrow', 'steam trade bangladesh',
  ],
  alternates: { canonical: baseUrl },
  openGraph: {
    title: 'CS2BD — Bangladesh CS2 Skins Marketplace',
    description: "Bangladesh's #1 CS2 skins marketplace — buy and sell skins securely with bKash & Nagad escrow protection.",
    url: baseUrl,
    type: 'website',
    images: [{ url: '/og-cs2.png', width: 1200, height: 630, alt: 'CS2BD Marketplace' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CS2BD — Bangladesh CS2 Skins Marketplace',
    description: "Bangladesh's #1 CS2 skins marketplace — buy and sell skins securely with bKash & Nagad escrow protection.",
    images: ['/og-cs2.png'],
  },
};

export const dynamic = 'force-dynamic';

async function getFeaturedListings() {
  try {
    const featured = await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      include: {
        store: { select: { name: true, slug: true, trustScore: true } },
        media: { where: { isPrimary: true }, take: 1, select: { url: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
    return featured.map((l: any) => ({
      id: l.id,
      name: l.name,
      exterior: l.exterior,
      rarity: l.rarity || 'Covert',
      priceCents: l.priceCents,
      floatValue: l.floatValue ? Number(l.floatValue) : null,
      statTrak: l.statTrak,
      souvenir: l.souvenir,
      image: l.media?.[0]?.url || null,
      store: l.store ? { name: l.store.name, slug: l.store.slug, trustScore: l.store.trustScore } : null,
      slug: l.id,
    }));
  } catch (e) {
    console.error('Failed to fetch featured listings:', e);
    return [];
  }
}

async function getStats() {
  try {
    const [totalListings, sellerCount, volumeAgg, completedOrders, totalOrders] = await Promise.all([
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: { in: ['SELLER', 'ADMIN'] } } }),
      prisma.order.aggregate({ where: { status: 'COMPLETED' }, _sum: { totalCents: true } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.count(),
    ]);

    return {
      skinsListed: totalListings || 0,
      verifiedSellers: sellerCount || 0,
      tradedVolume: (volumeAgg as any)?._sum?.totalCents || 0,
      verifiedRate: totalOrders > 0 ? Math.round(((completedOrders || 0) / totalOrders) * 100) : 99,
    };
  } catch (e) {
    console.error('Failed to fetch stats:', e);
    return { skinsListed: 0, verifiedSellers: 0, tradedVolume: 0, verifiedRate: 99 };
  }
}

export default async function HomePage() {
  const [featuredListings, stats] = await Promise.all([getFeaturedListings(), getStats()]);
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <HomeClient featuredListings={featuredListings} stats={stats} />
    </>
  );
}

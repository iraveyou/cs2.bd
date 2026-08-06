import { MetadataRoute } from 'next';
import prisma from '../lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'always', priority: 1.0 },
    { url: `${baseUrl}/marketplace`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${baseUrl}/deals`, lastModified: now, changeFrequency: 'hourly', priority: 0.85 },
    { url: `${baseUrl}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/stores`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/become-seller`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/support`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/affiliate`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const categoryFilterRoutes: MetadataRoute.Sitemap = [
    'knives', 'gloves', 'rifles', 'pistols', 'smg', 'shotguns',
    'machine-guns', 'stickers', 'cases', 'agents', 'music-kits', 'patches',
  ].map((cat) => ({
    url: `${baseUrl}/marketplace?category=${cat}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.75,
  }));

  try {
    const [listings, stores, collections] = await Promise.all([
      prisma.listing.findMany({
        take: 500,
        where: { status: 'ACTIVE' },
        select: { id: true, updatedAt: true, name: true },
      }),
      prisma.store.findMany({
        take: 100,
        select: { slug: true, updatedAt: true },
      }),
      prisma.listing.findMany({
        take: 100,
        where: { status: 'ACTIVE', tags: { isEmpty: false } },
        select: { tags: true },
        distinct: ['tags'],
      }),
    ]);

    const listingUrls: MetadataRoute.Sitemap = listings.map((item) => ({
      url: `${baseUrl}/listing/${item.id}`,
      lastModified: item.updatedAt,
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    const storeUrls: MetadataRoute.Sitemap = stores.map((store) => ({
      url: `${baseUrl}/store/${store.slug}`,
      lastModified: store.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.65,
    }));

    const uniqueTags = [...new Set(collections.flatMap((l) => (l.tags as string[] || []).slice(0, 3)))].slice(0, 50);
    const tagUrls: MetadataRoute.Sitemap = uniqueTags.map((tag) => ({
      url: `${baseUrl}/tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryFilterRoutes, ...listingUrls, ...storeUrls, ...tagUrls];
  } catch (err) {
    console.error('Sitemap generation error:', err);
    return [...staticRoutes, ...categoryFilterRoutes];
  }
}

import { MetadataRoute } from 'next';
import prisma from '../lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sellers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  try {
    const listings = await prisma.listing.findMany({
      take: 200,
      select: { id: true, updatedAt: true },
    });

    const listingUrls: MetadataRoute.Sitemap = listings.map((item) => ({
      url: `${baseUrl}/listing/${item.id}`,
      lastModified: item.updatedAt,
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    const categories = ['knives', 'gloves', 'rifles', 'pistols', 'smg', 'stickers', 'cases', 'agents'];
    const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/marketplace?category=${cat}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryUrls, ...listingUrls];
  } catch (err) {
    return staticRoutes;
  }
}

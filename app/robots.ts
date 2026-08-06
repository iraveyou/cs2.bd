import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/buyer/', '/seller/', '/auth/', '/unauthorized'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/buyer/', '/seller/', '/unauthorized'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

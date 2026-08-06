import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';

  try {
    const listings = await prisma.listing.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    const itemsXml = listings
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.name} (${item.exterior})]]></title>
      <link>${baseUrl}/listing/${item.id}</link>
      <guid>${baseUrl}/listing/${item.id}</guid>
      <pubDate>${item.createdAt.toUTCString()}</pubDate>
      <description><![CDATA[Buy ${item.name} in Bangladesh for ৳${(item.priceCents / 100).toLocaleString('en-BD')}. Escrow protected with bKash & Nagad.]]></description>
    </item>`
      )
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>cs2bd BD — CS2 Marketplace Feed</title>
    <link>${baseUrl}</link>
    <description>Latest Counter-Strike 2 skins, knives, and gloves available in Bangladesh with instant bKash payment.</description>
    <language>en-bd</language>
    ${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  } catch (err) {
    return new NextResponse('<rss version="2.0"><channel><title>cs2bd BD</title></channel></rss>', {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}

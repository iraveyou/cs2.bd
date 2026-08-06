import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';

  try {
    const listings = await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        name: true,
        description: true,
        priceCents: true,
        exterior: true,
        createdAt: true,
      },
    });

    const items = listings.map((l) => {
      const title = `Buy ${l.name} (${l.exterior}) — ৳${Math.round(l.priceCents / 100).toLocaleString('en-BD')}`;
      const description = l.description || `Purchase ${l.name} (${l.exterior}) for ৳${Math.round(l.priceCents / 100).toLocaleString('en-BD')} on CS2BD Bangladesh. bKash & Nagad accepted.`;
      const url = `${baseUrl}/listing/${l.id}`;
      const pubDate = new Date(l.createdAt).toUTCString();

      return `<item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>CS2 Skins</category>
    </item>`;
    });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CS2BD — Bangladesh CS2 Skins Marketplace</title>
    <link>${baseUrl}</link>
    <description>Latest CS2 skins listed by verified Bangladeshi sellers. Buy with bKash &amp; Nagad escrow protection. Knives, Gloves, Rifles, Pistols &amp; more.</description>
    <language>en-bd</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/icons/icon-192.svg</url>
      <title>CS2BD — Bangladesh CS2 Skins Marketplace</title>
      <link>${baseUrl}</link>
      <width>192</width>
      <height>192</height>
    </image>
    <category>Shopping</category>
    <category>Gaming</category>
    ${items.join('\n    ')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('RSS feed generation error:', err);
    return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>CS2BD — Bangladesh CS2 Skins Marketplace</title>
    <link>${baseUrl}</link>
    <description>Latest CS2 skins in Bangladesh</description>
  </channel>
</rss>`, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth/nextauth';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ ok: false, message: 'Please sign in to create a listing.' }, { status: 401 });
    }

    const userId = (session as any).userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ ok: false, message: 'Only verified sellers can create listings.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      category,
      exterior,
      rarity,
      price,
      quantity,
      floatValue,
      paintSeed,
      statTrak,
      souvenir,
      steamLink,
      description,
      tags,
      seoKeywords,
      slug,
      images,
      videoUrl,
      watermarked,
    } = body;

    if (!name || !price) {
      return NextResponse.json({ ok: false, message: 'Item name and price are required.' }, { status: 400 });
    }

    const priceCents = Math.round(parseFloat(price) * 100);
    const floatNum = floatValue ? parseFloat(floatValue) : null;
    const seedNum = paintSeed ? parseInt(paintSeed, 10) : null;
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-bd';
    const sku = `UG-${Math.floor(100000 + Math.random() * 900000)}`;

    let store = await prisma.store.findFirst({ where: { userId: user.id } });
    if (!store) {
      store = await prisma.store.create({
        data: {
          userId: user.id,
          name: `${user.name ?? 'BD Trader'}'s Store`,
          slug: `${user.name ?? 'bd-trader'}-store`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        },
      });
    }

    const listing = await prisma.listing.create({
      data: {
        storeId: store.id,
        ownerId: user.id,
        sku: sku,
        name: name,
        description: description || '',
        exterior: exterior || 'FACTORY_NEW',
        priceCents: priceCents,
        floatValue: floatNum,
        paintSeed: seedNum,
        statTrak: !!statTrak,
        souvenir: !!souvenir,
        rarity: rarity || 'Covert',
        deliveryMethod: 'MANUAL_STEAM_TRADE',
        steamLink: steamLink || '',
        quantity: parseInt(quantity || '1', 10),
        tags: typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : [],
      },
    });

    return NextResponse.json({
      ok: true,
      message: 'Listing published live on cs2bd Marketplace!',
      listingId: listing.id,
      slug: generatedSlug,
    });
  } catch (err: any) {
    console.error('Error creating listing:', err);
    return NextResponse.json({ ok: false, message: err.message || 'Failed to create listing' }, { status: 500 });
  }
}

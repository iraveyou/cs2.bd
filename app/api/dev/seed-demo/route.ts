import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { hash } from '@node-rs/argon2';

const PASSWORD = 'demo1234';

const DEMO_ACCOUNTS = [
  {
    email: 'buyer@cs2bd.bd',
    name: 'Demo Buyer',
    role: 'USER' as const,
    store: null,
    type: 'Regular buyer — can browse marketplace, buy skins, view inventory',
  },
  {
    email: 'applicant@cs2bd.bd',
    name: 'Demo Applicant',
    role: 'SELLER_APPLICANT' as const,
    store: null,
    type: 'Pending seller application — can access seller dashboard in read-only',
  },
  {
    email: 'seller@cs2bd.bd',
    name: 'Demo Seller',
    role: 'SELLER' as const,
    store: { name: 'BD Demo Shop', slug: 'bd-demo-shop', description: 'Official CS2BD demo seller store' },
    type: 'Verified seller — can list skins, manage orders, receive payments',
  },
  {
    email: 'moderator@cs2bd.bd',
    name: 'Demo Moderator',
    role: 'MODERATOR' as const,
    store: null,
    type: 'Content moderator — can review listings, manage disputes',
  },
  {
    email: 'support@cs2bd.bd',
    name: 'Demo Support',
    role: 'SUPPORT' as const,
    store: null,
    type: 'Support agent — can view tickets, assist buyers and sellers',
  },
  {
    email: 'admin@cs2bd.bd',
    name: 'Demo Admin',
    role: 'ADMIN' as const,
    store: { name: 'CS2BD Official Store', slug: 'cs2bd-official-store', description: 'Official CS2BD admin store with curated skins' },
    type: 'Full admin — verify payments, approve sellers, manage CMS, all permissions',
  },
];

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, message: 'Disabled in production' }, { status: 403 });
  }

  try {
    const passwordHash = await hash(PASSWORD);
    const results: any[] = [];
    let created = 0;
    let skipped = 0;

    for (const acc of DEMO_ACCOUNTS) {
      const existing = await prisma.user.findUnique({ where: { email: acc.email } });
      if (existing) {
        results.push({ email: acc.email, status: 'exists', role: acc.role });
        skipped++;
        continue;
      }

      const user = await prisma.user.create({
        data: {
          email: acc.email,
          name: acc.name,
          passwordHash,
          role: acc.role,
        },
      });

      if (acc.store) {
        const existingStore = await prisma.store.findFirst({ where: { userId: user.id } });
        if (!existingStore) {
          await prisma.store.create({
            data: {
              userId: user.id,
              name: acc.store.name,
              slug: acc.store.slug,
              description: acc.store.description,
              verifiedAt: new Date(),
              kycStatus: 'VERIFIED',
              trustScore: 4.95,
            },
          });
        }
      }

      results.push({ email: acc.email, status: 'created', role: acc.role });
      created++;
    }

    return NextResponse.json({
      ok: true,
      message: `Created ${created} accounts, ${skipped} already existed`,
      password: PASSWORD,
      accounts: DEMO_ACCOUNTS.map((a) => ({
        email: a.email,
        role: a.role,
        description: a.type,
      })),
      results,
    });
  } catch (err: any) {
    console.error('seed-demo error', err);
    return NextResponse.json({ ok: false, message: err.message || 'Error' }, { status: 500 });
  }
}

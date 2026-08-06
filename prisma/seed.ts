import { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/argon2';
import * as dotenv from 'dotenv';

dotenv.config();

const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const dbUrl = process.env.DATABASE_URL || '';
const needsSsl = dbUrl.includes('sslmode=require') || dbUrl.includes('supabase');

const poolConfig: any = {
  connectionString: dbUrl,
};

if (needsSsl) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const DEMO_PASSWORD = 'demo1234';

async function seed() {
  const passwordHash = await hash(DEMO_PASSWORD);

  const accounts = [
    { email: 'buyer@cs2bd.bd',     name: 'Demo Buyer',     role: 'USER'             as const },
    { email: 'seller@cs2bd.bd',    name: 'Demo Seller',    role: 'SELLER'           as const },
    { email: 'applicant@cs2bd.bd', name: 'Demo Applicant', role: 'SELLER_APPLICANT'  as const },
    { email: 'moderator@cs2bd.bd', name: 'Demo Moderator', role: 'MODERATOR'         as const },
    { email: 'support@cs2bd.bd',   name: 'Demo Support',   role: 'SUPPORT'           as const },
    { email: 'admin@cs2bd.bd',     name: 'Demo Admin',     role: 'ADMIN'             as const },
  ];

  for (const acc of accounts) {
    const existing = await prisma.user.findUnique({ where: { email: acc.email } });
    if (existing) {
      console.log(`SKIP: ${acc.email} (already exists)`);
      continue;
    }

    await prisma.user.create({
      data: {
        email: acc.email,
        name: acc.name,
        passwordHash,
        role: acc.role,
      },
    });
    console.log(`CREATED: ${acc.email} (${acc.role})`);
  }

  console.log('\n--- Demo Credentials ---');
  console.log(`Password for all: ${DEMO_PASSWORD}`);
  accounts.forEach((a) => console.log(`  ${a.email} → ${a.role}`));

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});

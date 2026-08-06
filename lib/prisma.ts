import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  if (process.env.DATABASE_URL) {
    const { PrismaPg } = require('@prisma/adapter-pg');
    const { Pool } = require('pg');

    const dbUrl = process.env.DATABASE_URL;
    const needsSsl = dbUrl.includes('sslmode=require') || dbUrl.includes('supabase');

    const poolConfig: any = {
      connectionString: dbUrl,
    };

    if (needsSsl) {
      poolConfig.ssl = { rejectUnauthorized: false };
    }

    const pool = new Pool(poolConfig);
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter } as any);
  }

  return new PrismaClient();
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

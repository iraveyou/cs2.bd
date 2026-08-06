import { PrismaClient } from '@prisma/client';

let prismaClient: any;

try {
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
    prismaClient = new PrismaClient({ adapter } as any);
  }
} catch (e) {
  console.warn('[CS2BD] Database connection init failed or DATABASE_URL missing:', e);
}

const noOpHandler: any = {
  get(_target: any, prop: string) {
    if (prop === 'then') return undefined;
    if (['$connect', '$disconnect', '$on', '$transaction', '$use', '$extends'].includes(prop)) {
      return async () => [];
    }
    return new Proxy({}, {
      get(_: any, action: string) {
        if (action === 'then') return undefined;
        return async (args?: any) => {
          if (action.startsWith('findMany') || action === 'findRaw') return [];
          if (action.startsWith('find') || action.startsWith('get')) return null;
          if (action.startsWith('count')) return 0;
          if (action.startsWith('aggregate')) return {};
          if (action === 'create' || action === 'update' || action === 'upsert') return args?.data ?? {};
          if (action === 'delete' || action === 'deleteMany') return { count: 0 };
          return [];
        };
      }
    });
  }
};

const safePrismaProxy = new Proxy({}, {
  get(_: any, prop: string) {
    if (prismaClient && prismaClient[prop]) {
      const original = prismaClient[prop];
      if (typeof original === 'function') {
        return async (...args: any[]) => {
          try {
            return await original.apply(prismaClient, args);
          } catch (err) {
            console.warn(`[AI Studio] Prisma operation ${prop} failed:`, err);
            return [];
          }
        };
      } else if (typeof original === 'object' && original !== null) {
        return new Proxy(original, {
          get(targetModel: any, modelAction: string) {
            const method = targetModel[modelAction];
            if (typeof method === 'function') {
              return async (...args: any[]) => {
                try {
                  return await method.apply(targetModel, args);
                } catch (err) {
                  console.warn(`[AI Studio] Prisma ${prop}.${modelAction} failed:`, err);
                  if (modelAction.startsWith('findMany')) return [];
                  if (modelAction.startsWith('find')) return null;
                  if (modelAction.startsWith('count')) return 0;
                  return args?.[0]?.data ?? {};
                }
              };
            }
            return method;
          }
        });
      }
      return original;
    }
    return noOpHandler.get(null, prop);
  }
});

export const prisma = safePrismaProxy as PrismaClient;
export default prisma;

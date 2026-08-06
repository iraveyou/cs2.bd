import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET() {
  const pool = new Pool({
    host: "2406:da1a:314:7100:5f35:3590:2d6b:a51e",
    port: 6543,
    database: "postgres",
    user: "postgres",
    password: "Undergroundcs2storebd",
    ssl: { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 15000,
    family: 6,
  });

  const results: string[] = [];

  try {
    for (const sql of MIGRATION_SQL) {
      await pool.query(sql).catch((e: any) => {
        if (!e.message.includes("already exists") && !e.message.includes("duplicate key")) {
          throw e;
        }
      });
    }
    results.push("migration complete");
    return NextResponse.json({ ok: true, steps: results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, detail: e.detail, steps: results }, { status: 500 });
  } finally {
    await pool.end();
  }
}

const MIGRATION_SQL = [
  // Enums
  `DO $$ BEGIN CREATE TYPE "Role" AS ENUM ('USER','SELLER_APPLICANT','SELLER','MODERATOR','SUPPORT','ADMIN'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "OrderStatus" AS ENUM ('RESERVED','PENDING_VERIFICATION','AWAITING_DELIVERY','DELIVERED','COMPLETED','CANCELLED','REFUNDED','DISPUTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID','SUBMITTED','VERIFIED','REJECTED','DUPLICATE','FLAGGED','REFUNDED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "ListingCondition" AS ENUM ('FACTORY_NEW','MINT','WELL_WORN','FIELD_TESTED','BATTLE_SCARRED','MINIMAL_WEAR','OTHER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "DeliveryMethod" AS ENUM ('INSTANT','MANUAL_STEAM_TRADE','KEY','OTHER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "Currency" AS ENUM ('BDT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "MediaType" AS ENUM ('IMAGE','VIDEO','INSPECT_VIDEO','SCREENSHOT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "AuditAction" AS ENUM ('CREATE','UPDATE','DELETE','LOGIN','PAYMENT_VERIFY','PAYMENT_REJECT','ORDER_RESERVE','ORDER_RELEASE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  // Tables
  `CREATE TABLE IF NOT EXISTS "User" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT UNIQUE, phone TEXT UNIQUE, name TEXT, "passwordHash" TEXT, role "Role" DEFAULT 'USER'::"Role", "is2faEnabled" BOOLEAN DEFAULT false, "steamId" TEXT UNIQUE, "discordId" TEXT UNIQUE, "tradeUrl" TEXT, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Session" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "userId" TEXT NOT NULL REFERENCES "User"(id), "expiresAt" TIMESTAMP(3) NOT NULL, "sessionToken" TEXT UNIQUE NOT NULL, "ipAddress" TEXT, "userAgent" TEXT, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Store" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id), slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT, "bannerMediaId" TEXT, "avatarMediaId" TEXT, "trustScore" DOUBLE PRECISION DEFAULT 0, "verifiedAt" TIMESTAMP(3), "kycStatus" TEXT DEFAULT 'PENDING', "bankDetails" JSONB, "payoutMethods" JSONB, "socialLinks" JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Listing" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "storeId" TEXT NOT NULL REFERENCES "Store"(id), "ownerId" TEXT REFERENCES "User"(id), sku TEXT NOT NULL, name TEXT NOT NULL, description TEXT, tags TEXT[] DEFAULT ARRAY[]::TEXT[], exterior "ListingCondition" NOT NULL, "floatValue" DECIMAL(5,4), "paintSeed" INTEGER, pattern TEXT, "statTrak" BOOLEAN DEFAULT false, souvenir BOOLEAN DEFAULT false, rarity TEXT, currency "Currency" DEFAULT 'BDT'::"Currency", "priceCents" INTEGER NOT NULL, quantity INTEGER DEFAULT 1, stock INTEGER DEFAULT 1, "deliveryMethod" "DeliveryMethod" NOT NULL, "steamLink" TEXT, status TEXT DEFAULT 'ACTIVE', "seoMetaId" TEXT, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, UNIQUE("storeId", sku))`,
  `CREATE TABLE IF NOT EXISTS "ListingMedia" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "listingId" TEXT NOT NULL REFERENCES "Listing"(id), "mediaId" TEXT NOT NULL, type "MediaType" NOT NULL, "sortOrder" INTEGER DEFAULT 0, url TEXT NOT NULL, "thumbUrl" TEXT, width INTEGER, height INTEGER, "isPrimary" BOOLEAN DEFAULT false, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "ListingStats" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "listingId" TEXT UNIQUE NOT NULL REFERENCES "Listing"(id), views INTEGER DEFAULT 0, favorites INTEGER DEFAULT 0, "soldCount" INTEGER DEFAULT 0, "lastSoldAt" TIMESTAMP(3))`,
  `CREATE TABLE IF NOT EXISTS "Order" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "orderNumber" SERIAL, "buyerId" TEXT NOT NULL REFERENCES "User"(id), "storeId" TEXT NOT NULL REFERENCES "Store"(id), "totalCents" INTEGER NOT NULL, currency "Currency" DEFAULT 'BDT'::"Currency", status "OrderStatus" NOT NULL, "reservedUntil" TIMESTAMP(3), "deliveryInfo" JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "completedAt" TIMESTAMP(3))`,
  `CREATE TABLE IF NOT EXISTS "OrderItem" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "orderId" TEXT NOT NULL REFERENCES "Order"(id), "listingId" TEXT NOT NULL REFERENCES "Listing"(id), "priceCents" INTEGER NOT NULL, quantity INTEGER DEFAULT 1, "itemSnapshot" JSONB NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "Payment" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "orderId" TEXT NOT NULL REFERENCES "Order"(id), "buyerId" TEXT REFERENCES "User"(id), "amountCents" INTEGER NOT NULL, currency "Currency" DEFAULT 'BDT'::"Currency", status "PaymentStatus" DEFAULT 'UNPAID'::"PaymentStatus", "paymentMethod" TEXT NOT NULL, "merchantNumber" TEXT, "buyerSenderNumber" TEXT, "transactionId" TEXT, "screenshotMediaId" TEXT, "submittedAt" TIMESTAMP(3), "verifiedAt" TIMESTAMP(3), "rejectedAt" TIMESTAMP(3), "adminVerifierId" TEXT, flags JSONB, meta JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Media" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "ownerId" TEXT, provider TEXT NOT NULL, url TEXT NOT NULL, width INTEGER, height INTEGER, "sizeBytes" INTEGER, "mimeType" TEXT, "perceptualHash" TEXT, "safeScore" DOUBLE PRECISION, meta JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "AuditLog" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "actorId" TEXT, action "AuditAction" NOT NULL, "targetType" TEXT, "targetId" TEXT, meta JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "SeoMeta" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "titleTemplate" TEXT, "descriptionTemplate" TEXT, "ogTitle" TEXT, "ogImage" TEXT, "structuredData" JSONB)`,
  `CREATE TABLE IF NOT EXISTS "FeatureFlag" (key TEXT PRIMARY KEY, enabled BOOLEAN DEFAULT false, rules JSONB)`,
  `CREATE TABLE IF NOT EXISTS "Permission" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), key TEXT UNIQUE NOT NULL, name TEXT NOT NULL, "desc" TEXT)`,
  `CREATE TABLE IF NOT EXISTS "Category" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), key TEXT UNIQUE NOT NULL, name TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "Tag" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), key TEXT UNIQUE NOT NULL, name TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "Notification" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "userId" TEXT NOT NULL REFERENCES "User"(id), type TEXT NOT NULL, channel TEXT NOT NULL, data JSONB NOT NULL, "isRead" BOOLEAN DEFAULT false, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Favorite" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "userId" TEXT NOT NULL REFERENCES "User"(id), "listingId" TEXT NOT NULL REFERENCES "Listing"(id), "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, UNIQUE("userId", "listingId"))`,
  `CREATE TABLE IF NOT EXISTS "RecentlyViewed" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "userId" TEXT NOT NULL REFERENCES "User"(id), "listingId" TEXT NOT NULL REFERENCES "Listing"(id), "viewedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Review" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "listingId" TEXT NOT NULL REFERENCES "Listing"(id), "reviewerId" TEXT NOT NULL REFERENCES "User"(id), rating INTEGER NOT NULL, title TEXT, comment TEXT, images JSONB, "verifiedPurchase" BOOLEAN DEFAULT false, "helpfulCount" INTEGER DEFAULT 0, "moderatedAt" TIMESTAMP(3), status TEXT DEFAULT 'VISIBLE', "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Dispute" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "orderId" TEXT UNIQUE NOT NULL REFERENCES "Order"(id), "openerId" TEXT NOT NULL REFERENCES "User"(id), "responderId" TEXT REFERENCES "User"(id), reason TEXT NOT NULL, status TEXT DEFAULT 'OPEN', evidence JSONB, resolution JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Conversation" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "listingId" TEXT REFERENCES "Listing"(id), "buyerId" TEXT REFERENCES "User"(id), "sellerId" TEXT REFERENCES "User"(id), subject TEXT, "lastMessageAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Message" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "conversationId" TEXT NOT NULL REFERENCES "Conversation"(id), "senderId" TEXT NOT NULL REFERENCES "User"(id), content TEXT, attachments JSONB, "isRead" BOOLEAN DEFAULT false, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Report" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "reporterId" TEXT NOT NULL REFERENCES "User"(id), "targetType" TEXT NOT NULL, "targetId" TEXT NOT NULL, reason TEXT NOT NULL, status TEXT DEFAULT 'OPEN', "handledBy" TEXT, "handledAt" TIMESTAMP(3), meta JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "SupportTicket" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), "userId" TEXT NOT NULL REFERENCES "User"(id), subject TEXT NOT NULL, status TEXT DEFAULT 'OPEN', priority TEXT DEFAULT 'NORMAL', meta JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "Article" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, excerpt TEXT, content TEXT NOT NULL, "authorId" TEXT REFERENCES "User"(id), "publishedAt" TIMESTAMP(3), "isDraft" BOOLEAN DEFAULT true, "seoMetaId" TEXT, categories TEXT[] DEFAULT ARRAY[]::TEXT[], tags TEXT[] DEFAULT ARRAY[]::TEXT[], "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "CMSPage" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid(), key TEXT UNIQUE NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, meta JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "_ListingTag" ("A" TEXT NOT NULL REFERENCES "Listing"(id) ON DELETE CASCADE, "B" TEXT NOT NULL REFERENCES "Tag"(id) ON DELETE CASCADE, PRIMARY KEY ("A", "B"))`,
  `CREATE TABLE IF NOT EXISTS "_ListingCategory" ("A" TEXT NOT NULL REFERENCES "Category"(id) ON DELETE CASCADE, "B" TEXT NOT NULL REFERENCES "Listing"(id) ON DELETE CASCADE, PRIMARY KEY ("A", "B"))`,

  // Indexes
  `CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email)`,
  `CREATE INDEX IF NOT EXISTS "User_phone_idx" ON "User"(phone)`,
  `CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId")`,
  `CREATE INDEX IF NOT EXISTS "Store_slug_idx" ON "Store"(slug)`,
  `CREATE INDEX IF NOT EXISTS "Listing_priceCents_idx" ON "Listing"("priceCents")`,
  `CREATE INDEX IF NOT EXISTS "Listing_storeId_idx" ON "Listing"("storeId")`,
  `CREATE INDEX IF NOT EXISTS "ListingMedia_listingId_idx" ON "ListingMedia"("listingId")`,
  `CREATE INDEX IF NOT EXISTS "Order_buyerId_idx" ON "Order"("buyerId")`,
  `CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx" ON "Order"("orderNumber")`,
  `CREATE INDEX IF NOT EXISTS "Payment_transactionId_idx" ON "Payment"("transactionId")`,
  `CREATE INDEX IF NOT EXISTS "Payment_buyerSenderNumber_idx" ON "Payment"("buyerSenderNumber")`,
  `CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId")`,
  `CREATE INDEX IF NOT EXISTS "Favorite_userId_idx" ON "Favorite"("userId")`,
  `CREATE INDEX IF NOT EXISTS "Favorite_listingId_idx" ON "Favorite"("listingId")`,
  `CREATE INDEX IF NOT EXISTS "RecentlyViewed_userId_idx" ON "RecentlyViewed"("userId")`,
  `CREATE INDEX IF NOT EXISTS "RecentlyViewed_listingId_idx" ON "RecentlyViewed"("listingId")`,
  `CREATE INDEX IF NOT EXISTS "Review_listingId_rating_idx" ON "Review"("listingId", rating)`,
  `CREATE INDEX IF NOT EXISTS "Review_listingId_idx" ON "Review"("listingId")`,
  `CREATE INDEX IF NOT EXISTS "Review_reviewerId_idx" ON "Review"("reviewerId")`,
  `CREATE INDEX IF NOT EXISTS "Dispute_openerId_idx" ON "Dispute"("openerId")`,
  `CREATE INDEX IF NOT EXISTS "Conversation_buyerId_idx" ON "Conversation"("buyerId")`,
  `CREATE INDEX IF NOT EXISTS "Conversation_sellerId_idx" ON "Conversation"("sellerId")`,
  `CREATE INDEX IF NOT EXISTS "Message_conversationId_idx" ON "Message"("conversationId")`,
  `CREATE INDEX IF NOT EXISTS "Message_senderId_idx" ON "Message"("senderId")`,
  `CREATE INDEX IF NOT EXISTS "Report_reporterId_idx" ON "Report"("reporterId")`,
  `CREATE INDEX IF NOT EXISTS "SupportTicket_userId_idx" ON "SupportTicket"("userId")`,
  `CREATE INDEX IF NOT EXISTS "_ListingTag_B_index" ON "_ListingTag"("B")`,
  `CREATE INDEX IF NOT EXISTS "_ListingCategory_B_index" ON "_ListingCategory"("B")`,
];


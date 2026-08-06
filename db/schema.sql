--
-- PostgreSQL database dump
--

\restrict 7ym3tOcE74bV5D46rFgej5IVs1abbFdTp0QM8auVt5W4wSbHKiJebpLe3pWGu2b

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AuditAction; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AuditAction" AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'PAYMENT_VERIFY',
    'PAYMENT_REJECT',
    'ORDER_RESERVE',
    'ORDER_RELEASE'
);


--
-- Name: Currency; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Currency" AS ENUM (
    'BDT'
);


--
-- Name: DeliveryMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DeliveryMethod" AS ENUM (
    'INSTANT',
    'MANUAL_STEAM_TRADE',
    'KEY',
    'OTHER'
);


--
-- Name: ListingCondition; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ListingCondition" AS ENUM (
    'FACTORY_NEW',
    'MINT',
    'WELL_WORN',
    'FIELD_TESTED',
    'BATTLE_SCARRED',
    'MINIMAL_WEAR',
    'OTHER'
);


--
-- Name: MediaType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MediaType" AS ENUM (
    'IMAGE',
    'VIDEO',
    'INSPECT_VIDEO',
    'SCREENSHOT'
);


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'RESERVED',
    'PENDING_VERIFICATION',
    'AWAITING_DELIVERY',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED',
    'REFUNDED',
    'DISPUTED'
);


--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'UNPAID',
    'SUBMITTED',
    'VERIFIED',
    'REJECTED',
    'DUPLICATE',
    'FLAGGED',
    'REFUNDED'
);


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'SELLER_APPLICANT',
    'SELLER',
    'MODERATOR',
    'SUPPORT',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Article; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Article" (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text,
    content text NOT NULL,
    "authorId" text,
    "publishedAt" timestamp(3) without time zone,
    "isDraft" boolean DEFAULT true NOT NULL,
    "seoMetaId" text,
    categories text[] DEFAULT ARRAY[]::text[],
    tags text[] DEFAULT ARRAY[]::text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "actorId" text,
    action public."AuditAction" NOT NULL,
    "targetType" text,
    "targetId" text,
    meta jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: CMSPage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CMSPage" (
    id text NOT NULL,
    key text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    meta jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL
);


--
-- Name: Conversation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Conversation" (
    id text NOT NULL,
    "listingId" text,
    "buyerId" text,
    "sellerId" text,
    subject text,
    "lastMessageAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Dispute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Dispute" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "openerId" text NOT NULL,
    "responderId" text,
    reason text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    evidence jsonb,
    resolution jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Favorite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Favorite" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "listingId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: FeatureFlag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FeatureFlag" (
    key text NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    rules jsonb
);


--
-- Name: Listing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Listing" (
    id text NOT NULL,
    "storeId" text NOT NULL,
    "ownerId" text,
    sku text NOT NULL,
    name text NOT NULL,
    description text,
    tags text[] DEFAULT ARRAY[]::text[],
    exterior public."ListingCondition" NOT NULL,
    "floatValue" numeric(5,4),
    "paintSeed" integer,
    pattern text,
    "statTrak" boolean DEFAULT false NOT NULL,
    souvenir boolean DEFAULT false NOT NULL,
    rarity text,
    currency public."Currency" DEFAULT 'BDT'::public."Currency" NOT NULL,
    "priceCents" integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    stock integer DEFAULT 1 NOT NULL,
    "deliveryMethod" public."DeliveryMethod" NOT NULL,
    "steamLink" text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "seoMetaId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ListingMedia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ListingMedia" (
    id text NOT NULL,
    "listingId" text NOT NULL,
    "mediaId" text NOT NULL,
    type public."MediaType" NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    url text NOT NULL,
    "thumbUrl" text,
    width integer,
    height integer,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ListingStats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ListingStats" (
    id text NOT NULL,
    "listingId" text NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    favorites integer DEFAULT 0 NOT NULL,
    "soldCount" integer DEFAULT 0 NOT NULL,
    "lastSoldAt" timestamp(3) without time zone
);


--
-- Name: Media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Media" (
    id text NOT NULL,
    "ownerId" text,
    provider text NOT NULL,
    url text NOT NULL,
    width integer,
    height integer,
    "sizeBytes" integer,
    "mimeType" text,
    "perceptualHash" text,
    "safeScore" double precision,
    meta jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    "senderId" text NOT NULL,
    content text,
    attachments jsonb,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    channel text NOT NULL,
    data jsonb NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "orderNumber" integer NOT NULL,
    "buyerId" text NOT NULL,
    "storeId" text NOT NULL,
    "totalCents" integer NOT NULL,
    currency public."Currency" DEFAULT 'BDT'::public."Currency" NOT NULL,
    status public."OrderStatus" NOT NULL,
    "reservedUntil" timestamp(3) without time zone,
    "deliveryInfo" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone
);


--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "listingId" text NOT NULL,
    "priceCents" integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "itemSnapshot" jsonb NOT NULL
);


--
-- Name: Order_orderNumber_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Order_orderNumber_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Order_orderNumber_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Order_orderNumber_seq" OWNED BY public."Order"."orderNumber";


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "buyerId" text,
    "amountCents" integer NOT NULL,
    currency public."Currency" DEFAULT 'BDT'::public."Currency" NOT NULL,
    status public."PaymentStatus" DEFAULT 'UNPAID'::public."PaymentStatus" NOT NULL,
    "paymentMethod" text NOT NULL,
    "merchantNumber" text,
    "buyerSenderNumber" text,
    "transactionId" text,
    "screenshotMediaId" text,
    "submittedAt" timestamp(3) without time zone,
    "verifiedAt" timestamp(3) without time zone,
    "rejectedAt" timestamp(3) without time zone,
    "adminVerifierId" text,
    flags jsonb,
    meta jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    "desc" text
);


--
-- Name: RecentlyViewed; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RecentlyViewed" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "listingId" text NOT NULL,
    "viewedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Report" (
    id text NOT NULL,
    "reporterId" text NOT NULL,
    "targetType" text NOT NULL,
    "targetId" text NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "handledBy" text,
    "handledAt" timestamp(3) without time zone,
    meta jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    "listingId" text NOT NULL,
    "reviewerId" text NOT NULL,
    rating integer NOT NULL,
    title text,
    comment text,
    images jsonb,
    "verifiedPurchase" boolean DEFAULT false NOT NULL,
    "helpfulCount" integer DEFAULT 0 NOT NULL,
    "moderatedAt" timestamp(3) without time zone,
    status text DEFAULT 'VISIBLE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: SeoMeta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SeoMeta" (
    id text NOT NULL,
    "titleTemplate" text,
    "descriptionTemplate" text,
    "ogTitle" text,
    "ogImage" text,
    "structuredData" jsonb
);


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "sessionToken" text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Store; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Store" (
    id text NOT NULL,
    "userId" text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    description text,
    "bannerMediaId" text,
    "avatarMediaId" text,
    "trustScore" double precision DEFAULT 0 NOT NULL,
    "verifiedAt" timestamp(3) without time zone,
    "kycStatus" text DEFAULT 'PENDING'::text NOT NULL,
    "bankDetails" jsonb,
    "payoutMethods" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: SupportTicket; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SupportTicket" (
    id text NOT NULL,
    "userId" text NOT NULL,
    subject text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    priority text DEFAULT 'NORMAL'::text NOT NULL,
    meta jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text,
    phone text,
    name text,
    "passwordHash" text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "is2faEnabled" boolean DEFAULT false NOT NULL,
    "steamId" text,
    "discordId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tradeUrl" text
);


--
-- Name: _ListingCategory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_ListingCategory" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


--
-- Name: _ListingTag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_ListingTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: Order orderNumber; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order" ALTER COLUMN "orderNumber" SET DEFAULT nextval('public."Order_orderNumber_seq"'::regclass);


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: CMSPage CMSPage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CMSPage"
    ADD CONSTRAINT "CMSPage_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Conversation Conversation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_pkey" PRIMARY KEY (id);


--
-- Name: Dispute Dispute_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Dispute"
    ADD CONSTRAINT "Dispute_pkey" PRIMARY KEY (id);


--
-- Name: Favorite Favorite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY (id);


--
-- Name: FeatureFlag FeatureFlag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeatureFlag"
    ADD CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY (key);


--
-- Name: ListingMedia ListingMedia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ListingMedia"
    ADD CONSTRAINT "ListingMedia_pkey" PRIMARY KEY (id);


--
-- Name: ListingStats ListingStats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ListingStats"
    ADD CONSTRAINT "ListingStats_pkey" PRIMARY KEY (id);


--
-- Name: Listing Listing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Listing"
    ADD CONSTRAINT "Listing_pkey" PRIMARY KEY (id);


--
-- Name: Media Media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: RecentlyViewed RecentlyViewed_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecentlyViewed"
    ADD CONSTRAINT "RecentlyViewed_pkey" PRIMARY KEY (id);


--
-- Name: Report Report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: SeoMeta SeoMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SeoMeta"
    ADD CONSTRAINT "SeoMeta_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: Store Store_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "Store_pkey" PRIMARY KEY (id);


--
-- Name: SupportTicket SupportTicket_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _ListingCategory _ListingCategory_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_ListingCategory"
    ADD CONSTRAINT "_ListingCategory_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _ListingTag _ListingTag_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_ListingTag"
    ADD CONSTRAINT "_ListingTag_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Article_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Article_slug_key" ON public."Article" USING btree (slug);


--
-- Name: CMSPage_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "CMSPage_key_key" ON public."CMSPage" USING btree (key);


--
-- Name: Category_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Category_key_key" ON public."Category" USING btree (key);


--
-- Name: Conversation_buyerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Conversation_buyerId_idx" ON public."Conversation" USING btree ("buyerId");


--
-- Name: Conversation_sellerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Conversation_sellerId_idx" ON public."Conversation" USING btree ("sellerId");


--
-- Name: Dispute_openerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Dispute_openerId_idx" ON public."Dispute" USING btree ("openerId");


--
-- Name: Dispute_orderId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Dispute_orderId_key" ON public."Dispute" USING btree ("orderId");


--
-- Name: Favorite_listingId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Favorite_listingId_idx" ON public."Favorite" USING btree ("listingId");


--
-- Name: Favorite_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Favorite_userId_idx" ON public."Favorite" USING btree ("userId");


--
-- Name: Favorite_userId_listingId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Favorite_userId_listingId_key" ON public."Favorite" USING btree ("userId", "listingId");


--
-- Name: ListingMedia_listingId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ListingMedia_listingId_idx" ON public."ListingMedia" USING btree ("listingId");


--
-- Name: ListingStats_listingId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ListingStats_listingId_key" ON public."ListingStats" USING btree ("listingId");


--
-- Name: Listing_priceCents_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Listing_priceCents_idx" ON public."Listing" USING btree ("priceCents");


--
-- Name: Listing_storeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Listing_storeId_idx" ON public."Listing" USING btree ("storeId");


--
-- Name: Listing_storeId_sku_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Listing_storeId_sku_key" ON public."Listing" USING btree ("storeId", sku);


--
-- Name: Message_conversationId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Message_conversationId_idx" ON public."Message" USING btree ("conversationId");


--
-- Name: Message_senderId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Message_senderId_idx" ON public."Message" USING btree ("senderId");


--
-- Name: Notification_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Notification_userId_idx" ON public."Notification" USING btree ("userId");


--
-- Name: Order_buyerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Order_buyerId_idx" ON public."Order" USING btree ("buyerId");


--
-- Name: Order_orderNumber_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Order_orderNumber_idx" ON public."Order" USING btree ("orderNumber");


--
-- Name: Payment_buyerSenderNumber_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Payment_buyerSenderNumber_idx" ON public."Payment" USING btree ("buyerSenderNumber");


--
-- Name: Payment_transactionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Payment_transactionId_idx" ON public."Payment" USING btree ("transactionId");


--
-- Name: Permission_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Permission_key_key" ON public."Permission" USING btree (key);


--
-- Name: RecentlyViewed_listingId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "RecentlyViewed_listingId_idx" ON public."RecentlyViewed" USING btree ("listingId");


--
-- Name: RecentlyViewed_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "RecentlyViewed_userId_idx" ON public."RecentlyViewed" USING btree ("userId");


--
-- Name: Report_reporterId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Report_reporterId_idx" ON public."Report" USING btree ("reporterId");


--
-- Name: Review_listingId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Review_listingId_idx" ON public."Review" USING btree ("listingId");


--
-- Name: Review_listingId_rating_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Review_listingId_rating_idx" ON public."Review" USING btree ("listingId", rating);


--
-- Name: Review_reviewerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Review_reviewerId_idx" ON public."Review" USING btree ("reviewerId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: Session_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Session_userId_idx" ON public."Session" USING btree ("userId");


--
-- Name: Store_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Store_slug_idx" ON public."Store" USING btree (slug);


--
-- Name: Store_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Store_slug_key" ON public."Store" USING btree (slug);


--
-- Name: Store_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Store_userId_key" ON public."Store" USING btree ("userId");


--
-- Name: SupportTicket_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "SupportTicket_userId_idx" ON public."SupportTicket" USING btree ("userId");


--
-- Name: Tag_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tag_key_key" ON public."Tag" USING btree (key);


--
-- Name: User_discordId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_discordId_key" ON public."User" USING btree ("discordId");


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_phone_idx" ON public."User" USING btree (phone);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: User_steamId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_steamId_key" ON public."User" USING btree ("steamId");


--
-- Name: _ListingCategory_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_ListingCategory_B_index" ON public."_ListingCategory" USING btree ("B");


--
-- Name: _ListingTag_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_ListingTag_B_index" ON public."_ListingTag" USING btree ("B");


--
-- Name: Article Article_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Conversation Conversation_buyerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Conversation Conversation_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public."Listing"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Conversation Conversation_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Dispute Dispute_openerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Dispute"
    ADD CONSTRAINT "Dispute_openerId_fkey" FOREIGN KEY ("openerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Dispute Dispute_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Dispute"
    ADD CONSTRAINT "Dispute_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Dispute Dispute_responderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Dispute"
    ADD CONSTRAINT "Dispute_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Favorite Favorite_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public."Listing"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Favorite Favorite_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ListingMedia ListingMedia_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ListingMedia"
    ADD CONSTRAINT "ListingMedia_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public."Listing"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ListingStats ListingStats_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ListingStats"
    ADD CONSTRAINT "ListingStats_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public."Listing"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Listing Listing_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Listing"
    ADD CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Listing Listing_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Listing"
    ADD CONSTRAINT "Listing_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."Conversation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public."Listing"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_buyerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_buyerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RecentlyViewed RecentlyViewed_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecentlyViewed"
    ADD CONSTRAINT "RecentlyViewed_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public."Listing"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RecentlyViewed RecentlyViewed_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecentlyViewed"
    ADD CONSTRAINT "RecentlyViewed_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Report Report_reporterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public."Listing"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_reviewerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Store Store_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "Store_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SupportTicket SupportTicket_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _ListingCategory _ListingCategory_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_ListingCategory"
    ADD CONSTRAINT "_ListingCategory_A_fkey" FOREIGN KEY ("A") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ListingCategory _ListingCategory_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_ListingCategory"
    ADD CONSTRAINT "_ListingCategory_B_fkey" FOREIGN KEY ("B") REFERENCES public."Listing"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ListingTag _ListingTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_ListingTag"
    ADD CONSTRAINT "_ListingTag_A_fkey" FOREIGN KEY ("A") REFERENCES public."Listing"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ListingTag _ListingTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_ListingTag"
    ADD CONSTRAINT "_ListingTag_B_fkey" FOREIGN KEY ("B") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 7ym3tOcE74bV5D46rFgej5IVs1abbFdTp0QM8auVt5W4wSbHKiJebpLe3pWGu2b


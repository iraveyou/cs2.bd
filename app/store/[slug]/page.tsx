import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import { getPlayerSummary } from '../../../lib/steam/client';
import ListingCard from '../../../components/listing/ListingCard';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const store = await prisma.store.findUnique({
    where: { slug },
    select: { name: true, description: true, trustScore: true },
  });

  const storeName = store?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const title = `${storeName} — Verified CS2 Skin Store | cs2bd Bangladesh`;
  const description = store?.description
    || `Browse ${storeName}'s CS2 skin listings on CS2BD Bangladesh. Trust Score: ${store?.trustScore?.toFixed(1) || 'N/A'}. Secure bKash & Nagad payments.`;

  return {
    title,
    description,
    keywords: [`${storeName}`, 'cs2 skin store bangladesh', 'verified cs2 seller bd', 'cs2bd store'],
    alternates: { canonical: `${baseUrl}/store/${slug}` },
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

type SocialLinks = {
  facebook?: string;
  youtube?: string;
  twitter?: string;
  discord?: string;
  website?: string;
  telegram?: string;
  instagram?: string;
};

const SOCIAL_ICONS: Record<string, { label: string; color: string }> = {
  facebook: { label: 'Facebook', color: '#1877f2' },
  youtube: { label: 'YouTube', color: '#ff0000' },
  twitter: { label: 'Twitter/X', color: '#1da1f2' },
  discord: { label: 'Discord', color: '#5865f2' },
  website: { label: 'Website', color: '#22c55e' },
  telegram: { label: 'Telegram', color: '#26a5e4' },
  instagram: { label: 'Instagram', color: '#e4405f' },
};

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      user: { select: { steamId: true, name: true, createdAt: true } },
      listings: {
        where: { status: 'ACTIVE' },
        include: {
          media: { where: { isPrimary: true }, take: 1, select: { url: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      _count: {
        select: {
          orders: { where: { status: 'COMPLETED' } },
        },
      },
    },
  });

  if (!store) notFound();

  let steamPlayer = null;
  if (store.user?.steamId) {
    try { steamPlayer = await getPlayerSummary(store.user.steamId); } catch {}
  }

  const socialLinks = (store.socialLinks || {}) as SocialLinks;
  const hasSocial = Object.values(socialLinks).some(Boolean);

  const memberSince = store.user?.createdAt
    ? new Date(store.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  const formattedListings = store.listings.map((l) => ({
    id: l.id,
    name: l.name,
    exterior: l.exterior,
    rarity: l.rarity || 'Covert',
    priceCents: l.priceCents,
    floatValue: l.floatValue ? Number(l.floatValue) : null,
    statTrak: l.statTrak,
    souvenir: l.souvenir,
    image: l.media[0]?.url || null,
    store: { name: store.name, slug: store.slug, trustScore: store.trustScore },
    slug: l.id,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0d0d12] via-[#111118] to-[#0a0a10] border border-[#1c1c26] rounded-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#22c55e]/3 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#22c55e]/20 to-[#16a34a]/20 border border-[#22c55e]/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {steamPlayer?.avatarfull ? (
                <img src={steamPlayer.avatarfull} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-[#22c55e]">{store.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{store.name}</h1>
                <span className="badge badge-verified flex-shrink-0">✔ Verified</span>
              </div>
              {store.description && <p className="text-sm text-slate-400 mt-1.5 max-w-xl">{store.description}</p>}
              {steamPlayer && (
                <a href={`https://steamcommunity.com/profiles/${store.user?.steamId}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-[#66c0f4] hover:underline">
                  {steamPlayer.personaname} <span className="text-slate-500">on Steam ↗</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 border-t md:border-t-0 md:border-l border-[#1c1c26] pt-4 md:pt-0 md:pl-6">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-[#22c55e]">★ {store.trustScore.toFixed(1)}</div>
              <div className="text-xs text-slate-400">Trust Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-slate-100">{store._count.orders}</div>
              <div className="text-xs text-slate-400">Completed Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-slate-100">{store.listings.length}</div>
              <div className="text-xs text-slate-400">Active Listings</div>
            </div>
          </div>
        </div>

        {hasSocial && (
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-[#1c1c26]">
            <span className="text-xs text-slate-500 font-semibold mr-1">Follow:</span>
            {Object.entries(socialLinks).map(([key, url]) => {
              if (!url) return null;
              const info = SOCIAL_ICONS[key];
              return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80 transition"
                  style={{ background: info.color + '15', color: info.color, border: '1px solid ' + info.color + '30' }}>
                  {info.label} ↗
                </a>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-[#1c1c26] text-xs text-slate-500">
          {memberSince && <span>Member since {memberSince}</span>}
          {store.verifiedAt && <span>· Verified on {new Date(store.verifiedAt).toLocaleDateString()}</span>}
          <span>· KYC: {store.kycStatus}</span>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">Active Listings ({formattedListings.length})</h2>
          <Link href="/marketplace" className="text-sm font-semibold text-[#ff6a00] hover:underline">Marketplace →</Link>
        </div>
        {formattedListings.length === 0 ? (
          <div className="text-center py-12 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl">
            <p className="text-sm text-slate-400">No active listings at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formattedListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

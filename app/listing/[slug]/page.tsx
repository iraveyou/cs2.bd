import React from 'react'
import Link from 'next/link'
import prisma from '../../../lib/prisma'
import Card from '../../../components/ui/Card'
import BuyPanel from '../../../components/listing/BuyPanel'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import ShareButton from '../../../components/listing/ShareButton'
import { generateProductSchema } from '../../../lib/seo/schema'

interface ListingPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { slug } = await params

  const dbItem = await prisma.listing.findFirst({
    where: { id: slug },
    include: { media: { where: { isPrimary: true }, take: 1 } },
  })

  const titleName = dbItem ? dbItem.name : slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const priceFormatted = dbItem ? (dbItem.priceCents / 100).toLocaleString('en-BD') : 'Market'
  const image = dbItem?.media[0]?.url || null

  const title = `Buy ${titleName} — CS2BD Bangladesh`
  const description = dbItem?.description || `Purchase ${titleName} for ৳${priceFormatted} on Bangladesh's #1 CS2 Skin Marketplace. Verified sellers, bKash & Nagad payments.`

  return {
    title,
    description,
    keywords: `${titleName}, buy cs2 skins bangladesh, cs2 marketplace bd, ${titleName} bkash nagad`,
    openGraph: {
      title,
      description,
      type: 'website',
      images: image ? [{ url: image, width: 800, height: 600, alt: titleName }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params

  const dbItem = await prisma.listing.findFirst({
    where: { id: slug },
    include: {
      store: { select: { name: true, slug: true, trustScore: true } },
      media: true,
    },
  })

  const listing = {
    id: dbItem?.id || slug,
    name: dbItem?.name || 'CS2 Skin Item',
    exterior: dbItem?.exterior || 'FACTORY_NEW',
    rarity: dbItem?.rarity || 'Covert',
    priceCents: dbItem?.priceCents || 0,
    floatValue: dbItem?.floatValue ? Number(dbItem.floatValue) : null,
    paintSeed: dbItem?.paintSeed || null,
    statTrak: dbItem?.statTrak || false,
    souvenir: dbItem?.souvenir || false,
    description: dbItem?.description || '',
    steamLink: dbItem?.steamLink || null,
    seller: {
      name: dbItem?.store?.name || 'CS2BD Store',
      slug: dbItem?.store?.slug || '',
      trustScore: dbItem?.store?.trustScore || 0,
    },
    image: dbItem?.media[0]?.url || null,
  }

  const shareUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/listing/${listing.id}`
  const shareTitle = `${listing.name} — ৳${Math.round(listing.priceCents / 100).toLocaleString()} on CS2BD`
  const shareDesc = listing.description || `${listing.name} (${listing.exterior.replace(/_/g, ' ')}). Buy now on Bangladesh's #1 CS2 marketplace.`

  const productSchema = generateProductSchema({
    id: listing.id,
    name: listing.name,
    description: listing.description || undefined,
    priceCents: listing.priceCents,
    exterior: listing.exterior,
    floatValue: listing.floatValue,
    image: listing.image || undefined,
    sellerName: listing.seller.name,
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <Breadcrumbs items={[
        { label: 'Marketplace', href: '/marketplace' },
        { label: listing.name, href: `/listing/${listing.id}` },
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border border-[#1c1c26] bg-[#0d0d12]">
            <div className="h-80 sm:h-96 relative flex items-center justify-center bg-gradient-to-b from-[#1a0a2e] via-[#0d0d18] to-[#0d0d12] p-8">
              {listing.image ? (
                <img src={listing.image} alt={listing.name} className="w-full h-full object-contain" />
              ) : (
                <div className="text-8xl select-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">🎮</div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30">{listing.rarity}</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 text-slate-300 border border-white/10">{listing.exterior.replace(/_/g, ' ')}</span>
                {listing.statTrak && <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">ST™</span>}
              </div>
            </div>
            <div className="p-6 border-t border-[#1c1c26]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">{listing.name}</h1>
                  {listing.description && <p className="text-sm text-slate-400 mt-2 leading-relaxed">{listing.description}</p>}
                </div>
                <ShareButton url={shareUrl} title={shareTitle} description={shareDesc} />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#0d0d12] border border-[#1c1c26]">
            <h3 className="text-lg font-bold mb-4 text-slate-100">Item Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-[#111118] rounded-xl border border-[#1c1c26]">
                <div className="text-xs text-slate-400">Float Value</div>
                <div className="font-bold text-slate-200 mt-1">{listing.floatValue?.toFixed(6) || '—'}</div>
                {listing.floatValue != null && (
                  <div className="w-full bg-[#1c1c26] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${Math.min(listing.floatValue * 100, 100)}%`,
                      background: listing.floatValue < 0.07 ? '#22c55e' : listing.floatValue < 0.15 ? '#eab308' : listing.floatValue < 0.30 ? '#f97316' : '#ef4444',
                    }} />
                  </div>
                )}
              </div>
              <div className="p-3 bg-[#111118] rounded-xl border border-[#1c1c26]">
                <div className="text-xs text-slate-400">Pattern Index</div>
                <div className="font-bold text-slate-200 mt-1">{listing.paintSeed || '—'}</div>
              </div>
              <div className="p-3 bg-[#111118] rounded-xl border border-[#1c1c26]">
                <div className="text-xs text-slate-400">StatTrak™</div>
                <div className="font-bold text-slate-200 mt-1">{listing.statTrak ? 'Yes' : 'No'}</div>
              </div>
              <div className="p-3 bg-[#111118] rounded-xl border border-[#1c1c26]">
                <div className="text-xs text-slate-400">Souvenir</div>
                <div className="font-bold text-slate-200 mt-1">{listing.souvenir ? 'Yes' : 'No'}</div>
              </div>
            </div>
            {listing.steamLink && (
              <a href={listing.steamLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 text-xs text-[#66c0f4] hover:underline font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm4.7 17.3l-1.1-5.1 2.8-2c.3-.2.4-.7.1-1-.3-.2-.7-.2-1 0l-2.8 2L12 9c-.3-.6-1-.7-1.5-.3l-1.9 1.4c-.5.4-.6 1.2-.1 1.7l3.6 5.5c.4.6 1.3.7 1.8.2l1.9-1.4c.4-.3.5-.9.1-1.4l-3-4.6 1.3 6.1c.1.6.6 1 1.2 1 .7 0 1.2-.6 1.1-1.3z"/></svg>
                Inspect in Game
              </a>
            )}
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="p-6 bg-[#0d0d12] border border-[#1c1c26] sticky top-24">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Price</div>
            <div className="text-3xl font-extrabold text-[#22c55e] mb-4">৳ {Math.round(listing.priceCents / 100).toLocaleString('en-BD')}</div>

            <BuyPanel listingId={listing.id} priceCents={listing.priceCents} />

            <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
              Item locks for 30 minutes. Pay via bKash / Nagad with manual admin verification.
            </p>

            <div className="pt-4 mt-4 border-t border-[#1c1c26]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400">Seller</span>
                {listing.seller.slug ? (
                  <Link href={`/store/${listing.seller.slug}`} className="font-bold text-white hover:text-[#22c55e] transition">{listing.seller.name}</Link>
                ) : (
                  <span className="font-bold text-white">{listing.seller.name}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Trust Score</span>
                <span className="font-bold text-[#ff6a00]">★ {listing.seller.trustScore.toFixed(1)}</span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}

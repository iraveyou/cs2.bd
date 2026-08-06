import React from 'react'
import Link from 'next/link'
import prisma from '../../../lib/prisma'
import ListingCard from '../../../components/listing/ListingCard'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag).replace(/-/g, ' ')
  const title = `Buy ${decodedTag} CS2 Skins in Bangladesh | cs2bd`
  const description = `Explore Counter-Strike 2 skins tagged with "${decodedTag}" on Bangladesh's premier marketplace. Verified Escrow, bKash & Nagad instant payouts.`

  return {
    title,
    description,
    keywords: `${decodedTag}, buy cs2 skins bangladesh, cs2 float bangladesh, cs2bd.bd`,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com'}/tags/${encodeURIComponent(tag)}` },
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag).replace(/-/g, ' ')

  const listings = await prisma.listing.findMany({
    take: 24,
    orderBy: { createdAt: 'desc' },
  })

  const formattedListings = listings.map((item) => ({
    id: item.id,
    name: item.name,
    exterior: item.exterior,
    rarity: item.rarity || 'Covert',
    priceCents: item.priceCents,
    floatValue: item.floatValue ? Number(item.floatValue) : null,
    statTrak: item.statTrak,
    souvenir: item.souvenir,
    image: 'https://picsum.photos/seed/cs2item/400/300',
    store: { name: 'Verified BD Seller', slug: 'merchant', trustScore: 4.9 },
  }))

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'Tags', href: '/marketplace' },
          { label: decodedTag, href: `/tags/${tag}` },
        ]}
      />

      <div className="border-b border-[#1c1c26] pb-6">
        <div className="flex items-center gap-2">
          <span className="badge badge-accent">Tag Keyword Archive</span>
          <span className="text-xs text-slate-400">cs2bd BD Index</span>
        </div>
        <h1 className="text-3xl font-black text-white mt-2 capitalize">
          CS2 Skins Tagged: <span className="text-[#22c55e]">"{decodedTag}"</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Showing all Counter-Strike 2 skins matching the tag "{decodedTag}". All trades secured via cs2bd Escrow with instant bKash payment verification.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {formattedListings.map((item) => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>

      <div className="card-glass p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-200">Popular CS2 Tag Archives in Bangladesh</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {['low-float', 'clean-corner', 'doppler-phase-2', 'crown-foil', 'katowice-2014', 'fire-serpent', 'blue-gem'].map((t) => (
            <Link
              key={t}
              href={`/tags/${t}`}
              className="px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] hover:border-[#22c55e] rounded-lg text-slate-300 hover:text-white transition capitalize"
            >
              #{t.replace(/-/g, ' ')}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

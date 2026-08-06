import React from 'react'
import Link from 'next/link'
import prisma from '../../../lib/prisma'
import ListingCard from '../../../components/listing/ListingCard'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'

interface CollectionPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params
  const collectionName = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const title = `Buy ${collectionName} CS2 Skins in Bangladesh | cs2bd BD`
  const description = `Shop all skins from the ${collectionName} in Counter-Strike 2. Fast bKash & Nagad payments, 100% Escrow security in Bangladesh.`

  return {
    title,
    description,
    keywords: `${collectionName}, CS2 ${collectionName} bangladesh, buy cs2 collection bd, cs2bd game hub`,
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

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  const collectionName = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

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
    image: 'https://picsum.photos/seed/cs2col/400/300',
    store: { name: 'Verified BD Seller', slug: 'merchant', trustScore: 4.9 },
  }))

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'Collections', href: '/marketplace' },
          { label: collectionName, href: `/collections/${slug}` },
        ]}
      />

      <div className="border-b border-[#1c1c26] pb-6">
        <div className="flex items-center gap-2">
          <span className="badge badge-accent">Collection Landing</span>
          <span className="text-xs text-slate-400">CS2 Official Drops & Cases</span>
        </div>
        <h1 className="text-3xl font-black text-white mt-2">
          {collectionName} — Bangladesh CS2 Market
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Browse verified listings from the {collectionName}. Filter by float value, wear condition, and instant delivery status.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {formattedListings.map((item) => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>

      <div className="card-glass p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-200">Other Featured Collections</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {['anubis-collection', 'kilowatt-case', 'cobblestone-collection', 'gods-and-monsters', 'mirage-2021-collection'].map((c) => (
            <Link
              key={c}
              href={`/collections/${c}`}
              className="px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] hover:border-[#22c55e] rounded-lg text-slate-300 hover:text-white transition capitalize"
            >
              {c.replace(/-/g, ' ')}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

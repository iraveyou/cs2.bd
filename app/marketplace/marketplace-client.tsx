'use client'
import { useState, useMemo } from 'react'
import ListingCard from '../../components/listing/ListingCard'
import ListingFilters from '../../components/listing/ListingFilters'
import Button from '../../components/ui/Button'

interface ListingItem {
  id: string
  name: string
  exterior: string
  rarity: string
  priceCents: number
  floatValue: number | null
  statTrak: boolean
  souvenir: boolean
  image: string | null
  store: { name: string; slug: string; trustScore: number } | null
  slug: string
}

export default function MarketplaceClient({ initialListings }: { initialListings: ListingItem[] }) {
  const [filterState, setFilterState] = useState<{ q?: string; minPrice?: number; maxPrice?: number; rarity?: string; weapon?: string; statTrak?: boolean }>({})
  const [sort, setSort] = useState('Newest')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return initialListings.filter((l) => {
      if (filterState.q && !l.name.toLowerCase().includes(filterState.q.toLowerCase())) return false
      if (filterState.rarity && filterState.rarity !== 'All' && l.rarity !== filterState.rarity) return false
      if (filterState.weapon && filterState.weapon !== 'All' && !l.name.startsWith(filterState.weapon)) return false
      if (filterState.statTrak && !l.statTrak) return false
      if (filterState.minPrice !== undefined && l.priceCents < filterState.minPrice * 100) return false
      if (filterState.maxPrice !== undefined && l.priceCents > filterState.maxPrice * 100) return false
      return true
    }).sort((a, b) => {
      if (sort === 'Price: Low → High') return a.priceCents - b.priceCents
      if (sort === 'Price: High → Low') return b.priceCents - a.priceCents
      if (sort === 'Float: Low → High') return (a.floatValue || 0) - (b.floatValue || 0)
      return 0
    })
  }, [initialListings, filterState, sort])

  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1c1c26] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">CS2 Marketplace</h1>
            <p className="text-sm text-slate-400 mt-1">
              {initialListings.length} listing{initialListings.length !== 1 ? 's' : ''} available · Verified sellers · bKash/Nagad
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-400">Sort by:</span>
            <select
              className="bg-[#111118] border border-[#1c1c26] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#ff6a00]"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="Newest">Newest</option>
              <option value="Price: Low → High">Price: Low → High</option>
              <option value="Price: High → Low">Price: High → Low</option>
              <option value="Float: Low → High">Float: Low → High</option>
            </select>

            <Button variant="ghost" className="lg:hidden" onClick={() => setShowFilters((s) => !s)}>
              {showFilters ? 'Hide Filters' : 'Filters'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className={`lg:sticky lg:top-24 h-fit ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ListingFilters onChange={(f) => setFilterState((prev) => ({ ...prev, ...f }))} />
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-8">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-bold mb-1">No skins matched your filter</h3>
                <p className="text-sm text-slate-400">Try adjusting price range or searching with a different term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

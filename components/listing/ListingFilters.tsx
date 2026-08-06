'use client'
import { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function ListingFilters({ onChange }: { onChange?: (filters: any) => void }) {
  const [query, setQuery] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onChange?.({ q: query, minPrice: minPrice ? parseInt(minPrice, 10) : undefined, maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined })
  }

  return (
    <form onSubmit={submit} className="p-4 bg-[#0b0b0d] rounded-md border border-slate-800">
      <div className="flex gap-2 mb-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search listings" />
        <Button type="submit" variant="primary">Search</Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min BDT" />
        <Input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max BDT" />
      </div>
    </form>
  )
}

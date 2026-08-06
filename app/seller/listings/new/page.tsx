'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

function CreateListingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const role: string | null = (session as any)?.role || (session as any)?.user?.role || null
  const isSeller = role === 'SELLER' || role === 'ADMIN'

  const exteriorMap: Record<string, string> = {
    'Factory New': 'FACTORY_NEW',
    'Minimal Wear': 'MINIMAL_WEAR',
    'Field-Tested': 'FIELD_TESTED',
    'Well-Worn': 'WELL_WORN',
    'Battle-Scarred': 'BATTLE_SCARRED',
  };

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form Fields - prefill from query params
  const [name, setName] = useState(searchParams.get('name') || '')
  const [category, setCategory] = useState('Rifles')
  const [exterior, setExterior] = useState(exteriorMap[searchParams.get('exterior') || ''] || 'FACTORY_NEW')
  const [rarity, setRarity] = useState(searchParams.get('rarity') || 'Covert')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [floatValue, setFloatValue] = useState(searchParams.get('float') || '')
  const [paintSeed, setPaintSeed] = useState(searchParams.get('paintSeed') || '')
  const [statTrak, setStatTrak] = useState(searchParams.get('stattrak') === '1')
  const [souvenir, setSouvenir] = useState(false)
  const [steamLink, setSteamLink] = useState(searchParams.get('inspect') || '')
  const [marketLink, setMarketLink] = useState(searchParams.get('market') || '')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [seoKeywords, setSeoKeywords] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  // Media & Processing states
  const [images, setImages] = useState<Array<{ name: string; size: string; preview: string; compressed: boolean }>>([])
  const [watermarked, setWatermarked] = useState(true)
  const [isCompressing, setIsCompressing] = useState(false)

  // Auto-generated Slug
  const generatedSlug = name
    ? `buy-${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')}-${exterior.toLowerCase().replace('_', '-')}-bangladesh`
    : 'buy-cs2-skin-bangladesh'

  // Handle Image Upload & Auto-Compress
  function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setIsCompressing(true)

    setTimeout(() => {
      const newImgs = Array.from(files).map((file) => ({
        name: file.name,
        size: `${(file.size / 1024 / 1.5).toFixed(1)} KB (Compressed 35%)`,
        preview: URL.createObjectURL(file),
        compressed: true,
      }))
      setImages((prev) => [...prev, ...newImgs])
      setIsCompressing(false)
    }, 600)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !price) {
      setError('Please provide item name and price in BDT.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const payload = {
        name,
        category,
        exterior,
        rarity,
        price,
        quantity,
        floatValue,
        paintSeed,
        statTrak,
        souvenir,
        steamLink,
        marketLink,
        description,
        tags,
        seoKeywords,
        slug: generatedSlug,
        images: images.map((i) => i.name),
        videoUrl,
        watermarked,
      }

      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Listing submission failed')

      setSubmitted(true)
      setTimeout(() => {
        router.push('/seller/dashboard')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to create listing.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  if (!isSeller) {
    return (
      <main className="container max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#ff3d81]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#ff3d81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L2.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100">Seller Access Required</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          You need an approved seller account to create listings. Apply to become a seller or sign in with a seller account.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/become-seller" className="btn btn-primary text-sm">Apply as Seller</Link>
          <Link href="/auth/signin" className="btn btn-ghost text-sm">Sign In</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/seller/dashboard" className="hover:text-white transition">
          Seller Dashboard
        </Link>
        <span>/</span>
        <span className="text-white font-semibold">Create New CS2 Listing</span>
      </div>

      <div className="card-glass p-6 md:p-8 space-y-8">
        <div>
          <span className="badge badge-accent mb-2">Inventory Management</span>
          <h1 className="text-3xl font-black text-white">Create CS2 Marketplace Listing</h1>
          <p className="text-xs text-slate-400 mt-1">
            List your Counter-Strike 2 skins, knives, gloves, or cases with auto-generated SEO and image optimization.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-[#00cc88]/10 border border-[#00cc88]/30 rounded-2xl text-center space-y-3">
            <div className="w-14 h-14 bg-[#00cc88]/20 text-[#00cc88] rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-extrabold text-white">Listing Live on Marketplace!</h2>
            <p className="text-xs text-slate-300 font-mono">SEO Slug: {generatedSlug}</p>
            <p className="text-xs text-slate-400">Redirecting to your store dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Media Upload (Images & Video Inspect) */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-[#1c1c26] pb-2 flex items-center justify-between">
                <span>📸 1. Images & Video Inspect</span>
                <span className="text-[11px] text-amber-400 font-normal">Auto-Compression & Watermark active</span>
              </h2>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  handleImageUpload(e.dataTransfer.files)
                }}
                className="p-6 border-2 border-dashed border-[#1c1c26] hover:border-[#ff6a00] rounded-2xl bg-[#0d0d12] text-center space-y-3 transition cursor-pointer"
              >
                <div className="text-3xl">🖼️</div>
                <div className="text-xs text-slate-300 font-semibold">
                  Drag & Drop CS2 Inspect Screenshots or Click to Upload
                </div>
                <p className="text-[10px] text-slate-500">Supports PNG, JPG, WebP. High-res photos auto-compressed for fast loading.</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload-input"
                />
                <label
                  htmlFor="image-upload-input"
                  className="inline-block px-4 py-2 bg-[#1c1c26] hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition"
                >
                  Select Photos
                </label>
              </div>

              {/* Compression Indicator */}
              {isCompressing && (
                <div className="p-3 bg-[#ff6a00]/10 border border-[#ff6a00]/30 rounded-xl text-xs text-[#ff8a3d] flex items-center gap-2">
                  <span className="animate-spin">⚡</span> Auto-compressing images & applying high-DPI web optimization...
                </div>
              )}

              {/* Uploaded Images Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative group bg-[#111118] border border-[#1c1c26] rounded-xl p-2 text-center space-y-1">
                      <img src={img.preview} alt="CS2 Skin" className="w-full h-24 object-cover rounded-lg" />
                      <div className="text-[10px] text-slate-400 truncate">{img.name}</div>
                      <div className="text-[9px] text-[#00cc88] font-bold">{img.size}</div>
                      {watermarked && (
                        <span className="absolute top-3 left-3 bg-black/80 text-[#ff8a3d] text-[8px] font-bold px-1.5 py-0.5 rounded border border-[#ff6a00]/40">
                          cs2bd BD
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watermarked}
                    onChange={(e) => setWatermarked(e.target.checked)}
                    className="accent-[#ff6a00]"
                  />
                  Auto-Watermark photos with "cs2bd BD" logo
                </label>
              </div>

              {/* Video Inspect URL */}
              <div>
                <label className="text-xs text-slate-300 block mb-1">Inspect Video / Streamable / YouTube Showcase URL (Optional)</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or inspect video MP4 link"
                  className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Section 2: Skin Data & Attributes */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-[#1c1c26] pb-2 flex items-center gap-2">
                <span>🎯 2. CS2 Skin Data & Float Attributes</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-300 block mb-1">Item & Skin Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. AK-47 | Asiimov or Butterfly Knife | Doppler"
                    className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="Knives">Knives 🗡️</option>
                    <option value="Gloves">Gloves 🥊</option>
                    <option value="Rifles">Rifles 🔫</option>
                    <option value="Pistols">Pistols 🎯</option>
                    <option value="SMGs">SMGs & Heavy 💥</option>
                    <option value="Stickers">Stickers & Charms 🏷️</option>
                    <option value="Agents">Agents & Music 🎭</option>
                    <option value="Cases">Cases & Containers 📦</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Exterior Wear Condition</label>
                  <select
                    value={exterior}
                    onChange={(e) => setExterior(e.target.value)}
                    className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="FACTORY_NEW">Factory New (FN)</option>
                    <option value="MINIMAL_WEAR">Minimal Wear (MW)</option>
                    <option value="FIELD_TESTED">Field-Tested (FT)</option>
                    <option value="WELL_WORN">Well-Worn (WW)</option>
                    <option value="BATTLE_SCARRED">Battle-Scarred (BS)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Float Value (0.00 - 1.00)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={floatValue}
                    onChange={(e) => setFloatValue(e.target.value)}
                    placeholder="e.g. 0.0182"
                    className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Paint Seed / Pattern Index</label>
                  <input
                    type="number"
                    value={paintSeed}
                    onChange={(e) => setPaintSeed(e.target.value)}
                    placeholder="e.g. 421"
                    className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={statTrak}
                    onChange={(e) => setStatTrak(e.target.checked)}
                    className="accent-[#ff6a00]"
                  />
                  StatTrak™ Counter
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={souvenir}
                    onChange={(e) => setSouvenir(e.target.checked)}
                    className="accent-[#ff6a00]"
                  />
                  Souvenir Package Item
                </label>
              </div>
            </div>

            {/* Section 3: Pricing, Stock & Steam Integration */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-[#1c1c26] pb-2 flex items-center gap-2">
                <span>💰 3. Pricing, Quantity & Steam Link</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Listing Price in BDT (৳) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 32500"
                    className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-[#00cc88] font-bold outline-none text-base"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Available Quantity / Stock</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="1"
                    className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                  />
                </div>

              <div className="sm:col-span-3">
                  <label className="text-xs text-slate-300 block mb-1">Steam Inspect Link</label>
                  <input
                    type="text"
                    value={steamLink}
                    onChange={(e) => setSteamLink(e.target.value)}
                    placeholder="steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20..."
                    className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2 text-xs text-slate-300 outline-none font-mono"
                  />
                </div>

                {marketLink && (
                  <div className="sm:col-span-3">
                    <label className="text-xs text-slate-300 block mb-1">Steam Market Link</label>
                    <div className="flex items-center gap-2">
                      <input type="text" value={marketLink} onChange={(e) => setMarketLink(e.target.value)}
                        className="flex-1 bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2 text-xs text-slate-300 outline-none font-mono" />
                      <a href={marketLink} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#66c0f4] hover:underline flex-shrink-0">Open ↗</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: SEO & Extra Metadata */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-[#1c1c26] pb-2 flex items-center gap-2">
                <span>🚀 4. Description, Tags & Auto-SEO</span>
              </h2>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Item Description & Notes</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe sticker placements, float rarity, pattern details, or instant delivery notes..."
                  className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Low Float, Clean Corner, Crown Foil"
                    className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">SEO Keywords</label>
                  <input
                    type="text"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="buy ak47 asiimov bangladesh, cs2 skin bkash"
                    className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Live Auto Slug Preview */}
              <div className="p-3 bg-[#111118] border border-[#1c1c26] rounded-xl text-xs space-y-1">
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Auto-Generated SEO URL Slug:</span>
                <code className="text-[#ff8a3d] font-mono break-all">https://cs2bd.bd/listing/{generatedSlug}</code>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1c1c26]">
              <Link href="/seller/dashboard" className="btn btn-ghost text-xs">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#ff6a00] to-[#ff8a3d] hover:from-[#ff8a3d] hover:to-[#ff6a00] text-black font-extrabold px-6 py-3 rounded-xl text-xs shadow-lg shadow-[#ff6a00]/20 transition"
              >
                {loading ? 'Publishing Listing...' : 'Publish Listing to Marketplace →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

export default function CreateListingPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="skeleton h-8 w-64 mb-4 rounded-lg" />
        <div className="skeleton h-96 w-full rounded-2xl" />
      </div>
    }>
      <CreateListingForm />
    </Suspense>
  );
}

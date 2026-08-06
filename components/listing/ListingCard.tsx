import Link from 'next/link'
import Card from '../ui/Card'
import Button from '../ui/Button'

const RARITY_MAP: Record<string, string> = {
  'Covert': 'rarity-covert',
  'Classified': 'rarity-classified',
  'Restricted': 'rarity-restricted',
  'Mil-Spec': 'rarity-mil-spec',
  'Industrial': 'rarity-industrial',
  'Consumer': 'rarity-consumer',
}

const CONDITION_SHORT: Record<string, string> = {
  FACTORY_NEW: 'FN',
  MINT: 'MW',
  MINIMAL_WEAR: 'MW',
  FIELD_TESTED: 'FT',
  WELL_WORN: 'WW',
  BATTLE_SCARRED: 'BS',
  OTHER: '—',
}

export interface ListingCardProps {
  listing: {
    id: string
    name: string
    exterior: string
    rarity: string
    priceCents: number
    floatValue?: number | null
    statTrak?: boolean
    souvenir?: boolean
    image?: string | null
    store?: { name: string; slug: string; trustScore?: number } | null
    slug?: string
  }
}

function formatBDT(cents: number) {
  const taka = cents / 100
  return new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(taka)
}

function getSkinGradient(name: string) {
  const gradients = [
    'linear-gradient(135deg, #1a0a2e 0%, #2d1b6b 50%, #0f1a40 100%)',
    'linear-gradient(135deg, #0d1f0d 0%, #1a3a1a 50%, #0a2a0a 100%)',
    'linear-gradient(135deg, #1f0a0a 0%, #3a1010 50%, #200505 100%)',
    'linear-gradient(135deg, #0a1a2e 0%, #0d2b4a 50%, #091520 100%)',
    'linear-gradient(135deg, #1a1a0a 0%, #2e2e10 50%, #1a1700 100%)',
    'linear-gradient(135deg, #1a0a1f 0%, #2d106b 50%, #0f0a3a 100%)',
  ]
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % gradients.length
  return gradients[idx]
}

export default function ListingCard({ listing }: ListingCardProps) {
  const {
    id, name, exterior, rarity, priceCents,
    floatValue, statTrak, souvenir, image, store, slug,
  } = listing

  const href = slug ? `/listing/${slug}` : `/listing/${id}`
  const conditionLabel = (CONDITION_SHORT as any)[exterior] ?? exterior

  return (
    <Link href={href} className="block no-underline listing-card animate-fade-up">
      <Card className="rounded-2xl">
        <div className="listing-card-media" style={{ background: image ? undefined : getSkinGradient(name) }}>
          {image ? (
            <img src={image} alt={name} loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl">🔫</div>
          )}

          <div className={`listing-card-rarity ${RARITY_MAP[rarity] ?? ''}`}>{rarity}</div>
          {statTrak && <div style={{ position: 'absolute', top: 8, right: 8 }} className="text-xs px-2 py-0.5 rounded bg-black/60 text-yellow-300">ST™</div>}
          {souvenir && <div style={{ position: 'absolute', top: 36, right: 8 }} className="text-xs px-2 py-0.5 rounded bg-black/60 text-yellow-200">SV</div>}
          <div style={{ position: 'absolute', bottom: 8, right: 8 }} className="text-xs font-bold px-2 py-0.5 rounded bg-black/60 text-slate-200">{conditionLabel}</div>
        </div>

        <div className="listing-card-body">
          <div className="listing-card-title">{statTrak ? `StatTrak™ ${name}` : name}</div>
          <div className="listing-card-sub">{store ? store.name : conditionLabel}</div>

          {typeof floatValue === 'number' && (
            <div className="float-bar-wrap mt-3"><div className="float-bar-fill" style={{ width: `${Math.min(100, Math.max(0, floatValue * 100))}%` }} /></div>
          )}

          <div className="listing-card-footer">
            <div>
              <div className="listing-price">৳ {formatBDT(priceCents)}</div>
              <div className="listing-price-label">Price</div>
            </div>

            <Button variant="primary" className="text-xs">Buy</Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}

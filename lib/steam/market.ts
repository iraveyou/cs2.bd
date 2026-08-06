export interface SteamMarketPrice {
  lowest_price: string;
  median_price: string;
  volume: string;
  success: boolean;
}

export async function getMarketPrice(marketHashName: string): Promise<SteamMarketPrice | null> {
  try {
    const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=18&market_hash_name=${encodeURIComponent(marketHashName)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.success) return null;
    return data as SteamMarketPrice;
  } catch {
    return null;
  }
}

export function parsePrice(priceStr: string | undefined): number {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

export const STEAM_CURRENCY_RATE = 13;

export function steamPriceToBdt(priceStr: string | undefined): string {
  const usd = parsePrice(priceStr);
  return `${Math.round(usd * STEAM_CURRENCY_RATE).toLocaleString()}`;
}

export const RARITY_ORDER: Record<string, number> = {
  'Consumer Grade': 0,
  'Industrial Grade': 1,
  'Mil-Spec': 2,
  Restricted: 3,
  Classified: 4,
  Covert: 5,
  'Rare Special': 6,
  Contraband: 7,
};

const EXTERIOR_WEARS: Record<string, [number, number]> = {
  'Factory New': [0, 0.07],
  'Minimal Wear': [0.07, 0.15],
  'Field-Tested': [0.15, 0.38],
  'Well-Worn': [0.38, 0.45],
  'Battle-Scarred': [0.45, 1.0],
};

export function getWearFromFloat(float: number): string {
  for (const [name, [min, max]] of Object.entries(EXTERIOR_WEARS)) {
    if (float >= min && float < max) return name;
  }
  return 'Battle-Scarred';
}

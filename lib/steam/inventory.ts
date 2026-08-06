import { getPlayerSummaries } from './client';

const CS2_APP_ID = 730;
const CS2_CONTEXT_ID = 2;

export interface SteamInventoryItem {
  assetid: string;
  classid: string;
  instanceid: string;
  market_hash_name: string;
  market_name: string;
  name: string;
  name_color: string;
  rarity: string;
  rarity_color: string;
  exterior?: string;
  icon_url: string;
  icon_url_large: string;
  tradable: boolean;
  marketable: boolean;
  market_tradable_restriction?: number;
  descriptions?: InventoryDescription[];
  tags?: InventoryTag[];
  float?: number;
  paintseed?: number;
  paintindex?: number;
  inspectLink?: string;
  marketLink?: string;
}

interface InventoryDescription {
  value: string;
  color?: string;
}

interface InventoryTag {
  category: string;
  internal_name: string;
  localized_category_name: string;
  localized_tag_name: string;
}

interface SteamInventoryResponse {
  assets: Array<{
    appid: number;
    contextid: string;
    assetid: string;
    classid: string;
    instanceid: string;
    amount: string;
  }>;
  descriptions: Array<{
    appid: number;
    classid: string;
    instanceid: string;
    market_hash_name: string;
    market_name: string;
    name: string;
    name_color: string;
    background_color?: string;
    icon_url: string;
    icon_url_large: string;
    tradable: number;
    marketable: number;
    market_tradable_restriction?: number;
    descriptions?: InventoryDescription[];
    tags?: InventoryTag[];
    actions?: Array<{ name: string; link: string }>;
  }>;
  total_inventory_count: number;
}

function parseFloatFromDescriptions(descriptions?: InventoryDescription[]): number | undefined {
  if (!descriptions) return undefined;
  for (const d of descriptions) {
    const match = d.value.match(/\(?(?:Wear )?[Ff]loat(?: [Vv]alue)?:?\s*([\d.]+)/);
    if (match) {
      return parseFloat(match[1]);
    }
  }
  return undefined;
}

function parsePaintSeedFromDescriptions(descriptions?: InventoryDescription[]): number | undefined {
  if (!descriptions) return undefined;
  for (const d of descriptions) {
    const match = d.value.match(/[Pp]aint [Ss]eed:?\s*(\d+)/);
    if (match) return parseInt(match[1]);
  }
  return undefined;
}

function getInspectLink(actions?: Array<{ name: string; link: string }>): string | undefined {
  if (!actions) return undefined;
  const inspectAction = actions.find((a) => a.name === 'Inspect in Game...');
  return inspectAction?.link;
}

function getMarketLink(marketHashName: string): string {
  return `https://steamcommunity.com/market/listings/730/${encodeURIComponent(marketHashName)}`;
}

function getExteriorFromTags(tags?: InventoryTag[]): string | undefined {
  if (!tags) return undefined;
  const exterior = tags.find(
    (t) =>
      t.category === 'Exterior' ||
      t.category === 'WearCategory' ||
      t.localized_category_name === 'Exterior'
  );
  return exterior?.localized_tag_name;
}

function getRarityName(tags?: InventoryTag[]): string {
  if (!tags) return 'Common';
  const rarity = tags.find(
    (t) =>
      t.category === 'Rarity' ||
      t.category === 'Quality' ||
      t.localized_category_name === 'Rarity'
  );
  return rarity?.localized_tag_name || 'Common';
}

function getRarityColor(): string {
  return '#b0c4d8';
}

export async function getCs2Inventory(steamId64: string): Promise<{
  items: SteamInventoryItem[];
  total: number;
  playerName?: string;
  error?: 'private' | null;
}> {
  const url = `https://steamcommunity.com/inventory/${steamId64}/${CS2_APP_ID}/${CS2_CONTEXT_ID}?l=english&count=5000`;

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
    },
  });

  if (!res.ok) {
    if (res.status === 403 || res.status === 401) {
      return { items: [], total: 0, error: 'private' as const };
    }
    if (res.status === 400 || res.status === 404) {
      return { items: [], total: 0 };
    }
    throw new Error(`Steam inventory fetch failed: ${res.status}`);
  }

  const data: SteamInventoryResponse = await res.json();
  if (!data || !data.descriptions) {
    return { items: [], total: 0 };
  }

  const descMap = new Map<string, SteamInventoryResponse['descriptions'][0]>();
  for (const desc of data.descriptions) {
    const key = `${desc.classid}_${desc.instanceid}`;
    descMap.set(key, desc);
  }

  const items: SteamInventoryItem[] = [];

  for (const asset of data.assets) {
    const key = `${asset.classid}_${asset.instanceid}`;
    const desc = descMap.get(key);
    if (!desc) continue;

    const floatVal = parseFloatFromDescriptions(desc.descriptions);
    const paintSeed = parsePaintSeedFromDescriptions(desc.descriptions);

    items.push({
      assetid: asset.assetid,
      classid: asset.classid,
      instanceid: asset.instanceid,
      market_hash_name: desc.market_hash_name,
      market_name: desc.market_name,
      name: desc.name,
      name_color: desc.name_color || '#d2d2d2',
      rarity: getRarityName(desc.tags),
      rarity_color: getRarityColor(),
      exterior: getExteriorFromTags(desc.tags),
      icon_url: `https://community.cloudflare.steamstatic.com/economy/image/${desc.icon_url}`,
      icon_url_large: `https://community.cloudflare.steamstatic.com/economy/image/${desc.icon_url_large}`,
      tradable: desc.tradable === 1,
      marketable: desc.marketable === 1,
      market_tradable_restriction: desc.market_tradable_restriction,
      descriptions: desc.descriptions,
      tags: desc.tags,
      float: floatVal,
      paintseed: paintSeed,
      inspectLink: getInspectLink(desc.actions),
      marketLink: getMarketLink(desc.market_hash_name),
    });
  }

  return {
    items,
    total: data.total_inventory_count,
  };
}

export async function getCs2InventoryWithProfile(steamId64: string): Promise<{
  items: SteamInventoryItem[];
  total: number;
  playerName?: string;
  avatar?: string;
}> {
  const [inv, player] = await Promise.all([
    getCs2Inventory(steamId64),
    getPlayerSummaries([steamId64]).catch(() => []),
  ]);

  return {
    ...inv,
    playerName: player[0]?.personaname,
    avatar: player[0]?.avatarfull,
  };
}

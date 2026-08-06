const STEAM_API_KEY = process.env.STEAM_API_KEY || '';
const STEAM_API = 'https://api.steampowered.com';

export interface SteamPlayer {
  steamid: string;
  personaname: string;
  avatar: string;
  avatarfull: string;
  profileurl: string;
  personastate: number;
  timecreated?: number;
}

export async function getPlayerSummaries(steamIds: string[]): Promise<SteamPlayer[]> {
  if (!STEAM_API_KEY) throw new Error('STEAM_API_KEY not set');
  const ids = steamIds.join(',');
  const res = await fetch(
    `${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${ids}`
  );
  const data = await res.json();
  return data.response?.players || [];
}

export async function getPlayerSummary(steamId: string): Promise<SteamPlayer | null> {
  const players = await getPlayerSummaries([steamId]);
  return players[0] || null;
}

export async function resolveVanityUrl(vanity: string): Promise<string | null> {
  if (!STEAM_API_KEY) throw new Error('STEAM_API_KEY not set');
  const res = await fetch(
    `${STEAM_API}/ISteamUser/ResolveVanityURL/v1/?key=${STEAM_API_KEY}&vanityurl=${vanity}`
  );
  const data = await res.json();
  if (data.response?.success === 1) return data.response.steamid;
  return null;
}

export function steamId64To32(steamId64: string): number {
  return parseInt(steamId64) - 76561197960265728;
}

export function steamId32To64(steamId32: number): string {
  return String(steamId32 + 76561197960265728);
}

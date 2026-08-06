import Link from 'next/link';
import { getCurrentUser } from '../../../lib/auth/guards';
import { redirect } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import { getCs2Inventory } from '../../../lib/steam/inventory';
import { getMarketPrice, steamPriceToBdt } from '../../../lib/steam/market';

export const metadata = {
  title: 'My Inventory — cs2bd',
  description: 'View your CS2 skin inventory, purchases, and manage your collection',
};

const RARITY_BG: Record<string, string> = {
  'Consumer Grade': '#b0c4d8',
  'Industrial Grade': '#5e98d9',
  'Mil-Spec': '#4b69ff',
  Restricted: '#8847ff',
  Classified: '#d32ce6',
  Covert: '#eb4b4b',
  'Rare Special': '#ffd700',
  Contraband: '#ffae42',
};

export default async function BuyerInventoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/signin');

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { steamId: true },
  });

  const steamId64 = dbUser?.steamId;
  let steamItems: Awaited<ReturnType<typeof getCs2Inventory>> | null = null;
  let steamFetchError = false;

  if (steamId64) {
    try {
      steamItems = await getCs2Inventory(steamId64);
    } catch {
      steamItems = null;
      steamFetchError = true;
    }
  }

  const allItems = steamItems?.items || [];
  const cs2Items = allItems.filter((i) => i.marketable || i.tradable);
  const notLinked = !steamId64;
  const isPrivate = steamItems?.error === 'private' || steamFetchError;
  const isEmpty = steamId64 && !steamFetchError && steamItems && cs2Items.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1c26] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-accent">My Inventory</span>
            <span className="text-xs text-slate-400">Your CS2 skins from Steam</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Skin Inventory</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/buyer/dashboard" className="btn btn-ghost text-xs">Orders & Reservations</Link>
          <Link href="/buyer/profile" className="btn btn-ghost text-xs">Profile Settings</Link>
          <Link href="/marketplace" className="btn btn-primary text-xs">Browse Marketplace</Link>
        </div>
      </div>

      {notLinked && (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#171a21] flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm4.7 17.3l-1.1-5.1 2.8-2c.3-.2.4-.7.1-1-.3-.2-.7-.2-1 0l-2.8 2L12 9c-.3-.6-1-.7-1.5-.3l-1.9 1.4c-.5.4-.6 1.2-.1 1.7l3.6 5.5c.4.6 1.3.7 1.8.2l1.9-1.4c.4-.3.5-.9.1-1.4l-3-4.6 1.3 6.1c.1.6.6 1 1.2 1 .7 0 1.2-.6 1.1-1.3z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Link Your Steam Account</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Connect your Steam account to view your CS2 inventory, buy and sell skins directly.
          </p>
          <a
            href="/api/auth/steam"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#171a21] border border-[#2a3f5a] rounded-xl text-sm font-bold text-[#c5c3c0] hover:bg-[#1e2837] transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm4.7 17.3l-1.1-5.1 2.8-2c.3-.2.4-.7.1-1-.3-.2-.7-.2-1 0l-2.8 2L12 9c-.3-.6-1-.7-1.5-.3l-1.9 1.4c-.5.4-.6 1.2-.1 1.7l3.6 5.5c.4.6 1.3.7 1.8.2l1.9-1.4c.4-.3.5-.9.1-1.4l-3-4.6 1.3 6.1c.1.6.6 1 1.2 1 .7 0 1.2-.6 1.1-1.3z"/>
            </svg>
            Connect Steam Account
          </a>
        </div>
      )}

      {isPrivate && (
        <div className="text-center py-16 space-y-3">
          <p className="text-sm text-slate-400">
            Your Steam inventory is private. Set it to Public in your Steam privacy settings to see your items here.
          </p>
        </div>
      )}

      {isEmpty && (
        <div className="text-center py-16 space-y-3">
          <p className="text-sm text-slate-400">
            No CS2 items found in your Steam inventory. Buy some from the marketplace!
          </p>
          <Link href="/marketplace" className="btn btn-primary text-sm">Browse Marketplace</Link>
        </div>
      )}

      {cs2Items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cs2Items.map((item) => (
            <div key={item.assetid} className="p-4 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl space-y-3 hover:border-[#22c55e]/30 transition-colors">
              <div className="w-full aspect-square bg-[#111118] rounded-xl flex items-center justify-center border border-[#1c1c26] overflow-hidden">
                <img
                  src={item.icon_url_large || item.icon_url}
                  alt={item.market_hash_name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <div className="font-bold text-slate-100 text-xs leading-snug line-clamp-2" style={{ color: `#${item.name_color}` || '#d2d2d2' }}>
                  {item.market_name}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white" style={{ backgroundColor: RARITY_BG[item.rarity] || '#4b69ff' }}>
                    {item.rarity}
                  </span>
                  {item.exterior && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                      {item.exterior}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {item.float !== undefined && (
                    <span className="text-[10px] text-slate-500 font-mono">F: {item.float.toFixed(6)}</span>
                  )}
                  {item.marketable && (
                    <span className="text-[10px] text-[#22c55e]">Tradable</span>
                  )}
                </div>
              </div>
              {!item.marketable && (
                <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full">Non-Tradable</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

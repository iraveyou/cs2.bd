import React from 'react';
import Link from 'next/link';
import { requireSeller } from '../../../lib/auth/guards';
import { prisma } from '../../../lib/prisma';
import { getCs2Inventory } from '../../../lib/steam/inventory';

export const metadata = {
  title: 'Seller Dashboard — cs2bd',
  description: 'Manage store listings, Steam inventory, orders, and sales stats',
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

export default async function SellerDashboardPage() {
  const user = await requireSeller();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { steamId: true, name: true, role: true },
  });

  const steamId64 = dbUser?.steamId;
  let steamInventory: Awaited<ReturnType<typeof getCs2Inventory>> | null = null;
  let steamFetchError = false;

  if (steamId64) {
    try {
      steamInventory = await getCs2Inventory(steamId64);
    } catch {
      steamInventory = null;
      steamFetchError = true;
    }
  }

  const listings = await prisma.listing.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const activeListings = await prisma.listing.count({
    where: { ownerId: user.id, status: 'ACTIVE' },
  });

  const pendingOrders = await prisma.order.count({
    where: {
      store: { userId: user.id },
      status: { in: ['PENDING_VERIFICATION', 'AWAITING_DELIVERY'] },
    },
  });

  const completedOrders = await prisma.order.count({
    where: {
      store: { userId: user.id },
      status: 'COMPLETED',
    },
  });

  const salesAgg = await prisma.order.aggregate({
    where: { store: { userId: user.id }, status: 'COMPLETED' },
    _sum: { totalCents: true },
  });

  const totalSalesBdt = Math.round((salesAgg._sum.totalCents || 0) / 100);

  const tradableItems = steamInventory?.items.filter((i) => i.tradable) || [];
  const steamNotLinked = !steamId64;
  const steamInventoryPrivate = steamInventory?.error === 'private' || steamFetchError;
  const steamInventoryEmpty = steamId64 && !steamFetchError && steamInventory && tradableItems.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1c26] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-verified">Verified Store</span>
            <span className="text-xs text-slate-400">Store Management Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">
            {dbUser?.name || 'Seller'} Dashboard
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href="/seller/listings/new" className="btn btn-primary text-xs">
            + Create New Listing
          </Link>
          <Link href="/buyer/profile" className="btn btn-ghost text-xs">
            Profile Settings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Listings', value: activeListings, color: 'text-slate-100' },
          { label: 'Pending Deliveries', value: pendingOrders, color: 'text-[#ff6a00]' },
          { label: 'Completed Orders', value: completedOrders, color: 'text-[#22c55e]' },
          { label: 'Total Volume Sales', value: `৳ ${totalSalesBdt.toLocaleString()}`, color: 'text-[#ff3d81]' },
        ].map((m) => (
          <div key={m.label} className="p-5 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl">
            <div className="text-xs text-slate-400 font-medium">{m.label}</div>
            <div className={`text-3xl font-extrabold mt-2 ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">Orders Requiring Action</h2>
            <span className="text-xs text-slate-400">Steam Trade Delivery Queue</span>
          </div>
          {pendingOrders === 0 ? (
            <p className="text-sm text-slate-400 italic py-4">No pending orders at the moment.</p>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-[#111118] border border-[#1c1c26] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">View in Orders</div>
                  <div className="text-xs text-slate-400 mt-1">{pendingOrders} order(s) await your action</div>
                </div>
                <Link href="/buyer/dashboard" className="px-3 py-1.5 bg-[#ff6a00] text-black text-xs font-bold rounded-lg hover:bg-[#ff8533] transition">
                  View Orders →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">Active Listings</h2>
            <Link href="/seller/listings/new" className="text-xs text-[#ff6a00] hover:underline font-semibold">
              + New Listing
            </Link>
          </div>

          {listings.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-4">No listings yet.</p>
          ) : (
            <div className="space-y-3">
              {listings.slice(0, 5).map((l) => (
                <div key={l.id} className="p-4 bg-[#111118] border border-[#1c1c26] rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{l.name || 'Unnamed Item'}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Float: {String(l.floatValue ?? 'N/A')}</div>
                    <div className="text-sm font-extrabold text-[#ff6a00] mt-1">৳ {Math.round(l.priceCents / 100).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[#22c55e]/10 text-[#22c55e]">
                      {l.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Steam Inventory</h2>
          </div>
          {steamNotLinked && (
            <Link href="/buyer/profile" className="text-xs text-[#ff6a00] hover:underline font-semibold">
              Link Steam Account →
            </Link>
          )}
        </div>

        {steamNotLinked && (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#171a21] flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm4.7 17.3l-1.1-5.1 2.8-2c.3-.2.4-.7.1-1-.3-.2-.7-.2-1 0l-2.8 2L12 9c-.3-.6-1-.7-1.5-.3l-1.9 1.4c-.5.4-.6 1.2-.1 1.7l3.6 5.5c.4.6 1.3.7 1.8.2l1.9-1.4c.4-.3.5-.9.1-1.4l-3-4.6 1.3 6.1c.1.6.6 1 1.2 1 .7 0 1.2-.6 1.1-1.3z"/>
              </svg>
            </div>
            <p className="text-sm text-slate-400">Link your Steam account to see your CS2 inventory here.</p>
            <Link href="/api/auth/steam" className="inline-block px-4 py-2 bg-[#171a21] border border-[#2a3f5a] rounded-lg text-sm font-bold text-[#c5c3c0] hover:bg-[#1e2837] transition">
              Link Steam Account
            </Link>
          </div>
        )}

        {steamInventoryPrivate && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400">
              Your Steam inventory is private. Set it to Public in your Steam privacy settings.
            </p>
          </div>
        )}

        {steamInventoryEmpty && (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#111118] border border-[#1c1c26] flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
            <p className="text-sm text-slate-400">No CS2 items found in your Steam inventory.</p>
            <p className="text-xs text-slate-500">Make sure your CS2 inventory has tradable items and is set to Public in Steam privacy settings.</p>
            <a href="https://steamcommunity.com/my/inventory/#730" target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-[#66c0f4] hover:underline mt-1">
              Open Steam Inventory ↗
            </a>
          </div>
        )}

        {tradableItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {tradableItems.map((item) => {
              const listingUrl = `/seller/listings/new?${new URLSearchParams({
                name: item.market_hash_name,
                float: item.float?.toString() || '',
                paintSeed: item.paintseed?.toString() || '',
                exterior: item.exterior || '',
                rarity: item.rarity || '',
                inspect: item.inspectLink || '',
                market: item.marketLink || '',
                stattrak: item.tags?.some(t => t.category === 'Quality' && t.internal_name === 'strange') ? '1' : '0',
                icon: item.icon_url_large || item.icon_url || '',
              }).toString()}`;

              return (
                <Link
                  key={item.assetid}
                  href={listingUrl}
                  className="p-3 bg-[#111118] border border-[#1c1c26] rounded-xl flex items-start gap-3 hover:border-[#ff6a00]/40 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-lg bg-[#0d0d12] flex-shrink-0 flex items-center justify-center border border-[#1c1c26] overflow-hidden">
                    <img src={item.icon_url} alt={item.market_hash_name} className="w-full h-full object-contain" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate" style={{ color: `#${item.name_color}` || '#d2d2d2' }}>
                      {item.market_name}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white" style={{ backgroundColor: RARITY_BG[item.rarity] || '#4b69ff' }}>
                        {item.rarity}
                      </span>
                      {item.exterior && <span className="text-[10px] text-slate-400">{item.exterior}</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {item.float !== undefined && <span className="text-[10px] text-slate-500 font-mono">F: {item.float.toFixed(6)}</span>}
                      {item.paintseed !== undefined && <span className="text-[10px] text-slate-500 font-mono">S: {item.paintseed}</span>}
                      {item.inspectLink && <span className="text-[10px] text-[#66c0f4] font-bold" title={item.inspectLink}>Inspect</span>}
                      {item.marketLink && (
                        <a href={item.marketLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-[#66c0f4] hover:underline" title="View on Steam Market">Market</a>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#22c55e] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    List Item →
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {tradableItems.length > 0 && (
          <div className="text-center text-xs text-slate-500 pt-2">
            Click any item to create a listing with pre-filled data
          </div>
        )}
      </div>
    </div>
  );
}

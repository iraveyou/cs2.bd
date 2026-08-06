import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { getPlayerSummary } from '../../lib/steam/client';

export const metadata = {
  title: 'Verified Sellers — CS2BD',
  description: 'Browse verified CS2 skin merchants in Bangladesh with trade history and trust scores.',
};

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    where: { verifiedAt: { not: null } },
    include: {
      user: { select: { steamId: true } },
      _count: { select: { orders: { where: { status: 'COMPLETED' } }, listings: { where: { status: 'ACTIVE' } } } },
    },
    orderBy: { trustScore: 'desc' },
  });

  const storeData = await Promise.all(
    stores.map(async (s) => {
      let avatar: string | null = null;
      if (s.user?.steamId) {
        try {
          const player = await getPlayerSummary(s.user.steamId);
          if (player) avatar = player.avatarfull;
        } catch {}
      }
      return {
        id: s.id,
        slug: s.slug,
        name: s.name,
        description: s.description,
        trustScore: s.trustScore,
        completedTrades: s._count.orders,
        activeListings: s._count.listings,
        verifiedAt: s.verifiedAt,
        avatar,
      };
    })
  );

  const verifiedCount = storeData.length;
  const totalTrades = storeData.reduce((a, s) => a + s.completedTrades, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-3 mb-8">
        <span className="badge badge-verified">Verified Merchants</span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Verified Seller <span className="gradient-text">Stores</span></h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          {verifiedCount} verified Bangladeshi CS2 traders · {totalTrades.toLocaleString()} completed trades combined
        </p>
      </div>

      {storeData.length === 0 ? (
        <div className="text-center py-16 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl">
          <p className="text-slate-400 text-sm">No verified sellers yet. Apply to become the first!</p>
          <Link href="/become-seller" className="btn btn-primary text-sm mt-4 inline-block">Apply as Seller</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {storeData.map((s) => (
            <Link key={s.id} href={`/store/${s.slug}`}
              className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 hover:border-[#22c55e]/40 transition-all hover:shadow-lg hover:shadow-[#22c55e]/5 group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22c55e]/20 to-[#16a34a]/20 border border-[#22c55e]/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {s.avatar ? (
                    <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-black text-[#22c55e]">{s.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-100 truncate">{s.name}</h3>
                    <span className="text-emerald-400 text-xs flex-shrink-0">✓</span>
                  </div>
                  {s.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{s.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-[#ff6a00] font-bold">★ {s.trustScore.toFixed(1)}</span>
                    <span className="text-slate-400">{s.completedTrades} trades</span>
                    <span className="text-slate-400">{s.activeListings} listings</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

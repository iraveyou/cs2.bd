import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '../../../lib/auth/guards';
import { redirect } from 'next/navigation';
import { prisma } from '../../../lib/prisma';

export const metadata = {
  title: 'My Orders — cs2bd',
  description: 'Track skin purchases, reservation status, and trade history',
};

export default async function BuyerDashboardPage() {
  const session = await getCurrentUser();
  if (!session) redirect('/auth/signin');

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, phone: true, steamId: true },
  });

  const orders = await prisma.order.findMany({
    where: { buyerId: session.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      items: {
        include: {
          listing: { select: { name: true } },
        },
      },
      store: { select: { name: true } },
      payments: { select: { transactionId: true, status: true } },
    },
  });

  const activeOrders = orders.filter((o) =>
    ['RESERVED', 'PENDING_VERIFICATION', 'AWAITING_DELIVERY'].includes(o.status)
  );

  const completedOrders = orders.filter((o) =>
    ['DELIVERED', 'COMPLETED'].includes(o.status)
  );

  const cancelledOrders = orders.filter((o) =>
    ['CANCELLED', 'REFUNDED'].includes(o.status)
  );

  const statusColor: Record<string, string> = {
    RESERVED: 'bg-blue-500/10 text-blue-400',
    PENDING_VERIFICATION: 'bg-amber-500/10 text-amber-400',
    AWAITING_DELIVERY: 'bg-purple-500/10 text-purple-400',
    DELIVERED: 'bg-[#22c55e]/10 text-[#22c55e]',
    COMPLETED: 'bg-[#22c55e]/10 text-[#22c55e]',
    CANCELLED: 'bg-red-500/10 text-red-400',
    REFUNDED: 'bg-slate-500/10 text-slate-400',
    DISPUTED: 'bg-red-500/10 text-red-400',
  };

  const statusLabel: Record<string, string> = {
    RESERVED: 'Reserved',
    PENDING_VERIFICATION: 'Awaiting Verification',
    AWAITING_DELIVERY: 'Awaiting Delivery',
    DELIVERED: 'Delivered',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
    DISPUTED: 'Disputed',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1c26] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-accent">Buyer Dashboard</span>
            <span className="text-xs text-slate-400">Order History & Status</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">
            {user?.name || 'Your'} Orders
          </h1>
        </div>
        <Link href="/marketplace" className="btn btn-primary text-xs px-4">Browse Marketplace</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Orders', value: activeOrders.length, color: 'text-[#ff6a00]' },
          { label: 'Completed', value: completedOrders.length, color: 'text-[#22c55e]' },
          { label: 'Cancelled', value: cancelledOrders.length, color: 'text-slate-400' },
          { label: 'Total', value: orders.length, color: 'text-slate-100' },
        ].map((s) => (
          <div key={s.label} className="p-4 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl text-center">
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active Orders */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100">Active Orders</h2>

        {activeOrders.length === 0 ? (
          <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#111118] border border-[#1c1c26] flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <p className="text-sm text-slate-400">No active orders. Browse the marketplace to find skins.</p>
            <Link href="/marketplace" className="inline-block mt-3 text-sm text-[#22c55e] font-bold hover:underline">Browse Marketplace</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeOrders.map((order) => {
              const payment = order.payments[0];
              const itemNames = order.items.map((i) => i.listing?.name || 'Unknown item').join(', ');
              return (
                <div key={order.id} className="p-4 bg-[#0d0d12] border border-[#1c1c26] rounded-xl hover:border-[#22c55e]/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-100 text-sm truncate">{itemNames}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Seller: {order.store?.name || '—'} &middot; Order #{order.orderNumber}
                      </div>
                      {payment?.transactionId && (
                        <div className="text-xs text-slate-500 mt-0.5 font-mono">TrxID: {payment.transactionId}</div>
                      )}
                      <div className="text-sm font-extrabold text-[#22c55e] mt-1">৳ {Math.round(order.totalCents / 100).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${statusColor[order.status] || 'bg-slate-500/10 text-slate-400'}`}>
                        {statusLabel[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100">Completed Orders</h2>
          <div className="space-y-3">
            {completedOrders.map((order) => {
              const itemNames = order.items.map((i) => i.listing?.name || 'Unknown item').join(', ');
              return (
                <div key={order.id} className="p-4 bg-[#0d0d12] border border-[#1c1c26] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{itemNames}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {order.store?.name || '—'} &middot; Order #{order.orderNumber} &middot; {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-extrabold text-slate-100 mt-1">৳ {Math.round(order.totalCents / 100).toLocaleString()}</div>
                  </div>
                  <span className="badge badge-verified">{statusLabel[order.status] || order.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-12 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#111118] border border-[#1c1c26] flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="19" width="15" height="2" rx="1"/></svg>
          </div>
          <p className="text-slate-400 text-sm">No orders yet</p>
          <Link href="/marketplace" className="inline-block text-sm text-[#22c55e] font-bold hover:underline">Start browsing skins</Link>
        </div>
      )}
    </div>
  );
}

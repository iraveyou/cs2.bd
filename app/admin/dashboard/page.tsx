import React from 'react';
import Link from 'next/link';
import { requireAdmin } from '../../../lib/auth/guards';
import { prisma } from '../../../lib/prisma';

export const metadata = {
  title: 'Admin Dashboard — cs2bd',
  description: 'Manage payments, sellers, disputes, and system security',
};

export default async function AdminDashboardPage() {
  await requireAdmin();

  const pendingPayments = await prisma.payment.findMany({
    where: { status: 'SUBMITTED' },
    include: { order: true, buyer: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const sellerApplicants = await prisma.user.findMany({
    where: { role: 'SELLER_APPLICANT' },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const activeDisputes = await prisma.dispute.count({ where: { status: 'OPEN' } });
  const totalUsers = await prisma.user.count();
  const totalOrders = await prisma.order.count();
  const totalListings = await prisma.listing.count({ where: { status: 'ACTIVE' } });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1c26] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-accent">Admin Portal</span>
            <span className="text-xs text-slate-400">System Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Admin Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/sellers" className="btn btn-ghost text-xs border border-[#22c55e]/40 text-[#22c55e]">Seller Applications ({sellerApplicants.length})</Link>
          <Link href="/admin/payments" className="btn btn-ghost text-xs">Payment Queue ({pendingPayments.length})</Link>
          <Link href="/admin/cms" className="btn btn-ghost text-xs">CMS Pages</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, color: 'text-slate-100' },
          { label: 'Active Listings', value: totalListings, color: 'text-[#22c55e]' },
          { label: 'Total Orders', value: totalOrders, color: 'text-[#ff6a00]' },
          { label: 'Active Disputes', value: activeDisputes, color: 'text-red-400' },
        ].map((m) => (
          <div key={m.label} className="p-5 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl text-center">
            <div className={`text-2xl font-extrabold ${m.color}`}>{m.value}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">Pending Payment Verification</h2>
            <Link href="/admin/payments" className="text-xs text-[#22c55e] font-bold hover:underline">View All</Link>
          </div>

          {pendingPayments.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-4">No pending payments to review.</p>
          ) : (
            <div className="space-y-3">
              {pendingPayments.map((p) => (
                <div key={p.id} className="p-4 bg-[#111118] border border-[#1c1c26] rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-200">Order #{p.order?.orderNumber || '—'}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Buyer: {p.buyer?.name || '—'} · TrxID: <span className="font-mono text-slate-300">{p.transactionId || '—'}</span>
                    </div>
                    <div className="text-sm font-extrabold text-[#22c55e] mt-1">৳ {Math.round(p.amountCents / 100).toLocaleString()}</div>
                  </div>
                  <Link href="/admin/payments" className="px-3 py-1.5 bg-[#22c55e] text-black text-xs font-bold rounded-lg hover:bg-green-400 transition">Review</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">Seller Applications</h2>
            <Link href="/admin/sellers" className="text-xs text-[#22c55e] font-bold hover:underline">View All</Link>
          </div>

          {sellerApplicants.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-4">No seller applications pending.</p>
          ) : (
            <div className="space-y-3">
              {sellerApplicants.map((s) => (
                <div key={s.id} className="p-4 bg-[#111118] border border-[#1c1c26] rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-200">{s.name || 'Unnamed'}</div>
                    <div className="text-xs text-slate-400">{s.email}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Steam: {s.steamId || 'Not linked'}</div>
                  </div>
                  <Link href="/admin/sellers" className="px-3.5 py-1.5 bg-[#22c55e] text-black text-xs font-bold rounded-lg hover:bg-green-400 transition">Review</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

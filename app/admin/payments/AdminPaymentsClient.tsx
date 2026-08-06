'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface PaymentItem {
  id: string
  orderNumber: string
  amount: string
  method: string
  trxId: string
  senderNumber: string
  submittedAt: string
  status: string
  screenshotUrl?: string
  isDuplicate?: boolean
  duplicateCount?: number
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
}

interface AdminPaymentsClientProps {
  initialPayments: PaymentItem[]
}

export default function AdminPaymentsClient({ initialPayments }: AdminPaymentsClientProps) {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments)
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'HISTORY' | 'FRAUD'>('QUEUE')
  const [search, setSearch] = useState('')
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  // Fraud detection logic: group by trxId to spot duplicates
  const trxCounts: Record<string, number> = {}
  payments.forEach((p) => {
    if (p.trxId && p.trxId !== '-') {
      trxCounts[p.trxId] = (trxCounts[p.trxId] || 0) + 1
    }
  })

  // Filter based on tab and search query
  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.trxId.toLowerCase().includes(search.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.senderNumber.includes(search) ||
      p.method.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === 'QUEUE') return p.status === 'SUBMITTED' || p.status === 'SCREENSHOT_REQUESTED'
    if (activeTab === 'HISTORY') return p.status === 'VERIFIED' || p.status === 'REJECTED'
    if (activeTab === 'FRAUD') return (trxCounts[p.trxId] > 1) || p.riskLevel === 'HIGH' || p.status === 'FLAGGED'

    return true
  })

  async function handleApprove(id: string) {
    try {
      await fetch(`/api/admin/payments/${id}/approve`, { method: 'POST' })
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'VERIFIED' } : p))
      )
      setActionMessage(`Payment ${id} successfully VERIFIED & APPROVED.`)
      setTimeout(() => setActionMessage(null), 3000)
    } catch (e) {
      alert('Failed to approve payment')
    }
  }

  async function handleReject(id: string) {
    try {
      await fetch(`/api/admin/payments/${id}/reject`, { method: 'POST' })
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'REJECTED' } : p))
      )
      setActionMessage(`Payment ${id} REJECTED.`)
      setTimeout(() => setActionMessage(null), 3000)
    } catch (e) {
      alert('Failed to reject payment')
    }
  }

  async function handleRequestScreenshot(id: string) {
    try {
      await fetch(`/api/admin/payments/${id}/request-screenshot`, { method: 'POST' })
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'SCREENSHOT_REQUESTED' } : p))
      )
      setActionMessage(`Requested payment screenshot from buyer for ${id}.`)
      setTimeout(() => setActionMessage(null), 3000)
    } catch (e) {
      alert('Failed to request screenshot')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1c26] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-accent">Admin Audit</span>
            <span className="text-xs text-slate-400">Manual Payment Verification System</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-1">Transaction Verification Queue</h1>
        </div>

        <Link href="/admin/dashboard" className="btn btn-ghost text-xs">
          ← Back to Admin Dashboard
        </Link>
      </div>

      {actionMessage && (
        <div className="p-3 bg-[#00cc88]/10 border border-[#00cc88]/30 rounded-xl text-xs text-[#00cc88] font-bold">
          {actionMessage}
        </div>
      )}

      {/* Fraud Alert Bar if duplicates exist */}
      {Object.values(trxCounts).some((c) => c > 1) && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Fraud Detection Triggered
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Multiple duplicate Transaction IDs (TrxIDs) detected in the system. Review suspicious entries in the Fraud tab.
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 bg-[#0d0d12] p-1.5 rounded-xl border border-[#1c1c26] w-fit">
          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'QUEUE'
                ? 'bg-[#ff6a00] text-black shadow-md shadow-[#ff6a00]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Queue ({payments.filter((p) => p.status === 'SUBMITTED' || p.status === 'SCREENSHOT_REQUESTED').length})
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'HISTORY'
                ? 'bg-[#ff6a00] text-black shadow-md shadow-[#ff6a00]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Payment History ({payments.filter((p) => p.status === 'VERIFIED' || p.status === 'REJECTED').length})
          </button>

          <button
            onClick={() => setActiveTab('FRAUD')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'FRAUD'
                ? 'bg-red-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fraud & Flagged ({payments.filter((p) => (trxCounts[p.trxId] > 1) || p.riskLevel === 'HIGH').length})
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search TrxID, Order #, Sender Phone..."
          className="bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-4 py-2 text-xs text-white outline-none w-full sm:w-72"
        />
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl text-center text-slate-400 text-xs">
            No transactions match the selected tab or search criteria.
          </div>
        ) : (
          filtered.map((p) => {
            const isDuplicate = trxCounts[p.trxId] > 1
            return (
              <div
                key={p.id}
                className={`p-5 bg-[#0d0d12] border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition ${
                  isDuplicate
                    ? 'border-red-500/50 bg-red-950/10'
                    : p.status === 'VERIFIED'
                    ? 'border-[#00cc88]/30'
                    : 'border-[#1c1c26]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{p.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#ff6a00]/15 text-[#ff8a3d] border border-[#ff6a00]/30">
                      {p.method}
                    </span>

                    {/* Status Pill */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'VERIFIED'
                          ? 'bg-[#00cc88]/20 text-[#00cc88]'
                          : p.status === 'REJECTED'
                          ? 'bg-red-500/20 text-red-400'
                          : p.status === 'SCREENSHOT_REQUESTED'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {p.status}
                    </span>

                    {isDuplicate && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500 text-white animate-pulse">
                        ⚠️ DUPLICATE TRXID ({trxCounts[p.trxId]}x)
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300">
                    Amount: <strong className="text-[#00cc88] font-mono text-sm">৳ {p.amount}</strong>
                  </div>

                  <div className="text-xs text-slate-400 font-mono space-x-3">
                    <span>TrxID: <strong className="text-white">{p.trxId}</strong></span>
                    <span>Sender: <strong className="text-white">{p.senderNumber}</strong></span>
                  </div>

                  <div className="text-[11px] text-slate-500">Submitted: {p.submittedAt}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {p.status === 'SUBMITTED' || p.status === 'SCREENSHOT_REQUESTED' ? (
                    <>
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="px-3.5 py-2 bg-[#00cc88] hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition shadow-md shadow-[#00cc88]/20"
                      >
                        ✓ Verify & Approve
                      </button>

                      <button
                        onClick={() => handleRequestScreenshot(p.id)}
                        className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl transition"
                      >
                        📸 Request Screenshot
                      </button>

                      <button
                        onClick={() => handleReject(p.id)}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-bold rounded-xl transition"
                      >
                        ✕ Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Audit Completed</span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

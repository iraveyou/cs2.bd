'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function ApplySellerPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nid: '',
    facebook: '',
    steamProfile: '',
    discord: '',
    experience: '1-2 years',
    bankDetails: '',
    bkash: '',
    nagad: '',
    portfolio: '',
    previousSales: '',
  })

  const [documents, setDocuments] = useState<File | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([k, v]) => data.append(k, v))
      if (documents) data.append('documents', documents)

      const res = await fetch('/api/seller/apply', {
        method: 'POST',
        body: data,
      })

      const resJson = await res.json()
      if (!res.ok || !resJson.ok) {
        throw new Error(resJson.message || 'Submission failed')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Error submitting seller application')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="container max-w-2xl mx-auto py-16 px-4">
        <div className="card-glass p-8 text-center space-y-4 border border-[#00cc88]/30">
          <div className="w-16 h-16 bg-[#00cc88]/20 text-[#00cc88] rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <h1 className="text-2xl font-extrabold text-white">Application Submitted!</h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-lg mx-auto">
            Thank you, <span className="font-semibold text-white">{formData.name}</span>. Your Bangladeshi CS2 seller application and NID verification documents have been transmitted to the cs2bd Admin Compliance Team.
          </p>
          <div className="p-4 bg-[#0d0d12] rounded-xl text-xs text-slate-400 border border-[#1c1c26] text-left space-y-1">
            <div>• <strong className="text-slate-200">Estimated Review Time:</strong> 12–24 Hours</div>
            <div>• <strong className="text-slate-200">Steam Profile:</strong> {formData.steamProfile}</div>
            <div>• <strong className="text-slate-200">bKash Payout:</strong> {formData.bkash || formData.phone}</div>
          </div>
          <div className="pt-4 flex justify-center gap-3">
            <Link href="/buyer/dashboard" className="btn btn-primary text-xs">
              Go to Dashboard
            </Link>
            <Link href="/marketplace" className="btn btn-ghost text-xs">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container max-w-3xl mx-auto py-12 px-4 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-accent">Merchant Application</span>
          <span className="text-xs text-slate-400">Bangladesh Verified Merchant Program</span>
        </div>
        <h1 className="text-3xl font-black text-white">Apply for Seller Merchant Status</h1>
        <p className="text-sm text-slate-400 mt-1">
          Complete your KYC profile to list CS2 items, get the Verified Badge, and receive payouts directly to bKash, Nagad, or Bank.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-glass p-6 md:p-8 space-y-6">
        {/* Section 1: Personal Identification */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white border-b border-[#1c1c26] pb-2 flex items-center gap-2">
            <span>👤</span> 1. Identity & Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Full Legal Name (as on NID) *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Tanvir Ahmed Chowdhury"
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">National ID (NID / Passport) *</label>
              <input
                type="text"
                name="nid"
                value={formData.nid}
                onChange={handleChange}
                placeholder="e.g. 1998123456789"
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seller@example.com"
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Phone Number (SMS / WhatsApp) *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01712345678"
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Gaming & Social Verification */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white border-b border-[#1c1c26] pb-2 flex items-center gap-2">
            <span>🎮</span> 2. Steam & Social Profiles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Steam Profile URL or Steam64 ID *</label>
              <input
                type="text"
                name="steamProfile"
                value={formData.steamProfile}
                onChange={handleChange}
                placeholder="https://steamcommunity.com/id/yourid"
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Facebook Profile Link</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/username"
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Discord Tag / Username</label>
              <input
                type="text"
                name="discord"
                value={formData.discord}
                onChange={handleChange}
                placeholder="e.g. cs2trader#1234"
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">CS2 Trading Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              >
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1-2 years">1–2 years</option>
                <option value="3+ years">3+ years</option>
                <option value="High Volume Commercial Trader">High Volume Commercial Trader</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Payout Accounts & History */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white border-b border-[#1c1c26] pb-2 flex items-center gap-2">
            <span>💳</span> 3. Bangladesh Payout Methods & Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">bKash Personal / Merchant Number</label>
              <input
                type="text"
                name="bkash"
                value={formData.bkash}
                onChange={handleChange}
                placeholder="017XXXXXXXX"
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Nagad Account Number</label>
              <input
                type="text"
                name="nagad"
                value={formData.nagad}
                onChange={handleChange}
                placeholder="018XXXXXXXX"
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-300 block mb-1">Bank Account Info (Optional for large payouts)</label>
              <input
                type="text"
                name="bankDetails"
                value={formData.bankDetails}
                onChange={handleChange}
                placeholder="Bank Name, Branch, Account Holder & Number"
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-300 block mb-1">Previous Trading History & Portfolio Links</label>
              <textarea
                name="previousSales"
                rows={3}
                value={formData.previousSales}
                onChange={handleChange}
                placeholder="Mention past trade rep groups, CSFloat / Buff163 shop links, or estimated monthly CS2 skin inventory volume..."
                className="w-full bg-[#0d0d12] border border-[#1c1c26] focus:border-[#ff6a00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Document Verification */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white border-b border-[#1c1c26] pb-2 flex items-center gap-2">
            <span>📎</span> 4. Identity Documents & Screenshots
          </h2>

          <div>
            <label className="text-xs text-slate-300 block mb-1">NID Front/Back Photo or Steam Rep Proof</label>
            <input
              type="file"
              onChange={(e) => setDocuments(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:bg-[#1c1c26] file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">Accepts JPG, PNG, or PDF up to 10MB.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#ff6a00] to-[#ff8a3d] hover:from-[#ff8a3d] hover:to-[#ff6a00] text-black font-extrabold py-3.5 px-6 rounded-xl text-sm transition shadow-lg shadow-[#ff6a00]/20"
        >
          {loading ? 'Submitting Application...' : 'Submit Verified Seller Application'}
        </button>
      </form>
    </main>
  )
}

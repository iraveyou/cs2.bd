'use client'

import React, { useState, useEffect } from 'react'

interface BuyPanelProps {
  listingId: string
  priceCents: number
}

export default function BuyPanel({ listingId, priceCents }: BuyPanelProps) {
  const [step, setStep] = useState<'INITIAL' | 'INSTRUCTIONS' | 'SUBMITTED'>('INITIAL')
  const [method, setMethod] = useState<'bKash' | 'Nagad' | 'Personal'>('bKash')
  const [senderNumber, setSenderNumber] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const [orderDetails, setOrderDetails] = useState<{
    orderId: string
    reference: string
    merchantNumber: string
    amount: string
    reservedUntil: number
  } | null>(null)

  const formattedAmount = (priceCents / 100).toLocaleString('en-BD')

  // Merchant numbers configuration for BD
  const merchantNumbers = {
    bKash: '01700-112233',
    Nagad: '01800-445566',
    Personal: '01900-778899',
  }

  function handleReserve() {
    const randomId = Math.floor(1000 + Math.random() * 9000)
    const randomRef = Math.random().toString(36).substring(2, 7).toUpperCase()
    setOrderDetails({
      orderId: `ORD-${randomId}-BD`,
      reference: `UG-${randomRef}`,
      merchantNumber: merchantNumbers[method],
      amount: formattedAmount,
      reservedUntil: Date.now() + 30 * 60 * 1000,
    })
    setStep('INSTRUCTIONS')
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopiedField(label)
    setTimeout(() => setCopiedField(null), 2000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!senderNumber || !transactionId) {
      setError('Please provide both Sender Number and Transaction ID (TrxID)')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const form = new FormData()
      form.append('listingId', listingId)
      form.append('amount', (priceCents / 100).toString())
      form.append('method', method)
      form.append('senderNumber', senderNumber)
      form.append('transactionId', transactionId)
      form.append('orderId', orderDetails?.orderId || '')
      if (screenshot) form.append('screenshot', screenshot)

      const res = await fetch('/api/payments', { method: 'POST', body: form })
      const data = await res.json()

      // Local storage history persistence
      try {
        const history = JSON.parse(localStorage.getItem('payments') || '[]')
        history.unshift({
          id: data.id || orderDetails?.orderId,
          orderId: orderDetails?.orderId,
          listingId,
          amount: formattedAmount,
          method,
          senderNumber,
          transactionId,
          status: 'PENDING_VERIFICATION',
          createdAt: new Date().toISOString(),
        })
        localStorage.setItem('payments', JSON.stringify(history))
      } catch (err) {}

      setStep('SUBMITTED')
    } catch (err: any) {
      setError(err.message || 'Payment submission failed')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'INITIAL') {
    return (
      <div className="space-y-3">
        <button
          onClick={handleReserve}
          className="w-full bg-gradient-to-r from-[#ff6a00] to-[#ff8a3d] hover:from-[#ff8a3d] hover:to-[#ff6a00] text-black font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-[#ff6a00]/20 transition-all transform active:scale-95 text-base flex items-center justify-center gap-2"
        >
          <span>⚡ Buy Now (Reserve Item)</span>
        </button>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>🔒 Escrow Protected</span>
          <span>•</span>
          <span>bKash / Nagad Accepted</span>
        </div>
      </div>
    )
  }

  if (step === 'SUBMITTED') {
    return (
      <div className="p-5 bg-[#08131d] border border-[#22c55e]/30 rounded-2xl text-center space-y-4">
        <div className="w-12 h-12 bg-[#22c55e]/20 text-[#22c55e] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <div>
          <span className="badge badge-accent mb-2">Status: Pending Verification</span>
          <h3 className="text-xl font-extrabold text-slate-100">Payment Proof Submitted</h3>
          <p className="text-xs text-slate-300 mt-1">
            Order ID: <span className="font-mono text-[#ff8a3d] font-bold">{orderDetails?.orderId}</span>
          </p>
        </div>

        <div className="p-3 bg-[#0d0d12] rounded-xl text-left text-xs space-y-1.5 border border-[#1c1c26]">
          <div className="flex justify-between text-slate-400">
            <span>Method:</span> <span className="text-slate-200 font-semibold">{method}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Sender:</span> <span className="text-slate-200 font-semibold">{senderNumber}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>TrxID:</span> <span className="text-slate-200 font-mono font-semibold">{transactionId}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Admin is reviewing your transaction details. Once verified, the seller will be notified to send the Steam Trade Offer.
        </p>

        <a
          href="/buyer/dashboard"
          className="inline-block w-full py-2.5 px-4 bg-[#1c1c26] hover:bg-[#252533] text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
        >
          View Order Status in Buyer Dashboard →
        </a>
      </div>
    )
  }

  return (
    <div className="p-4 bg-[#0d0d12] border border-[#ff6a00]/30 rounded-2xl space-y-5">
      {/* Order Reservation Badge Header */}
      <div className="flex items-center justify-between border-b border-[#1c1c26] pb-3">
        <div>
          <div className="text-xs font-bold text-[#ff6a00] uppercase tracking-wider">Item Reserved</div>
          <div className="text-xs text-slate-400 font-mono">Order ID: {orderDetails?.orderId}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-amber-400 font-semibold">⏱️ 30:00 Lock</div>
          <div className="text-[10px] text-slate-500">Auto-expires if unpaid</div>
        </div>
      </div>

      {/* Payment Instructions Display */}
      <div className="bg-[#111118] p-4 rounded-xl border border-[#1c1c26] space-y-3">
        <div className="text-xs font-bold text-slate-200">1. Payment Instructions</div>

        {/* Method Picker */}
        <div className="grid grid-cols-3 gap-2">
          {(['bKash', 'Nagad', 'Personal'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                method === m
                  ? 'bg-[#ff6a00]/20 border-[#ff6a00] text-[#ff8a3d]'
                  : 'bg-[#0d0d12] border-[#1c1c26] text-slate-400 hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Display Merchant Number & Amount & Reference */}
        <div className="space-y-2 text-xs pt-1">
          <div className="flex items-center justify-between bg-[#0d0d12] p-2.5 rounded-lg border border-[#1c1c26]">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">
                {method} {method === 'Personal' ? 'Personal Number' : 'Merchant Number'}
              </span>
              <span className="font-mono font-extrabold text-slate-100 text-sm">
                {merchantNumbers[method]}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(merchantNumbers[method], 'number')}
              className="px-2.5 py-1 bg-[#1c1c26] hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-md transition"
            >
              {copiedField === 'number' ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#0d0d12] p-2.5 rounded-lg border border-[#1c1c26]">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Amount to Send</span>
              <span className="font-extrabold text-[#22c55e] text-sm">৳ {formattedAmount}</span>
            </div>
            <span className="text-[10px] text-slate-400">Send Money / Payment</span>
          </div>

          <div className="flex items-center justify-between bg-[#0d0d12] p-2.5 rounded-lg border border-[#1c1c26]">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Reference Code</span>
              <span className="font-mono font-bold text-amber-400 text-xs">{orderDetails?.reference}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(orderDetails?.reference || '', 'ref')}
              className="px-2.5 py-1 bg-[#1c1c26] hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-md transition"
            >
              {copiedField === 'ref' ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="text-xs font-bold text-slate-200">2. Submit Transaction Proof</div>

        <div>
          <label className="text-[11px] text-slate-400 block mb-1">Your Sender Phone Number</label>
          <input
            type="text"
            value={senderNumber}
            onChange={(e) => setSenderNumber(e.target.value)}
            placeholder="e.g. 017XXXXXXXX"
            className="w-full bg-[#111118] border border-[#1c1c26] focus:border-[#ff6a00] rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
            required
          />
        </div>

        <div>
          <label className="text-[11px] text-slate-400 block mb-1">Transaction ID (TrxID)</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="e.g. BK9X2810A"
            className="w-full bg-[#111118] border border-[#1c1c26] focus:border-[#ff6a00] rounded-lg px-3 py-2 text-xs text-slate-200 outline-none font-mono"
            required
          />
        </div>

        <div>
          <label className="text-[11px] text-slate-400 block mb-1">Payment Screenshot (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-[#1c1c26] file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
          />
        </div>

        {error && <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff6a00] hover:bg-[#ff8a3d] text-black font-extrabold py-2.5 px-4 rounded-xl text-xs transition shadow-md shadow-[#ff6a00]/20"
        >
          {loading ? 'Submitting Payment Proof...' : 'Submit Payment Proof'}
        </button>
      </form>
    </div>
  )
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Clock,
  Search,
  ExternalLink,
  FileText,
  CreditCard,
  Phone,
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Building2,
  Gamepad2,
  Share2,
  Lock,
  Eye,
  Filter
} from 'lucide-react';

interface SellerApplication {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  nid: string;
  facebook: string;
  steamProfile: string;
  discord: string;
  experience: string;
  bankDetails: string;
  bkash: string;
  nagad: string;
  portfolio: string;
  previousSales: string;
  documentsUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

export default function AdminSellerApplicationsPage() {
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<SellerApplication | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const isAdmin = authStatus === 'authenticated' && ((session as any)?.role) === 'ADMIN';

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sellers/applications');
      const json = await res.json();
      if (json.ok) {
        setApplications(json.data);
        if (json.data.length > 0 && !selectedApp) {
          setSelectedApp(json.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(appId: string) {
    try {
      setProcessing(true);
      const res = await fetch('/api/admin/sellers/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, notes: actionNotes || 'Verified NID & Steam inventory. Approved by Admin.' }),
      });
      const json = await res.json();
      if (json.ok) {
        setToastMessage({ text: json.message, type: 'success' });
        setActionNotes('');
        await fetchApplications();
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp(json.data);
        }
      } else {
        setToastMessage({ text: json.message || 'Approval failed', type: 'error' });
      }
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Server error', type: 'error' });
    } finally {
      setProcessing(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  }

  async function handleReject(appId: string) {
    try {
      setProcessing(true);
      const res = await fetch('/api/admin/sellers/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, notes: actionNotes || 'Information verification failed or invalid documents.' }),
      });
      const json = await res.json();
      if (json.ok) {
        setToastMessage({ text: json.message, type: 'success' });
        setActionNotes('');
        await fetchApplications();
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp(json.data);
        }
      } else {
        setToastMessage({ text: json.message || 'Rejection failed', type: 'error' });
      }
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Server error', type: 'error' });
    } finally {
      setProcessing(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  }

  const filteredApps = applications.filter((app) => {
    if (filter !== 'ALL' && app.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone.includes(q) ||
        app.nid.includes(q) ||
        app.steamProfile.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;

  if (authStatus === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-6 h-6 border-2 border-[#ff6a00] border-t-transparent rounded-full animate-spin" />
          <span>Verifying credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#ff3d81]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#ff3d81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L2.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Access Denied</h1>
        <p className="text-slate-400 text-sm">Admin access required to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl border text-sm font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#18181b] border-[#22c55e]/40 text-[#22c55e]'
              : 'bg-[#18181b] border-red-500/40 text-red-400'
          }`}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-[#a1a1aa]">
            <Link href="/admin/dashboard" className="hover:text-white flex items-center gap-1 transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#22c55e]">Merchant Verification</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            Seller Applications <ShieldCheck className="w-7 h-7 text-[#22c55e]" />
          </h1>
          <p className="text-sm text-[#a1a1aa] mt-1">
            Review NID verification, Steam profile authenticity, and banking details to approve CS2 merchants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-xl text-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] animate-pulse"></span>
            <span className="text-[#a1a1aa]">Pending:</span>
            <span className="font-extrabold text-white">{pendingCount}</span>
          </div>
          <div className="px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-xl text-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
            <span className="text-[#a1a1aa]">Approved:</span>
            <span className="font-extrabold text-white">{approvedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#18181b] p-4 border border-[#27272a] rounded-2xl">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                filter === st
                  ? 'bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/20'
                  : 'bg-[#27272a]/50 text-[#a1a1aa] hover:bg-[#27272a] hover:text-white'
              }`}
            >
              {st === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
              {st === 'APPROVED' && <UserCheck className="w-3.5 h-3.5" />}
              {st === 'REJECTED' && <UserX className="w-3.5 h-3.5" />}
              <span>{st}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
          <input
            type="text"
            placeholder="Search by name, NID, phone, Steam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#22c55e]"
          />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Applications */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider px-1 flex justify-between">
            <span>Applicants ({filteredApps.length})</span>
            <span>Click to view details</span>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-2xl text-xs text-[#a1a1aa]">
              Loading applications...
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-2xl text-xs text-[#a1a1aa]">
              No applications match the selected filter.
            </div>
          ) : (
            filteredApps.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#18181b] border-[#22c55e] ring-1 ring-[#22c55e]/30 shadow-lg'
                      : 'bg-[#18181b]/60 border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        {app.name}
                      </div>
                      <div className="text-xs text-[#a1a1aa]">{app.email}</div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        app.status === 'APPROVED'
                          ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30'
                          : app.status === 'REJECTED'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : 'bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/30'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#a1a1aa] pt-1 border-t border-[#27272a]/50">
                    <div>
                      <span className="text-[#71717a]">Phone:</span> <span className="text-slate-200">{app.phone}</span>
                    </div>
                    <div>
                      <span className="text-[#71717a]">NID:</span> <span className="font-mono text-slate-200">{app.nid}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#71717a] flex items-center justify-between pt-1">
                    <span>Applied: {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-[#22c55e] font-bold flex items-center gap-1">
                      View Dossier →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Complete Application Dossier View */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-6 sticky top-6">
              {/* Header Dossier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#22c55e] font-extrabold uppercase tracking-wider">
                      Merchant KYC File #{selectedApp.id.slice(-6)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">{selectedApp.name}</h2>
                  <p className="text-xs text-[#a1a1aa]">{selectedApp.email} • {selectedApp.phone}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider border ${
                      selectedApp.status === 'APPROVED'
                        ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30'
                        : selectedApp.status === 'REJECTED'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-[#eab308]/10 text-[#eab308] border-[#eab308]/30'
                    }`}
                  >
                    {selectedApp.status}
                  </span>
                  {selectedApp.reviewedAt && (
                    <div className="text-[10px] text-[#71717a] mt-1">
                      Reviewed: {new Date(selectedApp.reviewedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* 1. Identification & Contact */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#27272a]/50 pb-1.5">
                  <UserCheck className="w-4 h-4 text-[#22c55e]" /> Personal & Verification Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#09090b] p-3 rounded-xl border border-[#27272a]">
                    <span className="text-[#a1a1aa] block text-[10px]">National ID (NID)</span>
                    <span className="font-mono text-sm font-bold text-white">{selectedApp.nid}</span>
                  </div>
                  <div className="bg-[#09090b] p-3 rounded-xl border border-[#27272a]">
                    <span className="text-[#a1a1aa] block text-[10px]">Phone Number (bKash/Nagad linked)</span>
                    <span className="font-bold text-white">{selectedApp.phone}</span>
                  </div>
                </div>
              </div>

              {/* 2. Gaming & Social Profiles */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#27272a]/50 pb-1.5">
                  <Gamepad2 className="w-4 h-4 text-[#22c55e]" /> Gaming & Social Profiles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <a
                    href={selectedApp.steamProfile}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#09090b] p-3 rounded-xl border border-[#27272a] hover:border-[#22c55e] transition group"
                  >
                    <span className="text-[#a1a1aa] text-[10px] flex items-center gap-1">
                      Steam Profile <ExternalLink className="w-3 h-3 group-hover:text-[#22c55e]" />
                    </span>
                    <span className="font-semibold text-white truncate block mt-0.5">
                      {selectedApp.steamProfile.replace('https://steamcommunity.com/id/', '')}
                    </span>
                  </a>

                  <a
                    href={selectedApp.facebook || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#09090b] p-3 rounded-xl border border-[#27272a] hover:border-[#22c55e] transition group"
                  >
                    <span className="text-[#a1a1aa] text-[10px] flex items-center gap-1">
                      Facebook Profile <ExternalLink className="w-3 h-3 group-hover:text-[#22c55e]" />
                    </span>
                    <span className="font-semibold text-white truncate block mt-0.5">
                      {selectedApp.facebook ? selectedApp.facebook.replace('https://facebook.com/', '') : 'N/A'}
                    </span>
                  </a>

                  <div className="bg-[#09090b] p-3 rounded-xl border border-[#27272a]">
                    <span className="text-[#a1a1aa] block text-[10px]">Discord Handle</span>
                    <span className="font-semibold text-white block mt-0.5">{selectedApp.discord || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* 3. Financial & Payout Accounts */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#27272a]/50 pb-1.5">
                  <CreditCard className="w-4 h-4 text-[#22c55e]" /> Bangladesh Payout Channels
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#09090b] p-3 rounded-xl border border-[#27272a]">
                    <span className="text-[#a1a1aa] text-[10px] block">bKash Account</span>
                    <span className="font-extrabold text-[#e11d48] text-sm">{selectedApp.bkash || selectedApp.phone}</span>
                  </div>
                  <div className="bg-[#09090b] p-3 rounded-xl border border-[#27272a]">
                    <span className="text-[#a1a1aa] text-[10px] block">Nagad Account</span>
                    <span className="font-extrabold text-[#f97316] text-sm">{selectedApp.nagad || selectedApp.phone}</span>
                  </div>
                  {selectedApp.bankDetails && (
                    <div className="sm:col-span-2 bg-[#09090b] p-3 rounded-xl border border-[#27272a]">
                      <span className="text-[#a1a1aa] text-[10px] block">Bank Account Routing Info</span>
                      <span className="text-white text-xs">{selectedApp.bankDetails}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Portfolio & Sales Proof */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#27272a]/50 pb-1.5">
                  <FileText className="w-4 h-4 text-[#22c55e]" /> Experience & Trading History
                </h3>
                <div className="bg-[#09090b] p-3.5 rounded-xl border border-[#27272a] space-y-2 text-xs">
                  <div>
                    <span className="text-[#a1a1aa] text-[10px] block">Trading Experience Level:</span>
                    <span className="font-bold text-[#22c55e]">{selectedApp.experience}</span>
                  </div>
                  <div>
                    <span className="text-[#a1a1aa] text-[10px] block">Portfolio & Foreign Store Links:</span>
                    <p className="text-white">{selectedApp.portfolio || 'No additional external links provided.'}</p>
                  </div>
                  <div>
                    <span className="text-[#a1a1aa] text-[10px] block">Previous Sales & References:</span>
                    <p className="text-slate-300 leading-relaxed">{selectedApp.previousSales || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* 5. Documents Photo Preview */}
              {selectedApp.documentsUrl && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-[#22c55e]" /> Uploaded NID Document Proof
                  </h3>
                  <div className="relative rounded-xl overflow-hidden border border-[#27272a] bg-[#09090b]">
                    <img
                      src={selectedApp.documentsUrl}
                      alt="NID Document Upload"
                      className="w-full h-48 object-cover opacity-90 hover:opacity-100 transition"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2.5 py-1 rounded-lg text-[10px] text-[#22c55e] font-bold border border-[#27272a]">
                      ✓ High Resolution Scan
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Audit Notes */}
              {selectedApp.adminNotes && (
                <div className="p-3 bg-[#eab308]/10 border border-[#eab308]/30 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-[#eab308] block">Admin Review Note:</span>
                  <p className="text-slate-300">{selectedApp.adminNotes}</p>
                </div>
              )}

              {/* Decision Action Panel */}
              <div className="pt-4 border-t border-[#27272a] space-y-3">
                <label className="text-xs font-bold text-white block">Admin Decision Notes / Reason</label>
                <input
                  type="text"
                  placeholder="e.g. NID verified. CSFloat profile rep confirmed."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    disabled={processing || selectedApp.status === 'APPROVED'}
                    className="flex-1 py-3 px-4 bg-[#22c55e] hover:bg-[#16a34a] text-black font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-[#22c55e]/20 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {selectedApp.status === 'APPROVED' ? 'Approved & Merchant Activated' : 'Approve Application'}
                  </button>

                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    disabled={processing || selectedApp.status === 'REJECTED'}
                    className="flex-1 py-3 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-red-500/30 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    {selectedApp.status === 'REJECTED' ? 'Application Rejected' : 'Reject Application'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-12 text-center text-[#a1a1aa] text-xs">
              Select an application from the left list to review complete merchant credentials.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

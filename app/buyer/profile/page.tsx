'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  steamId: string | null;
  tradeUrl: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number; favorites: number; reviews: number };
}

interface SteamPlayer {
  personaname: string;
  avatarfull: string;
}

export default function BuyerProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [steamPlayer, setSteamPlayer] = useState<SteamPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tradeUrl, setTradeUrl] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        if (!data.ok) return;

        setProfile(data.profile);
        setSteamPlayer(data.steamPlayer || null);
        setName(data.profile.name || '');
        setEmail(data.profile.email || '');
        setPhone(data.profile.phone || '');
        setTradeUrl(data.profile.tradeUrl || '');
      } catch (e) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, tradeUrl }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Save failed');

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="skeleton h-32 w-full max-w-lg mx-auto rounded-2xl" />
        <div className="skeleton h-8 w-48 mx-auto mt-4 rounded-lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400">{error || 'Profile not found'}</p>
        <Link href="/auth/signin" className="text-[#22c55e] text-sm hover:underline mt-2 inline-block">Sign in</Link>
      </div>
    );
  }

  const displayName = steamPlayer?.personaname || profile.name || 'Anonymous User';
  const displayAvatar = steamPlayer?.avatarfull || null;
  const steamProfileUrl = profile.steamId
    ? `https://steamcommunity.com/profiles/${profile.steamId}`
    : '';
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '—';

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0d0d12] via-[#111118] to-[#0a0a10] border border-[#1c1c26] rounded-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff6a00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative flex-shrink-0">
            {displayAvatar ? (
              <img src={displayAvatar} alt={displayName} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-[#22c55e]/30 shadow-lg shadow-[#22c55e]/10" />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#1c1c26] border-2 border-[#2a2a36] flex items-center justify-center text-3xl text-slate-500">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            {steamPlayer && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#171a21] border border-[#2a3f5a] rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#66c0f4]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm4.7 17.3l-1.1-5.1 2.8-2c.3-.2.4-.7.1-1-.3-.2-.7-.2-1 0l-2.8 2L12 9c-.3-.6-1-.7-1.5-.3l-1.9 1.4c-.5.4-.6 1.2-.1 1.7l3.6 5.5c.4.6 1.3.7 1.8.2l1.9-1.4c.4-.3.5-.9.1-1.4l-3-4.6 1.3 6.1c.1.6.6 1 1.2 1 .7 0 1.2-.6 1.1-1.3z"/></svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 break-words">{displayName}</h1>
            {steamPlayer && steamPlayer.personaname !== profile.name && (
              <p className="text-sm text-slate-400 mt-0.5">DB name: {profile.name || '—'}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] font-semibold capitalize">{profile.role.toLowerCase().replace('_', ' ')}</span>
              {profile.steamId && (
                <a href={steamProfileUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-0.5 rounded-full bg-[#171a21]/80 text-[#66c0f4] font-semibold hover:bg-[#1e2837] transition">Steam ↗</a>
              )}
              <span className="text-xs text-slate-500">Member since {memberSince}</span>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2">
            <Link href="/buyer/dashboard" className="btn btn-ghost text-xs h-8 px-3">Orders ({profile._count.orders})</Link>
            {!profile.steamId && <a href="/api/auth/steam" className="btn btn-primary text-xs h-8 px-3">Connect Steam</a>}
          </div>
        </div>

        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#1c1c26]">
          {[
            { value: profile._count.orders, label: 'Total Orders' },
            { value: profile._count.favorites, label: 'Favorites' },
            { value: profile._count.reviews, label: 'Reviews' },
            { value: profile.steamId ? 'Yes' : 'No', label: 'Steam Linked' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-100">Steam Identity</h2>
              {steamPlayer && <span className="text-xs px-2 py-1 rounded-full bg-[#22c55e]/10 text-[#22c55e] font-semibold">Synced</span>}
            </div>
            {steamPlayer ? (
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-[#111118] to-[#0d0d12] border border-[#1c1c26] rounded-xl">
                <img src={steamPlayer.avatarfull} alt={steamPlayer.personaname} className="w-14 h-14 rounded-xl border border-[#2a2a36] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-100 text-sm">{steamPlayer.personaname}</div>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">ID: {profile.steamId}</div>
                  <a href={steamProfileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#22c55e] hover:underline mt-1 inline-block">View Profile ↗</a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3 bg-[#111118] border border-[#1c1c26] rounded-xl">
                <div className="w-14 h-14 mx-auto rounded-xl bg-[#1c1c26] flex items-center justify-center">
                  <svg className="w-7 h-7 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm4.7 17.3l-1.1-5.1 2.8-2c.3-.2.4-.7.1-1-.3-.2-.7-.2-1 0l-2.8 2L12 9c-.3-.6-1-.7-1.5-.3l-1.9 1.4c-.5.4-.6 1.2-.1 1.7l3.6 5.5c.4.6 1.3.7 1.8.2l1.9-1.4c.4-.3.5-.9.1-1.4l-3-4.6 1.3 6.1c.1.6.6 1 1.2 1 .7 0 1.2-.6 1.1-1.3z"/></svg>
                </div>
                <p className="text-sm text-slate-400 px-4">Link your Steam account to use your Steam name &amp; avatar.</p>
                <a href="/api/auth/steam" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171a21] border border-[#2a3f5a] rounded-lg text-sm font-bold text-[#c5c3c0] hover:bg-[#1e2837] transition">Connect Steam Account</a>
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-100">Edit Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block font-semibold mb-1">Display Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your display name"
                  className="w-full px-3 py-2.5 bg-[#111118] border border-[#1c1c26] rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#22c55e]/50 transition" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block font-semibold mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full px-3 py-2.5 bg-[#111118] border border-[#1c1c26] rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#22c55e]/50 transition" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block font-semibold mb-1">Phone (bKash / Nagad)</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2.5 bg-[#111118] border border-[#1c1c26] rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#22c55e]/50 transition" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block font-semibold mb-1">Account Role</label>
                <div className="w-full px-3 py-2.5 bg-[#111118] border border-[#1c1c26] rounded-lg text-sm text-slate-400 capitalize">
                  {profile.role.toLowerCase().replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1c1c26]">
              <label className="text-xs text-slate-400 block font-semibold mb-1">Steam Trade URL</label>
              <input type="text" value={tradeUrl} onChange={(e) => setTradeUrl(e.target.value)}
                placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
                className="w-full px-3 py-2.5 bg-[#111118] border border-[#1c1c26] rounded-lg text-sm text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#22c55e]/50 transition" />
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Find in Steam &rarr; Inventory &rarr; Trade Offers &rarr; "Who can send me Trade Offers?" &rarr; Trade URL</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-400">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 p-3 bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-xl text-xs text-[#22c55e] animate-fade-in">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Profile saved successfully
              </div>
            )}

            <button type="submit" disabled={saving}
              className="px-5 py-2.5 bg-[#22c55e] text-black text-sm font-bold rounded-lg hover:bg-[#22c55e]/90 transition active:scale-[0.98] disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/buyer/dashboard" className="flex items-center gap-2 text-sm text-slate-300 hover:text-[#22c55e] transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="10" rx="1"/><path d="M14 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>Order History</Link>
              <Link href="/buyer/inventory" className="flex items-center gap-2 text-sm text-slate-300 hover:text-[#22c55e] transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>My Inventory</Link>
              <Link href="/marketplace" className="flex items-center gap-2 text-sm text-slate-300 hover:text-[#22c55e] transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>Browse Marketplace</Link>
            </div>
          </div>
          <div className="bg-[#0d0d12] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-red-400">Danger Zone</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Deleting your account is permanent. All data will be erased.</p>
            <button className="w-full px-4 py-2.5 border border-red-500/30 bg-red-500/5 text-red-400 text-sm font-semibold rounded-lg hover:bg-red-500/10 transition active:scale-[0.98]">Delete Account</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

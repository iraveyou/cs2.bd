'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const role: string = (session as any)?.role || (session as any)?.user?.role || '';
  const userName = (session as any)?.user?.name || (session as any)?.name || '';
  const steamId = (session as any)?.steamId || (session as any)?.user?.steamId || null;
  const isSeller = role === 'SELLER' || role === 'ADMIN';
  const isAdmin = role === 'ADMIN';
  const isSellerApplicant = role === 'SELLER_APPLICANT';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { href: '/marketplace', label: 'Marketplace', show: true },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link href="/" className="nav-brand" onClick={() => setMobileOpen(false)}>
            <span className="gradient-text">CS2BD</span>
          </Link>

          <div className="nav-links">
            {navLinks.filter((l) => l.show).map((l) => (
              <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
            ))}
            {isAdmin && <Link href="/admin/dashboard" className="nav-link">Admin</Link>}
          </div>

          <div className="nav-actions">
            {!session ? (
              <>
                <Link href="/auth/signin" className="btn btn-ghost btn-sm hidden md:inline-flex">Sign in</Link>
                <Link href="/auth/signup" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            ) : (
              <div className="flex items-center gap-1">
              <NotificationBell />
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-[#1c1c26] hover:border-[#22c55e]/40 hover:bg-white/[0.03] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22c55e]/20 to-[#16a34a]/20 border border-[#22c55e]/30 flex items-center justify-center text-xs font-bold text-[#22c55e] flex-shrink-0">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-300 max-w-28 truncate">
                    {userName || 'User'}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50 animate-fade-in">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[#1c1c26]">
                      <div className="text-sm font-bold text-white truncate">{userName || 'Anonymous'}</div>
                      <div className="text-xs text-slate-500 mt-0.5 capitalize">{role.toLowerCase().replace('_', ' ')}</div>
                      {steamId && (
                        <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-[#171a21]/80 text-[#66c0f4] font-semibold">Steam</span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="py-2 px-2 space-y-0.5">
                      <Link href="/buyer/dashboard" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white transition-colors">
                        <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="10" width="7" height="5" rx="1"/><path d="M14 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
                        Buyer Dashboard
                      </Link>
                      <Link href="/buyer/inventory" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white transition-colors">
                        <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                        My Inventory
                      </Link>

                      {(isSeller || isSellerApplicant) && (
                        <Link href="/seller/dashboard" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white transition-colors">
                          <svg className="w-4 h-4 text-[#ff6a00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                          Seller Dashboard
                          {isSellerApplicant && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold">Pending</span>}
                        </Link>
                      )}

                      {isAdmin && (
                        <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white transition-colors">
                          <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    {/* Separator */}
                    <div className="border-t border-[#1c1c26]" />

                    <div className="py-2 px-2 space-y-0.5">
                      <Link href="/buyer/profile" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white transition-colors">
                        <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Profile Settings
                      </Link>

                      {!isSeller && !isSellerApplicant && (
                        <Link href="/become-seller" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white transition-colors">
                          <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                          Become a Seller
                        </Link>
                      )}
                    </div>

                    {/* Separator */}
                    <div className="border-t border-[#1c1c26]" />

                    <div className="py-2 px-2">
                      <button onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-red-500/5 hover:text-red-400 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                    )}
                  </div>
                </div>
              )}

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path strokeLinecap="round" d="M3 5h18M3 12h18M3 19h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="mobile-nav z-50" role="dialog" aria-modal="true" aria-label="Mobile menu">
            {navLinks.filter((l) => l.show).map((l) => (
              <Link key={l.href} href={l.href} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>{l.label}</Link>
            ))}

            <div className="border-t border-[#1c1c26] my-2 pt-2 flex flex-col gap-0.5">
              {!session ? (
                <>
                  <Link href="/auth/signin" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Sign in</Link>
                  <Link href="/auth/signup" className="btn btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs text-slate-500 uppercase font-bold tracking-wider">Your Account</div>
                  <Link href="/buyer/dashboard" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Buyer Dashboard</Link>
                  <Link href="/buyer/inventory" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Inventory</Link>
                  {(isSeller || isSellerApplicant) && (
                    <Link href="/seller/dashboard" className="mobile-nav-link text-[#ff6a00]" onClick={() => setMobileOpen(false)}>Seller Dashboard</Link>
                  )}
                  {isAdmin && (
                    <Link href="/admin/dashboard" className="mobile-nav-link text-red-400" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
                  )}
                  <Link href="/buyer/profile" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Profile Settings</Link>
                  <button className="mobile-nav-link text-red-400 w-full text-left" onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}>
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

'use client';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const metadata = {
  title: 'Sign In — CS2BD Bangladesh',
  description: 'Sign in to your CS2BD account to buy and sell CS2 skins in Bangladesh. Use email/password or Steam to access your dashboard.',
};

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  ) : (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  );
}

function SignInForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    errorParam === 'SteamAuthFailed' ? 'Steam authentication failed. Please try again.' :
    errorParam === 'AccountCreationFailed' ? 'Account creation failed. Contact support.' :
    ''
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { signIn } = await import('next-auth/react');
      const res: any = await signIn('credentials', { redirect: false, email, password });
      if (res?.error) throw new Error(res.error);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 animate-fade-up">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block mb-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-lg shadow-[#22c55e]/25">
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M11.982 0C5.366 0 0 5.368 0 11.982c0 6.616 5.366 11.984 11.982 11.984 6.618 0 11.984-5.368 11.984-11.984C23.966 5.368 18.6 0 11.982 0zm4.568 17.146l-1.058-5.04 2.752-1.99a.34.34 0 00.1-.47.33.33 0 00-.46-.08l-2.75 1.99-3.08-2.26c-.32-.54-1-.66-1.5-.28l-1.88 1.36c-.52.36-.64 1.12-.14 1.66l3.52 5.38c.42.64 1.3.72 1.82.16l1.88-1.36c.44-.32.56-.96.14-1.46l-2.94-4.5 1.28 5.98c.1.54.58.96 1.14.96.66 0 1.18-.54 1.08-1.22z"/></svg>
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome Back</h1>
        <p className="text-sm text-slate-400">Sign in to trade CS2 skins in Bangladesh</p>
      </div>

      {/* Steam Button - Primary */}
      <a
        href="/api/auth/steam"
        className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-[#06BFFF] via-[#0099ff] to-[#0077cc] hover:from-[#0dc5ff] hover:via-[#0aa3ff] hover:to-[#0088dd] transition-all duration-300 shadow-lg shadow-[#06BFFF]/30 hover:shadow-[#06BFFF]/50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
        <svg className="w-5 h-5 relative z-10 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm4.7 17.3l-1.1-5.1 2.8-2c.3-.2.4-.7.1-1-.3-.2-.7-.2-1 0l-2.8 2L12 9c-.3-.6-1-.7-1.5-.3l-1.9 1.4c-.5.4-.6 1.2-.1 1.7l3.6 5.5c.4.6 1.3.7 1.8.2l1.9-1.4c.4-.3.5-.9.1-1.4l-3-4.6 1.3 6.1c.1.6.6 1 1.2 1 .7 0 1.2-.6 1.1-1.3z"/>
        </svg>
        <span className="relative z-10">Continue with Steam</span>
      </a>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1c1c26] to-transparent" />
        <span className="text-xs font-bold text-slate-600 tracking-widest uppercase shrink-0">or</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#1c1c26] to-transparent" />
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email</label>
          <input
            id="email" type="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3.5 bg-[#0f1115] border border-[#1c1c26] hover:border-[#2a2a36] focus:border-[#22c55e] rounded-xl text-white text-sm placeholder:text-slate-600 outline-none transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
            <Link href="/auth/signin" className="text-xs text-[#22c55e] hover:underline font-medium">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              id="password" type={showPass ? 'text' : 'password'} required autoComplete="current-password"
              value={password} onChange={(e) => setPass(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3.5 pr-12 bg-[#0f1115] border border-[#1c1c26] hover:border-[#2a2a36] focus:border-[#22c55e] rounded-xl text-white text-sm placeholder:text-slate-600 outline-none transition-colors"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              tabIndex={-1}>
              <EyeIcon open={showPass} />
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl animate-fade-in">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <div className="text-sm font-semibold text-red-300">Sign-in failed</div>
              <div className="text-xs text-red-400/80 mt-0.5">{error}</div>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-black text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#22c55e]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeLinecap="round" className="opacity-30"/></svg>
              Signing in...
            </span>
          ) : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-[#22c55e] font-bold hover:underline">Create account</Link>
      </p>

      <div className="flex items-center justify-center gap-6 pt-4">
        <Link href="/terms" className="text-xs text-slate-600 hover:text-slate-400 transition">Terms</Link>
        <Link href="/privacy" className="text-xs text-slate-600 hover:text-slate-400 transition">Privacy</Link>
        <Link href="/support" className="text-xs text-slate-600 hover:text-slate-400 transition">Support</Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  const bgSquares = Array.from({ length: 6 }, (_, i) => (
    <div key={i} className="absolute w-64 h-64 rounded-full opacity-[0.03] pointer-events-none"
      style={{
        background: i % 2 === 0 ? '#22c55e' : '#ff6a00',
        left: `${10 + i * 18}%`,
        top: `${20 + (i % 3) * 25}%`,
        filter: 'blur(80px)',
        animation: `float ${4 + i * 1.5}s ease-in-out infinite`,
        animationDelay: `${i * 0.5}s`,
      }}
    />
  ));

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex overflow-hidden">
      {bgSquares}

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 border-r border-[#1c1c26]">
        <div className="relative z-10 max-w-md text-center space-y-8">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-2xl shadow-[#22c55e]/30 animate-float">
            <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M11.982 0C5.366 0 0 5.368 0 11.982c0 6.616 5.366 11.984 11.982 11.984 6.618 0 11.984-5.368 11.984-11.984C23.966 5.368 18.6 0 11.982 0zm4.568 17.146l-1.058-5.04 2.752-1.99a.34.34 0 00.1-.47.33.33 0 00-.46-.08l-2.75 1.99-3.08-2.26c-.32-.54-1-.66-1.5-.28l-1.88 1.36c-.52.36-.64 1.12-.14 1.66l3.52 5.38c.42.64 1.3.72 1.82.16l1.88-1.36c.44-.32.56-.96.14-1.46l-2.94-4.5 1.28 5.98c.1.54.58.96 1.14.96.66 0 1.18-.54 1.08-1.22z"/></svg>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white tracking-tight">
              <span className="gradient-text">CS2BD</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Bangladesh&apos;s #1 CS2 skins marketplace. Verified sellers, manual payment verification, and full dispute protection.
            </p>
          </div>

          <div className="space-y-4 text-left">
            {[
              { icon: '🔒', text: 'Steam-secured authentication — no passwords to forget' },
              { icon: '⚡', text: 'One-click sign in with your Steam account' },
              { icon: '🇧🇩', text: 'bKash & Nagad payments, BDT pricing' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-lg flex-shrink-0">{f.icon}</span>
                <span className="text-xs text-slate-400 leading-relaxed">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]/40" />
              Active Listings
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ff6a00]/40" />
              Verified Sellers
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#4ade80]/40" />
              BDT Pricing
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-8">
        <Suspense fallback={
          <div className="w-full max-w-md space-y-6">
            <div className="skeleton h-10 w-48 mx-auto rounded-lg" />
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-12 w-full rounded-xl" />
          </div>
        }>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}

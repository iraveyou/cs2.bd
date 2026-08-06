import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="mx-auto w-16 h-16 rounded-full bg-[#ff3d81]/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-[#ff3d81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L2.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-3xl font-extrabold text-slate-100">Access Denied</h1>
      <p className="text-slate-400 text-sm leading-relaxed">
        You don&apos;t have permission to view this page. If you believe this is a mistake, contact support or switch to an account with the required role.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link href="/" className="btn btn-ghost text-sm">Go Home</Link>
        <Link href="/auth/signin" className="btn btn-primary text-sm">Sign In</Link>
      </div>
    </div>
  );
}

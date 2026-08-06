'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShoppingBag, Home, PlusCircle, ShieldCheck, User, Package } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const role: string | null = (session as any)?.role || (session as any)?.user?.role || null;
  const isSeller = role === 'SELLER' || role === 'ADMIN';

  const sellHref = isSeller ? '/seller/dashboard' : '/auth/signup';
  const profileHref = isLoggedIn ? '/buyer/profile' : '/auth/signin';
  const ordersHref = '/buyer/dashboard';

  const navItems = [
    { label: 'Home', href: '/', icon: Home, highlight: false },
    { label: 'Market', href: '/marketplace', icon: ShoppingBag, highlight: false },
    { label: 'Sell', href: sellHref, icon: PlusCircle, highlight: true },
    { label: 'Orders', href: ordersHref, icon: ShieldCheck, highlight: false },
    { label: 'Profile', href: profileHref, icon: User, highlight: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-t border-[#27272a] px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-[#22c55e] text-[#09090b] flex items-center justify-center shadow-lg shadow-[#22c55e]/20 group-active:scale-95 transition-transform">
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-[#22c55e] mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 text-center transition-colors active:scale-95 ${
                isActive ? 'text-[#22c55e]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

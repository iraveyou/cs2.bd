'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Notif {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  createdAt: string;
}

export default function NotificationBar() {
  const { data: session } = useSession();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session) return;
    async function load() {
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) return;
        const data = await res.json();
        if (data.ok) setNotifs(data.notifications || []);
      } catch {}
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session || notifs.length === 0) return null;

  const visible = notifs.filter((n) => !dismissed.has(n.id));
  if (visible.length === 0) return null;

  const latest = visible[0];
  const hasMore = visible.length > 1;

  const typeColors: Record<string, string> = {
    order: 'border-[#ff6a00]/40 bg-[#ff6a00]/5',
    payment: 'border-[#22c55e]/40 bg-[#22c55e]/5',
    seller: 'border-[#a855f7]/40 bg-[#a855f7]/5',
    delivery: 'border-[#3b82f6]/40 bg-[#3b82f6]/5',
    system: 'border-[#666]/40 bg-[#666]/5',
  };

  const typeIcons: Record<string, string> = {
    order: '🛒',
    payment: '💰',
    seller: '🏪',
    delivery: '📦',
    system: '📢',
  };

  return (
    <div className="sticky top-16 z-40">
      <div
        onClick={() => setExpanded(!expanded)}
        className={`cursor-pointer border-b ${typeColors[latest.type] || typeColors.system} transition-all`}
      >
        {/* Compact bar */}
        <div className="container max-w-6xl mx-auto px-4 py-2 flex items-center gap-3 text-sm">
          <span className="text-base flex-shrink-0">{typeIcons[latest.type] || '📢'}</span>
          <span className="font-semibold text-slate-200 flex-shrink-0">{latest.title}</span>
          <span className="text-slate-400 truncate hidden sm:block">{latest.message}</span>
          {latest.link && (
            <Link href={latest.link} onClick={(e) => e.stopPropagation()} className="text-xs text-[#22c55e] font-bold hover:underline flex-shrink-0 ml-auto">
              View →
            </Link>
          )}
          {hasMore && (
            <span className="text-xs text-slate-500 bg-black/20 px-2 py-0.5 rounded-full flex-shrink-0">
              +{visible.length - 1} more
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDismissed((d) => new Set([...d, latest.id]));
            }}
            className="text-slate-500 hover:text-slate-300 text-xs flex-shrink-0 ml-1"
          >
            ✕
          </button>
        </div>

        {/* Expanded list */}
        {expanded && visible.length > 1 && (
          <div className="container max-w-6xl mx-auto px-4 pb-3 space-y-1.5">
            {visible.slice(1).map((n) => (
              <div key={n.id} className={`flex items-center gap-3 p-2 rounded-lg text-xs ${typeColors[n.type] || typeColors.system}`}>
                <span>{typeIcons[n.type] || '📢'}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-slate-200">{n.title}</span>
                  <span className="text-slate-400 ml-2 hidden sm:inline">{n.message}</span>
                </div>
                {n.link && <Link href={n.link} onClick={(e) => e.stopPropagation()} className="text-[#22c55e] font-bold hover:underline flex-shrink-0">View →</Link>}
                <button onClick={(e) => { e.stopPropagation(); setDismissed((d) => new Set([...d, n.id])); }}
                  className="text-slate-500 hover:text-slate-300 flex-shrink-0">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Notif {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const typeConfig: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  order:    { icon: '🛒', color: '#ff6a00', bg: 'rgba(255,106,0,0.08)',  border: 'rgba(255,106,0,0.25)' },
  payment:  { icon: '💰', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)' },
  seller:   { icon: '🏪', color: '#a855f7', bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.25)' },
  delivery: { icon: '📦', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)' },
  system:   { icon: '📢', color: '#a1a1aa', bg: 'rgba(161,161,170,0.08)', border: 'rgba(161,161,170,0.25)' },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-BD', { month: 'short', day: 'numeric' });
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!session) return;
    try {
      setError(null);
      const res = await fetch('/api/notifications?limit=20');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      if (data.ok) {
        setNotifs(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      setError('Could not load notifications');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, [session, fetchNotifications]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleMarkRead(id: string) {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark-read', id }),
    });
  }

  async function handleDismiss(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    const wasUnread = !notifs.find((n) => n.id === id)?.isRead;
    setNotifs((prev) => prev.filter((n) => n.id !== id));
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
  }

  async function handleMarkAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark-all-read' }),
    });
  }

  if (!session) return null;

  return (
    <div className="relative flex items-center">
      <button
        ref={bellRef}
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-xl border border-[#1c1c26] hover:border-[#22c55e]/40 hover:bg-white/[0.03] transition-all group"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-200 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[#22c55e] text-black text-[10px] font-extrabold rounded-full px-1 leading-none shadow-lg shadow-[#22c55e]/30">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50 animate-fade-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1c1c26]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {notifs.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-[#22c55e] hover:text-[#4ade80] font-semibold transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading && initialLoad ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-2 border-[#22c55e]/30 border-t-[#22c55e] rounded-full animate-spin" />
                <span className="text-xs text-slate-500">Loading notifications...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <span className="text-2xl">⚠️</span>
                <span className="text-xs text-slate-400">{error}</span>
              </div>
            ) : notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-12 h-12 rounded-full bg-[#22c55e]/5 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <span className="text-xs text-slate-500">No notifications yet</span>
                <span className="text-[10px] text-slate-600">We&apos;ll notify you about orders, payments, and updates</span>
              </div>
            ) : (
              <div className="py-1">
                {notifs.map((n) => {
                  const cfg = typeConfig[n.type] || typeConfig.system;
                  return (
                    <div key={n.id} className="group/n relative">
                      {n.link ? (
                        <Link
                          href={n.link}
                          onClick={() => { handleMarkRead(n.id); setOpen(false); }}
                          className={`flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors block ${!n.isRead ? 'bg-white/[0.02]' : ''}`}
                        >
                          <NotificationItem n={n} cfg={cfg} />
                        </Link>
                      ) : (
                        <div
                          onClick={() => handleMarkRead(n.id)}
                          className={`flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer ${!n.isRead ? 'bg-white/[0.02]' : ''}`}
                        >
                          <NotificationItem n={n} cfg={cfg} />
                        </div>
                      )}
                      {/* Unread dot */}
                      {!n.isRead && (
                        <span className="absolute left-[18px] top-[18px] w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-sm shadow-[#22c55e]/50" />
                      )}
                      {/* Dismiss */}
                      <button
                        onClick={(e) => handleDismiss(n.id, e)}
                        className="absolute top-2 right-3 p-1 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/5 opacity-0 group-hover/n:opacity-100 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div className="border-t border-[#1c1c26] px-4 py-2.5 flex items-center justify-between">
              <button
                onClick={async () => {
                  setNotifs([]);
                  setUnreadCount(0);
                  await fetch('/api/notifications?action=all', { method: 'DELETE' });
                  setOpen(false);
                }}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
              <Link
                href="/buyer/dashboard"
                onClick={() => setOpen(false)}
                className="text-xs text-[#22c55e] hover:text-[#4ade80] font-semibold transition-colors"
              >
                View all orders →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationItem({ n, cfg }: { n: Notif; cfg: typeof typeConfig.system }) {
  return (
    <>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
        style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
      >
        {cfg.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-slate-200 truncate">{n.title}</span>
          <span className="text-[10px] text-slate-600 flex-shrink-0 ml-auto">{timeAgo(n.createdAt)}</span>
        </div>
        <p className="text-[12px] text-slate-400 leading-relaxed mt-0.5 line-clamp-2">{n.message}</p>
        {n.link && (
          <span className="inline-block mt-1 text-[10px] text-[#22c55e] font-semibold">View details →</span>
        )}
      </div>
    </>
  );
}

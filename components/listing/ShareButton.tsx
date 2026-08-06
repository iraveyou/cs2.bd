'use client';
import { useState } from 'react';

interface ShareButtonProps {
  url: string;
  title: string;
  description: string;
}

export default function ShareButton({ url, title, description }: ShareButtonProps) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  const platforms = [
    {
      name: 'Copy Link',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      ),
      action: async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      color: '#666',
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      color: '#1877f2',
    },
    {
      name: 'Twitter/X',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      ),
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#1da1f2',
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.182-.988-.351-1.741-.748-2.879-2.515-2.969-2.632-.089-.117-.709-.94-.709-1.438 0-.497.262-.743.354-.848.091-.104.208-.13.279-.13.071 0 .143.005.208.005.066.003.156-.025.243.187.09.219.313.758.339.813.026.056.045.121.007.23-.039.11-.052.196-.118.3-.062.103-.13.233-.186.314-.052.078-.107.162-.046.276.061.115.282.464.601.749.42.368.773.48.909.539.135.06.214.05.292-.024.078-.075.34-.393.433-.633.093-.24.186-.21.313-.117.127.094.808.38.947.451.139.072.231.108.265.17.038.065.038.375-.106.78zM12.029 20.455h-.006c-1.287-.001-2.486-.375-3.527-1.02l-2.393.68.682-2.322c-.73-1.104-1.15-2.419-1.15-3.791.001-3.517 2.863-6.38 6.395-6.38 3.517 0 6.379 2.863 6.38 6.38 0 3.517-2.864 6.38-6.381 6.38z"/></svg>
      ),
      href: `https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`,
      color: '#25d366',
    },
    {
      name: 'Telegram',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.015 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.145.118.185.276.208.409.023.133.051.433.031.666z"/></svg>
      ),
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#26a5e4',
    },
    {
      name: 'Discord',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/></svg>
      ),
      href: `https://discord.com/channels/@me`,
      color: '#5865f2',
      action: async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#111118] border border-[#1c1c26] hover:border-[#22c55e]/40 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:text-[#22c55e] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Share
        {copied && <span className="text-xs text-[#22c55e] ml-1">Copied!</span>}
      </button>

      {show && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShow(false)} />
          <div className="absolute bottom-full right-0 mb-2 z-50 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-2 shadow-2xl shadow-black/60 animate-fade-in min-w-48">
            <div className="text-xs text-slate-500 px-3 py-1.5 font-semibold">Share this listing</div>
            <div className="flex flex-col gap-0.5">
              {platforms.map((p) => (
                p.action ? (
                  <button
                    key={p.name}
                    onClick={() => { p.action?.(); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors text-left"
                  >
                    <span style={{ color: p.color }}>{p.icon}</span>
                    {p.name}
                  </button>
                ) : (
                  <a
                    key={p.name}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShow(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                  >
                    <span style={{ color: p.color }}>{p.icon}</span>
                    {p.name}
                  </a>
                )
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Download, X, ShieldCheck } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('cs2bd PWA ServiceWorker registered with scope:', registration.scope);
          },
          (err) => {
            console.error('ServiceWorker registration failed:', err);
          }
        );
      });
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show prompt if user hasn't dismissed it in this session
      if (!sessionStorage.getItem('pwa_prompt_dismissed')) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-[#18181b] border border-[#22c55e]/40 p-4 rounded-xl shadow-2xl shadow-black/80 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center shrink-0 text-[#22c55e]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide">Install cs2bd App</h4>
          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
            Instant bKash trades & live skin alerts on your home screen.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-2 bg-[#22c55e] hover:bg-[#16a34a] active:scale-95 text-[#09090b] font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow-lg shadow-[#22c55e]/20 min-h-[40px]"
        >
          <Download className="w-3.5 h-3.5" />
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#27272a] transition min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

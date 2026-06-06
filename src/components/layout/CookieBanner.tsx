'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CookieBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('leanverse_cookie_consent');
    if (!hasAccepted) {
      // Delay showing slightly for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('leanverse_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (pathname?.startsWith('/admin')) return null;
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 no-print">
      <div className="max-w-5xl mx-auto glass shadow-2xl border border-emerald-500/30 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-foreground dark:text-muted flex-1">
          <p>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">We use cookies 🍪</span>
            <br className="sm:hidden" /> We use cookies to personalize content, provide social media features, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
            Read our <Link href="/privacy" className="underline hover:text-emerald-500">Privacy Policy</Link> for more information.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={() => setIsVisible(false)}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs bg-secondary/50 dark:bg-card/10 hover:bg-slate-300 dark:hover:bg-card/20 text-foreground transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg transition-transform active:scale-95"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}

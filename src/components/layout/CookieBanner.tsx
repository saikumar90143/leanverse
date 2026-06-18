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
      <div className="max-w-5xl mx-auto relative overflow-hidden glass bg-card/80 backdrop-blur-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] border border-emerald-500/30 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[30%] h-[200%] bg-cyan-500/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 text-sm text-foreground dark:text-muted flex-1">
          <p className="leading-relaxed">
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-base mb-1 inline-block">We use cookies 🍪</span>
            <br className="sm:hidden" /> We use cookies to personalize content, provide social media features, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
            Read our <Link href="/privacy" className="font-bold underline decoration-emerald-500/50 hover:decoration-emerald-500 hover:text-emerald-500 transition-colors">Privacy Policy</Link> for more information.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={() => setIsVisible(false)}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs bg-secondary/50 dark:bg-card/10 hover:bg-slate-300 dark:hover:bg-card/20 text-foreground transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}

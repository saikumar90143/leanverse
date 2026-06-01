'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useAuth } from '../layout/AuthProvider';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdContainerProps {
  slot?: string;
  format?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

export default function AdContainer({ slot = 'default', format = 'horizontal', className = '' }: AdContainerProps) {
  // Return different heights and shapes to satisfy CLS optimization and exact sizes
  const getFormatClasses = () => {
    switch (format) {
      case 'vertical':
        return 'w-[300px] h-[600px] max-w-full';
      case 'square':
        return 'w-[336px] h-[280px] max-w-full';
      case 'horizontal':
      default:
        return 'w-full h-[90px] max-h-[120px]';
    }
  };

  const { user } = useAuth();

  useEffect(() => {
    if (user?.tier === 'premium' || user?.tier === 'pro') return;
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [user?.tier]);

  // Premium users don't see ads
  if (user?.tier === 'premium' || user?.tier === 'pro') {
    return null;
  }

  return (
    <div className={`mx-auto my-6 flex flex-col items-center justify-center ${className} no-print`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1">
        Sponsored Advertisement
      </span>
      <div className={`relative flex flex-col items-center justify-center overflow-hidden ${getFormatClasses()}`}>
        {/* Real AdSense Component */}
        <ins 
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-0000000000000000'}
          data-ad-slot={slot}
          data-ad-format={format === 'horizontal' ? 'horizontal' : format === 'vertical' ? 'vertical' : 'rectangle'}
          data-full-width-responsive="true"
        />

        {/* Fallback styling for when ad is empty or blocked */}
        <div className="absolute inset-0 -z-10 glass border border-slate-200/10 rounded-2xl bg-slate-100/30 dark:bg-white/5 flex flex-col items-center justify-center text-center p-4">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Ad Space
          </span>
          <p className="text-[10px] text-slate-500 max-w-[250px] mt-1 leading-snug">
            Support LeanVerse by disabling your ad blocker.
          </p>
        </div>

        {/* Premium Upgrade Badge */}
        <Link 
          href="/pricing" 
          className="absolute bottom-1 right-2 text-[9px] text-slate-400 hover:text-emerald-500 underline font-semibold transition-all cursor-pointer z-20"
        >
          Remove Ads
        </Link>
      </div>
    </div>
  );
}

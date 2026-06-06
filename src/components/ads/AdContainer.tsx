'use client';

import React, { useEffect, useState } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  useEffect(() => {
    if (!isMounted) return;
    if (user?.tier === 'premium' || user?.tier === 'pro') return;
    
    const timeout = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          // Find if there is any 'ins' tag without 'data-adsbygoogle-status'
          const ads = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
          if (ads.length > 0) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }, 150);

    return () => clearTimeout(timeout);
  }, [user?.tier, isMounted]);

  // Premium users don't see ads
  if (user?.tier === 'premium' || user?.tier === 'pro') {
    return null;
  }

  // To prevent hydration mismatch, render a placeholder on the server and first client render
  if (!isMounted) {
    return (
      <div className={`mx-auto my-6 flex flex-col items-center justify-center ${className} no-print`}>
        <span className="text-[10px] uppercase tracking-wider text-muted font-extrabold mb-1 opacity-0">
          Sponsored Advertisement
        </span>
        <div className={`relative flex flex-col items-center justify-center overflow-hidden ${getFormatClasses()}`}>
          <div className="absolute inset-0 -z-10 glass border border-border/10 rounded-2xl bg-secondary/30 dark:bg-card/5 flex flex-col items-center justify-center text-center p-4">
            <span className="text-xs font-bold text-muted">
              Ad Space
            </span>
            <p className="text-[10px] text-muted max-w-[250px] mt-1 leading-snug">
              Support LeanVerse by disabling your ad blocker.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mx-auto my-6 flex flex-col items-center justify-center ${className} no-print`}>
      <span className="text-[10px] uppercase tracking-wider text-muted font-extrabold mb-1">
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
        <div className="absolute inset-0 -z-10 glass border border-border/10 rounded-2xl bg-secondary/30 dark:bg-card/5 flex flex-col items-center justify-center text-center p-4">
          <span className="text-xs font-bold text-muted">
            Ad Space
          </span>
          <p className="text-[10px] text-muted max-w-[250px] mt-1 leading-snug">
            Support LeanVerse by disabling your ad blocker.
          </p>
        </div>

        {/* Premium Upgrade Badge */}
        <Link 
          href="/pricing" 
          className="absolute bottom-1 right-2 text-[9px] text-muted hover:text-emerald-500 underline font-semibold transition-all cursor-pointer z-20"
        >
          Remove Ads
        </Link>
      </div>
    </div>
  );
}

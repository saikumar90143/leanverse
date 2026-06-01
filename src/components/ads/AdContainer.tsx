'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

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

  return (
    <div className={`mx-auto my-6 flex flex-col items-center justify-center ${className} no-print`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1">
        Sponsored Advertisement
      </span>
      <div className={`glass relative border border-slate-200/10 rounded-2xl flex flex-col items-center justify-center overflow-hidden bg-slate-100/30 dark:bg-white/5 ${getFormatClasses()}`}>
        {/* Mock AdSense Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            {format === 'horizontal' ? 'Get 30% Off Optimum Nutrition Whey Gold' : 'Build Muscle Fast'}
          </span>
          <p className="text-[10px] text-slate-500 max-w-[250px] mt-1 leading-snug">
            {format === 'horizontal' 
              ? 'Premium high-quality standard whey protein isolates.' 
              : 'Try the world\'s most popular creatine monohydrate today.'}
          </p>
          <Link
            href="/store"
            className="mt-2.5 flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white text-[10px] font-bold transition-all"
          >
            <span>Learn More</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>

        {/* Abstract background grids to look like a real dynamic ad */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-emerald-500 blur-xl" />
          <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-cyan-500 blur-xl" />
          <div className="w-full h-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
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

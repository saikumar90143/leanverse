'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, X } from 'lucide-react';
import { useQuickStart } from '@/hooks/useQuickStart';

export default function PremiumComparison() {
  const { handleQuickStart } = useQuickStart();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="glass p-8 rounded-3xl border border-border/50 dark:border-border text-center flex flex-col">
        <h3 className="text-2xl font-black text-foreground mb-2">Free Plan</h3>
        <p className="text-muted font-medium mb-8">Everything you need to get started.</p>
        <ul className="space-y-4 mb-8 flex-1 text-left">
          <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Basic AI Workout Planner</li>
          <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Free Fitness Calculators</li>
          <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Single Diet Generation</li>
          <li className="flex items-center gap-3 text-sm font-bold text-muted"><X className="w-5 h-5" /> Detailed Analytics</li>
          <li className="flex items-center gap-3 text-sm font-bold text-muted"><X className="w-5 h-5" /> Priority AI Coach</li>
        </ul>
        <button onClick={() => handleQuickStart()} className="w-full py-4 rounded-xl font-bold bg-foreground text-background cursor-pointer border border-foreground/20 hover:bg-foreground/10">Start Free</button>
      </div>

      <div className="glass p-8 rounded-3xl border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 text-center flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-bl-full blur-[30px]" />
        <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full absolute top-4 left-1/2 -translate-x-1/2">Recommended</span>
        
        <h3 className="text-2xl font-black text-emerald-500 mt-4 mb-2">Pro Access</h3>
        <p className="text-muted font-medium mb-8">Unlock maximum results.</p>
        <ul className="space-y-4 mb-8 flex-1 text-left">
          <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Advanced Phased AI Plans</li>
          <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Unlimited Regenerations</li>
          <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Interactive Progress Graphs</li>
          <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Detailed Exercise Analytics</li>
          <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Priority 24/7 AI Coach Access</li>
        </ul>
        <Link href="/pricing" className="w-full py-4 rounded-xl font-black bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/25 inline-block">Upgrade to Pro</Link>
      </div>
    </div>
  );
}

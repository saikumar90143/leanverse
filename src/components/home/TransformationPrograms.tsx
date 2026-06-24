'use client';

import React from 'react';
import { useQuickStart } from '@/hooks/useQuickStart';

export default function TransformationPrograms() {
  const { handleQuickStart } = useQuickStart();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { days: 30, title: 'Kickstarter', diff: 'Beginner', success: '94%' },
        { days: 60, title: 'Momentum', diff: 'Intermediate', success: '88%' },
        { days: 90, title: 'Transformation', diff: 'Advanced', success: '91%', highlight: true },
        { days: 120, title: 'Evolution', diff: 'Elite', success: '85%' }
      ].map(prog => (
        <div key={prog.days} className={`relative glass p-6 rounded-3xl border transition-all hover:-translate-y-2 flex flex-col ${prog.highlight ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10' : 'border-border/50 dark:border-border'}`}>
          {prog.highlight && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              Most Popular
            </span>
          )}
          <div className="text-center mb-6 pt-2">
            <h3 className="text-4xl font-black text-foreground">{prog.days} <span className="text-lg text-muted">Days</span></h3>
            <p className="text-sm font-bold text-muted mt-1">{prog.title}</p>
          </div>
          
          <div className="space-y-3 mb-8 flex-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted font-medium">Difficulty</span>
              <span className="font-bold text-foreground">{prog.diff}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted font-medium">Success Rate</span>
              <span className="font-bold text-emerald-500">{prog.success}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted font-medium">Structure</span>
              <span className="font-bold text-foreground">Phased</span>
            </div>
          </div>

          <button aria-label={`Start ${prog.days} day ${prog.title} program`} onClick={() => handleQuickStart({ 
            timelineDays: prog.days, 
            goal: 'muscle', 
            experience: prog.diff === 'Beginner' ? 'beginner' : prog.diff === 'Elite' ? 'advanced' : 'intermediate' 
          })} className={`w-full py-3 border border-border/20 dark:border-border rounded-xl font-bold text-sm transition-all ${prog.highlight ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg border-emerald-400/50 dark:border-emerald-500/50' : 'bg-secondary dark:bg-card/10 hover:bg-slate-300 dark:hover:bg-card/20 text-foreground'}`}>
            Start Program
          </button>
        </div>
      ))}
    </div>
  );
}

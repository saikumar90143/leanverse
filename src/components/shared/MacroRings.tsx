'use client';

import React from 'react';

interface MacroRingsProps {
  /** Eaten macros (actual consumed) */
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  /** Targets */
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  calsTarget: number;
}

interface RingProps {
  radius: number;
  strokeWidth: number;
  progress: number; // 0 to 1
  color: string;
  trailColor: string;
}

function Ring({ radius, strokeWidth, progress, color, trailColor }: RingProps) {
  const safeProgress = Math.min(1, Math.max(0, isFinite(progress) ? progress : 0));
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - safeProgress);

  return (
    <>
      {/* Trail */}
      <circle
        cx="50%"
        cy="50%"
        r={radius}
        fill="none"
        stroke={trailColor}
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx="50%"
        cy="50%"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </>
  );
}

/**
 * MacroRings — Three concentric animated SVG rings for Protein, Carbs, and Fats.
 * Safe: clamps progress to 0–1, handles NaN/Infinity.
 */
export default function MacroRings({
  protein, carbs, fats, calories,
  proteinTarget, carbsTarget, fatsTarget, calsTarget,
}: MacroRingsProps) {
  const proteinPct = proteinTarget > 0 ? protein / proteinTarget : 0;
  const carbsPct   = carbsTarget > 0   ? carbs   / carbsTarget   : 0;
  const fatsPct    = fatsTarget > 0    ? fats    / fatsTarget    : 0;
  const calsPct    = calsTarget > 0    ? calories / calsTarget   : 0;

  const overallPct = Math.round(Math.min(100, (isFinite(calsPct) ? calsPct : 0) * 100));

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-0">
          {/* Outer: Carbs (cyan) */}
          <Ring
            radius={45}
            strokeWidth={6}
            progress={carbsPct}
            color="#06b6d4"
            trailColor="rgba(6,182,212,0.12)"
          />
          {/* Middle: Protein (emerald) */}
          <Ring
            radius={36}
            strokeWidth={6}
            progress={proteinPct}
            color="#10b981"
            trailColor="rgba(16,185,129,0.12)"
          />
          {/* Inner: Fats (amber) */}
          <Ring
            radius={27}
            strokeWidth={6}
            progress={fatsPct}
            color="#f59e0b"
            trailColor="rgba(245,158,11,0.12)"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-black leading-none ${overallPct > 100 ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'}`}>
            {overallPct}%
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            {overallPct > 100 ? 'Over!' : 'eaten'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-4 text-[10px] font-bold">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
          <span className="text-slate-500">Protein {protein}g</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 block" />
          <span className="text-slate-500">Carbs {carbs}g</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
          <span className="text-slate-500">Fats {fats}g</span>
        </div>
      </div>
    </div>
  );
}

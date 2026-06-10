'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Flame, Trophy, Star } from 'lucide-react';
import { getUnseenMilestone, markMilestoneSeen, getStreak } from '@/lib/gamification';
import { getMilestoneMessage } from '@/lib/motivationEngine';

// Simple confetti burst using canvas
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#10b981', '#f59e0b', '#06b6d4', '#a855f7', '#f43f5e', '#fbbf24'];
    const pieces: { x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number; rotationSpeed: number }[] = [];

    for (let i = 0; i < 80; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.rotation += p.rotationSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (pieces.some(p => p.y < canvas.height + 20)) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl" />;
}

export default function StreakMilestonePopup() {
  const [milestone, setMilestone] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unseen = getUnseenMilestone();
    if (unseen !== null) {
      setMilestone(unseen);
      setStreak(getStreak());
      // Small delay for page load
      setTimeout(() => setVisible(true), 800);
    }
  }, []);

  const handleDismiss = () => {
    if (milestone !== null) {
      markMilestoneSeen(milestone);
    }
    setVisible(false);
  };

  if (!visible || milestone === null) return null;

  const message = getMilestoneMessage(streak);

  const milestoneEmoji =
    streak >= 365 ? '🏆' :
    streak >= 90  ? '⚡' :
    streak >= 30  ? '🥇' :
    streak >= 14  ? '💪' :
    streak >= 7   ? '🥈' :
    streak >= 3   ? '🥉' : '🏁';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm glass border border-emerald-500/30 rounded-3xl p-8 text-center shadow-2xl shadow-emerald-500/20 overflow-hidden">
        <ConfettiCanvas />

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 text-muted hover:text-foreground transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent -z-10" />

        {/* Big emoji */}
        <div className="relative z-10 text-7xl mb-4 animate-bounce">
          {milestoneEmoji}
        </div>

        {/* Title */}
        <div className="relative z-10 space-y-2 mb-6">
          <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">Milestone Unlocked!</p>
          <h2 className="text-3xl font-black text-foreground">
            🔥 {milestone}-Day Streak!
          </h2>
          <p className="text-sm text-muted font-bold leading-relaxed">{message}</p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-400 mx-auto mb-1" />
            <p className="text-xl font-black text-amber-500">{streak}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Day Streak</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3">
            <Star className="w-5 h-5 text-emerald-500 mx-auto mb-1 fill-emerald-400" />
            <p className="text-xl font-black text-emerald-500">+25</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">XP Earned</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleDismiss}
          className="relative z-10 w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/25 text-sm"
        >
          Keep the Streak Going! 💪
        </button>
      </div>
    </div>
  );
}

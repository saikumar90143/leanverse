'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/layout/AuthProvider';
import { UserSession } from '@/components/layout/AuthProvider';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GoogleSuccessPage() {
  const router = useRouter();
  const { loginWithSession } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionParam = params.get('session');

    if (!sessionParam) {
      router.replace('/login?error=no_session');
      return;
    }

    try {
      const decoded = JSON.parse(Buffer.from(sessionParam, 'base64').toString('utf-8'));
      const session = decoded as UserSession;
      loginWithSession(session);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#fbbf24'],
      });

      setTimeout(() => {
        router.replace('/dashboard');
      }, 1200);
    } catch {
      router.replace('/login?error=invalid_session');
    }
  }, [loginWithSession, router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
          <Sparkles className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl -z-10" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-black text-foreground mb-2">
          Google Sign-In Successful!
        </h1>
        <p className="text-muted text-sm">
          Setting up your session, redirecting to dashboard…
        </p>
      </div>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

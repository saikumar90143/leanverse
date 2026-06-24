'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/layout/AuthProvider';
import { Sparkles, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';


function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_auth_failed: 'Google sign-in was cancelled or failed. Please try again.',
  google_not_configured: 'Google OAuth is not configured yet. Please use email/password login.',
  token_exchange_failed: 'Failed to verify your Google account. Please try again.',
  userinfo_failed: 'Could not retrieve your Google profile. Please try again.',
  email_not_verified: 'Your Google email is not verified. Please verify it first.',
  server_error: 'A server error occurred during Google sign-in. Please try again.',
  no_session: 'Session data is missing. Please try signing in again.',
  invalid_session: 'Invalid session data. Please try signing in again.',
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, user } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Where to send user after login (defaults to /dashboard)
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Show Google OAuth error if redirected back with ?error=
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam && GOOGLE_ERROR_MESSAGES[errorParam]) {
      setError(GOOGLE_ERROR_MESSAGES[errorParam]);
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace(redirectTo);
    }
  }, [user, router, redirectTo]);

  const triggerConfetti = () => {
    import('canvas-confetti').then((confetti) => confetti.default({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#fbbf24'],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (activeTab === 'signin') {
      const success = await login(email, password);
      if (success) {
        triggerConfetti();
        setTimeout(() => router.push(redirectTo), 800);
      } else {
        setError('Invalid email or password.');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your name.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      const success = await register(name, email, password);
      if (success) {
        triggerConfetti();
        setTimeout(() => router.push(redirectTo), 800);
      } else {
        setError('Failed to create account. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    // Pass redirect param through to Google OAuth callback
    const callbackRedirect = encodeURIComponent(redirectTo);
    window.location.href = `/api/auth/google?redirect=${callbackRedirect}`;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage('');
    setForgotLoading(true);
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setForgotMessage(data.error || 'Failed to send reset link.');
      } else {
        // Option A simulation
        setForgotMessage(`Reset Link Generated! For this sandbox demo, go to: ${data.resetUrl}`);
      }
    } catch (err) {
      setForgotMessage('An unexpected error occurred.');
    }
    setForgotLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] max-w-[100vw] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[80px] -z-10 pointer-events-none overflow-hidden" />

      <div className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl border border-border/20 dark:border-border">

        {/* Toggle Tabs */}
        <div className="grid grid-cols-2 bg-secondary/50 dark:bg-card/5 rounded-2xl p-1 mb-8 border border-border/15 dark:border-border">
          <button
            onClick={() => { setActiveTab('signin'); setError(''); }}
            className={`py-3 text-sm font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-muted hover:text-foreground dark:text-muted dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setError(''); }}
            className={`py-3 text-sm font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-muted hover:text-foreground dark:text-muted dark:hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Brand Banner */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black tracking-wide text-foreground flex items-center justify-center">
            {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
            <Sparkles className="w-5 h-5 ml-1.5 text-emerald-400 animate-bounce" />
          </h2>
          <p className="text-xs text-muted mt-1">
            {activeTab === 'signin'
              ? 'Sign in to access your custom AI diet & workouts'
              : 'Join LeanVerse to kickstart your sustainable habits'}
          </p>
        </div>

        {/* Error Box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs font-semibold p-3.5 rounded-2xl flex items-start space-x-2 mb-6">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          id="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-border/40 dark:border-border bg-card/80 dark:bg-card/5 hover:bg-card dark:hover:bg-card/10 text-foreground text-sm font-bold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-[0.98] mb-5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-border border-t-emerald-500 rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          <span>{googleLoading ? 'Redirecting to Google…' : 'Continue with Google'}</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-secondary/40 dark:bg-card/10" />
          <span className="text-xs text-muted font-semibold">or continue with email</span>
          <div className="flex-1 h-px bg-secondary/40 dark:bg-card/10" />
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted block ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-2xl pl-10 pr-4 py-3 text-base sm:text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted block ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-2xl pl-10 pr-4 py-3 text-base sm:text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-bold text-muted block">Password</label>
              {activeTab === 'signin' && (
                <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-2xl pl-10 pr-4 py-3 text-base sm:text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted block ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-2xl pl-10 pr-4 py-3 text-base sm:text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold transition-all shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{activeTab === 'signin' ? 'Sign In' : 'Sign Up'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

       
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 dark:border-border animate-fade-in relative">
            <button onClick={() => setShowForgotModal(false)} className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors">
              <User className="w-5 h-5 hidden" /> {/* Placeholder icon to match import, using text 'X' below to avoid importing X icon if not present */}
              <span className="font-bold text-xl leading-none">&times;</span>
            </button>
            <h3 className="text-xl font-black text-foreground mb-2">Reset Password</h3>
            <p className="text-xs text-muted mb-6">Enter your email and we will generate a secure reset link.</p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted block ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-2xl pl-10 pr-4 py-3 text-base sm:text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {forgotMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold break-all">
                  {forgotMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-3 rounded-2xl bg-foreground text-background font-bold transition-transform active:scale-[0.98] disabled:opacity-60 flex items-center justify-center cursor-pointer hover:bg-muted"
              >
                {forgotLoading ? 'Generating...' : 'Generate Reset Link'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

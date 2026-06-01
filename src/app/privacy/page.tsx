import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Lock, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Return Link */}
      <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors mb-2 no-print">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to LeanVerse Home</span>
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">Legal & Compliance</span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
          Privacy Policy & Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Last updated: May 28, 2026. Review our structural user protection guidelines.</p>
      </div>

      {/* Content blocks */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/10 shadow-xl space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-350">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-200/10 pb-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <h2 className="text-base font-black text-slate-800 dark:text-slate-100">1. Data Storage & Privacy</h2>
          </div>
          <p className="font-semibold text-xs text-slate-500">
            LeanVerse takes your digital privacy seriously. When you record biometrics, calories, or weight logs on our User Dashboard, the parameters are saved securely in our cached MongoDB cloud nodes. We do not transmit or monetize individual biometric datasets to secondary medical groups or marketing conglomerates.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3" id="terms">
          <div className="flex items-center space-x-2 border-b border-slate-200/10 pb-2">
            <ShieldAlert className="w-4 h-4 text-cyan-500" />
            <h2 className="text-base font-black text-slate-800 dark:text-slate-100">2. Terms of Service & Disclaimer</h2>
          </div>
          <p className="font-semibold text-xs text-slate-500">
            All AI-generated diet plans, gym splits, macro allocations, and TDEE calorie estimates computed on the LeanVerse platform represent mathematical estimations. They are designed strictly as educational guidelines. They do not constitute formal medical diagnoses or clinical prescription regimes. Consult with a qualified physician or certified clinical dietitian before starting any restrictive dietary regimen or high-intensity athletic conditioning split.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-200/10 pb-2">
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <h2 className="text-base font-black text-slate-800 dark:text-slate-100">3. Cookies & Monetization</h2>
          </div>
          <p className="font-semibold text-xs text-slate-500">
            To provide a sustainable SaaS framework, LeanVerse incorporates optimized Google AdSense containers and affiliate sponsored links. We use standard browser cookies to save local light/dark theme preferences, active login credentials, and to display responsive, non-aggressive relevant sponsored items. You can manage or disable cookie tracking in your browser settings.
          </p>
        </section>

      </div>
    </div>
  );
}

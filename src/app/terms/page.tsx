import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | LeanVerse',
  description: 'Terms and Conditions for using LeanVerse.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors mb-8">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="glass rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200/20 dark:border-white/10">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight">Terms of Service</h1>
        </div>

        <div className="prose dark:prose-invert prose-emerald max-w-none space-y-6 text-slate-600 dark:text-slate-300">
          <p className="font-bold text-sm text-slate-500 uppercase tracking-widest">Last Updated: June 2026</p>
          
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using LeanVerse (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">2. Provision of Service</h2>
          <p>
            LeanVerse reserves the right to modify, suspend, or discontinue the Service with or without notice at any time and without any liability to you.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">3. User Accounts & Data</h2>
          <p>
            You are responsible for maintaining the confidentiality of any local data or accounts. Much of LeanVerse's data is stored locally on your device 
            using LocalStorage. Clearing your browser data may result in the permanent loss of your workout logs and progress.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">4. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by LeanVerse and are protected by international copyright, 
            trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">5. Disclaimer of Warranties</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind.
          </p>
        </div>
      </div>
    </div>
  );
}

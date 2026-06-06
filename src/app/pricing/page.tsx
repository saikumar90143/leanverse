'use client';

import React, { useState } from 'react';
import { Check, ShieldCheck, Sparkles, Flame, Apple, Dumbbell } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const handleSubscribe = (tier: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    alert(`Subscribing to LeanVerse ${tier} (${billingPeriod}) plan! Demo Sandbox checkout successful.`);
  };

  const plans = [
    {
      name: 'Free Squad',
      priceMonthly: 0,
      priceAnnual: 0,
      desc: 'Essential biometrics and habit calculations.',
      features: [
        'Standard BMI & BMR calculations',
        'Basic AI Diet Planner (3 schedules/mo)',
        'Basic AI Workout splits (2 splits/mo)',
        'Standard Blog & CMS catalog access',
        'Supported by Sponsored Ads',
      ],
      cta: 'Start Free Training',
      popular: false,
    },
    {
      name: 'Lean Pro',
      priceMonthly: 19,
      priceAnnual: 12, // equivalent
      desc: 'Unlimited diet, gym splits and progressive logs.',
      features: [
        'Unlimited AI Diet Blueprints',
        'Unlimited AI Workout split maps',
        'Interactive Water & Calorie Dashboard loggers',
        'Unlimited print-to-PDF downloads',
        'Full AI Fitness Chatbot assistant access',
        '100% Ad-Free UI Experience',
      ],
      cta: 'Upgrade to Lean Pro',
      popular: true,
    },
    {
      name: 'Elite Coach',
      priceMonthly: 39,
      priceAnnual: 27,
      desc: 'Premium biometric monitoring and analytics.',
      features: [
        'Everything in Lean Pro',
        'Weight-loss predictive analysis',
        'Before/After slider image hosting',
        'Exclusive premium weekly recipe booklets',
        'Priority admin coaching desk contact',
        'Milestone badges & referrals unlocks',
      ],
      cta: 'Unlock Elite Access',
      popular: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">Subscription Tiers</span>
        <h1 className="text-3xl font-black text-foreground flex items-center justify-center">
          LeanVerse Membership Plans
          <ShieldCheck className="w-5.5 h-5.5 ml-1.5 text-emerald-500 animate-pulse" />
        </h1>
        <p className="text-xs text-muted">Choose a plan that fits your athletic goals. Save up to 35% with our annual billing options.</p>
      </div>

      {/* Monthly / Annual Toggle */}
      <div className="flex justify-center items-center space-x-3 mb-10 no-print">
        <span className={`text-xs font-bold ${billingPeriod === 'monthly' ? 'text-foreground dark:text-slate-150' : 'text-muted'}`}>Monthly</span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
          className="w-14 h-7 rounded-full bg-secondary dark:bg-card/10 p-1 flex items-center transition-all cursor-pointer relative"
        >
          <div 
            className={`w-5 h-5 rounded-full bg-emerald-500 shadow-md transition-all ${
              billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-0'
            }`} 
          />
        </button>
        <span className={`text-xs font-bold flex items-center ${billingPeriod === 'annual' ? 'text-foreground dark:text-slate-150' : 'text-muted'}`}>
          Annual Billing
          <span className="ml-1.5 text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md border border-emerald-500/25">
            Save 35%
          </span>
        </span>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch print-card">
        {plans.map((p) => {
          const currentPrice = billingPeriod === 'monthly' ? p.priceMonthly : p.priceAnnual;
          return (
            <div 
              key={p.name} 
              className={`glass rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                p.popular 
                  ? 'border-emerald-500/40 shadow-emerald-500/5 -translate-y-1' 
                  : 'border-border/10'
              }`}
            >
              {p.popular && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl -z-10" />
              )}
              
              {p.popular && (
                <span className="absolute top-4 right-4 text-[9px] font-black uppercase bg-emerald-500 text-white px-2.5 py-1 rounded-full flex items-center shadow-md">
                  <Sparkles className="w-3 h-3 fill-current mr-0.5" /> Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-foreground">{p.name}</h3>
                  <p className="text-xs text-muted leading-tight mt-1">{p.desc}</p>
                </div>

                <div className="flex items-baseline space-x-1.5 py-4 border-t border-b border-border/10">
                  <span className="text-4xl sm:text-5xl font-black text-slate-850 dark:text-slate-150">${currentPrice}</span>
                  <span className="text-xs text-muted font-bold">/ {billingPeriod === 'monthly' ? 'month' : 'month, billed annually'}</span>
                </div>

                {/* Features checklist */}
                <ul className="space-y-3.5 text-xs text-slate-650 dark:text-slate-350">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="font-semibold">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 no-print">
                <button
                  onClick={() => handleSubscribe(p.name)}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 active:scale-97 ${
                    p.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-emerald-500/10'
                      : 'bg-secondary/50 hover:bg-secondary dark:bg-card/5 dark:hover:bg-card/10 text-foreground border border-slate-350/15'
                  }`}
                >
                  <span>{p.cta}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

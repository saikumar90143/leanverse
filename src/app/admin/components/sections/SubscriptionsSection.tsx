'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Users, RefreshCw } from 'lucide-react';

export default function SubscriptionsSection() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/subscriptions')
      .then(r => r.json())
      .then(data => {
        if (data.plans) setPlans(data.plans);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRevenue = plans.reduce((a, b) => a + (b.revenue || 0), 0);
  const totalSubscribers = plans.reduce((a, b) => a + (b.subscribers || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Subscribers', value: totalSubscribers.toLocaleString(), icon: Users, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: CreditCard, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Avg Churn Rate', value: `${(plans.reduce((a, b) => a + b.churn, 0) / plans.length).toFixed(1)}%`, icon: RefreshCw, color: 'text-rose-500 bg-rose-500/10' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-slate-200/10 dark:border-white/5 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold">{s.label}</p>
              <p className="text-xl font-black text-slate-800 dark:text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {plans.map((plan) => (
          <div key={plan.name} className="glass rounded-2xl p-6 border border-slate-200/10 dark:border-white/5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-slate-800 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400">Per {plan.interval || 'month'}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-emerald-500">₹{(plan.price || plan.monthlyPrice || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Subscribers', value: (plan.subscribers || 0).toLocaleString(), color: 'text-slate-700 dark:text-zinc-200' },
                { label: 'Revenue', value: `₹${((plan.revenue || 0) / 100000).toFixed(1)}L`, color: 'text-emerald-500' },
                { label: 'Churn Rate', value: `${plan.churn || 0}%`, color: (plan.churn || 0) < 3 ? 'text-emerald-500' : 'text-rose-500' },
                { label: 'Conversion', value: `${plan.conversion || 0}%`, color: 'text-cyan-500' },
              ].map(m => (
                <div key={m.label} className="bg-slate-100/50 dark:bg-white/3 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400">{m.label}</p>
                  <p className={`font-black text-sm ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>

            <div className="h-1.5 bg-slate-200/40 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${totalSubscribers ? ((plan.subscribers || 0) / totalSubscribers) * 100 : 0}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 text-right">{totalSubscribers ? (((plan.subscribers || 0) / totalSubscribers) * 100).toFixed(1) : 0}% of all subscribers</p>
          </div>
        ))}
      </div>
    </div>
  );
}

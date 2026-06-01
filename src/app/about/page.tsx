'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, Shield, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AboutContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setName('');
      setEmail('');
      setMsg('');
      confetti({
        particleCount: 40,
        spread: 30,
      });
      alert('Your message was successfully compiled and dispatched to our admin support desk!');
    }, 1000);
  };

  const values = [
    { title: 'Scientific Integrity', desc: 'Every calculator metric and macronutrient allocation corresponds strictly with established clinical nutritional studies.', icon: Shield },
    { title: 'AI Personalized', desc: 'We bypass generic recommendations. Our diet and workoutsplits adapt dynamically to your available foods and home gym gear.', icon: Award },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Pitch Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">About LeanVerse</span>
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          We Democratize Healthy Lifestyles
        </h1>
        <p className="text-xs text-slate-500">LeanVerse was founded by a specialized consortium of sports researchers and software engineers to deliver premium metabolic algorithms for everyone.</p>
      </div>

      {/* Grid: Inquiry Form & Values info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Inquiry Form */}
        <div className="lg:col-span-7 glass rounded-3xl p-6 sm:p-8 border border-slate-200/10 shadow-xl space-y-6">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block border-b border-slate-200/10 pb-3">Submit An Inquiry</span>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase block ml-1">Message Description</label>
              <textarea
                placeholder="What can we support you with today?"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
                rows={4}
                className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-md transition-all active:scale-97 flex items-center justify-center space-x-1 cursor-pointer text-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>{sending ? 'Sending...' : 'Dispatch Message'}</span>
            </button>
          </form>
        </div>

        {/* Corporate contact Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-3xl p-6 border border-slate-200/10 space-y-6">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block border-b border-slate-200/10 pb-3">Corporate Desk Info</span>
            
            <div className="space-y-4 text-xs font-bold text-slate-600 dark:text-slate-350">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>support@leanverse.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-cyan-500 shrink-0" />
                <span>+1 (800) 555-LEAN</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                <span>Silicon Valley, San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Company Core Values */}
          <div className="space-y-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block ml-1">Our Core Pillars</span>
            <div className="grid grid-cols-1 gap-4">
              {values.map((v) => (
                <div key={v.title} className="glass p-5 rounded-2xl border border-slate-200/10 flex items-start space-x-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
                    <v.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs">{v.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-semibold">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

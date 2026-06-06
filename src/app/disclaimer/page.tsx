import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Medical Disclaimer | LeanVerse',
  description: 'Health and Fitness Medical Disclaimer for LeanVerse.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-muted hover:text-emerald-500 transition-colors mb-8">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="glass rounded-3xl p-8 sm:p-12 shadow-2xl border border-border/20 dark:border-border">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">Medical Disclaimer</h1>
        </div>

        <div className="prose dark:prose-invert prose-emerald max-w-none space-y-6 text-muted">
          <p className="font-bold text-sm text-muted uppercase tracking-widest">Last Updated: June 2026</p>
          
          <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl text-rose-800 dark:text-rose-200 font-medium my-8">
            The information provided by LeanVerse, including but not limited to workout plans, diet plans, and calculators, is for educational and informational purposes only and does not constitute medical advice.
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Not a Substitute for Professional Advice</h2>
          <p>
            The content on this website is not intended to be a substitute for professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <p>
            Never disregard professional medical advice or delay in seeking it because of something you have read on LeanVerse.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Assumption of Risk</h2>
          <p>
            Physical exercise, fitness, weight loss, and alterations to your diet carry inherent risks of injury or illness. By using our tools, calculators, and AI-generated workout plans, you acknowledge and agree that you do so entirely at your own risk. LeanVerse and its creators are not liable for any injuries, damages, or health complications that may arise from utilizing the information on this site.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Accuracy of Information</h2>
          <p>
            While we strive to provide accurate mathematical calculations (e.g., TDEE, Body Fat %), these are theoretical estimates based on standard clinical formulas. Actual metabolic rates and physiological responses vary drastically per individual.
          </p>
        </div>
      </div>
    </div>
  );
}

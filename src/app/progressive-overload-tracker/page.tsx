import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LineChart, Trophy, ArrowUpRight, CheckCircle, ArrowRight } from 'lucide-react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Progressive Overload Tracker & PR Logger | LeanVerse',
  description: 'Log your Personal Records (PRs) and guarantee muscle growth with the best progressive overload tracker available online.',
  keywords: ['Progressive Overload Tracker', 'Personal Records', 'PR Logger', 'Strength Tracker', 'Muscle Gain'],
  openGraph: {
    title: 'Progressive Overload Tracker & PR Logger | LeanVerse',
    description: 'Log your Personal Records (PRs) and guarantee muscle growth with the best progressive overload tracker.',
    url: 'https://leanverse.vercel.app/progressive-overload-tracker',
  }
};

export default function ProgressiveOverloadPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a Progressive Overload Tracker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A progressive overload tracker records your lifting history over time, visually graphing your weight increases so you can ensure you are constantly challenging your muscles to grow."
        }
      },
      {
        "@type": "Question",
        "name": "How do I track Personal Records (PRs)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LeanVerse includes a dedicated PR logging section where you can record your maximum lifts (1RM) for major exercises like Bench Press, Squat, and Deadlift."
        }
      }
    ]
  };

  return (
    <>
      <Script 
        id="faq-schema-overload"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 font-bold text-sm">
                <LineChart className="w-4 h-4" />
                <span>Data-Driven Gains</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
                The Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Progressive Overload Tracker</span>
              </h1>
              <p className="text-lg md:text-xl text-muted leading-relaxed max-w-xl">
                If you aren't tracking, you aren't growing. Use LeanVerse to chart your Personal Records (PRs) and guarantee continuous strength progression.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/personal-records" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-orange-500/25 transition-all text-center flex justify-center items-center gap-2">
                  Log Your PRs Now <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[600px] w-full z-10 no-print">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-rose-500/20 rounded-3xl blur-2xl" />
              <Image 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop"
                alt="Athlete tracking progressive overload"
                fill
                priority={true}
                className="object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-foreground">Science-Backed Muscle Growth</h2>
              <p className="text-muted max-w-2xl mx-auto">Progressive overload is the only guaranteed mechanism for hypertrophy. Let our software chart your path to strength.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: LineChart, title: 'Visual Progression', desc: 'Beautiful charts map out your historical performance so you can visually see your strength increases.' },
                { icon: Trophy, title: 'Personal Records', desc: 'Log your 1RM, 3RM, or 5RM for any compound lift and celebrate your ultimate gym milestones.' },
                { icon: ArrowUpRight, title: 'Auto-Adjustment', desc: 'The app analyzes your progressive overload tracker data to automatically suggest heavier weights for your next session.' }
              ].map((feature, i) => (
                <div key={i} className="glass p-8 rounded-3xl border border-border/10 hover:border-orange-500/30 transition-all group">
                  <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-foreground">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq, i) => (
                <div key={i} className="glass p-6 rounded-2xl border border-border/10">
                  <h3 className="text-lg font-black text-foreground mb-2">{faq.name}</h3>
                  <p className="text-muted leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Dumbbell, Target, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Free AI Workout Tracker & Gym Log | LeanVerse',
  description: 'Track workouts, monitor progressive overload, and generate custom gym plans with LeanVerse, the ultimate AI workout tracker.',
  keywords: ['Workout Tracker', 'Gym Log', 'Custom Gym Plans', 'Progressive Overload', 'Fitness App'],
  openGraph: {
    title: 'Free AI Workout Tracker & Gym Log | LeanVerse',
    description: 'Track workouts, monitor progressive overload, and generate custom gym plans with the ultimate AI workout tracker.',
    url: 'https://leanverse.vercel.app/workout-tracker',
  }
};

export default function WorkoutTrackerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the best workout tracker app?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LeanVerse is considered one of the best workout trackers because it uses AI to generate custom gym plans and automatically tracks your progressive overload."
        }
      },
      {
        "@type": "Question",
        "name": "How do I track progressive overload?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can track progressive overload by logging your sets, reps, and weights each session. A good workout tracker like LeanVerse will chart this data to ensure you are lifting heavier over time."
        }
      }
    ]
  };

  return (
    <>
      <Script 
        id="faq-schema-workout"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-sm">
                <Target className="w-4 h-4" />
                <span>#1 AI Workout Tracker</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
                The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">Workout Tracker</span>
              </h1>
              <p className="text-lg md:text-xl text-muted leading-relaxed max-w-xl">
                Log your gym sessions, track progressive overload, and generate custom gym plans instantly. LeanVerse is the smart way to build muscle and burn fat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/workout-planner" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all text-center flex justify-center items-center gap-2">
                  Start Tracking Free <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[600px] w-full z-10 no-print">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
              <Image 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"
                alt="Man using workout tracker app in gym"
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
              <h2 className="text-3xl md:text-4xl font-black text-foreground">Why Use a Digital Gym Log?</h2>
              <p className="text-muted max-w-2xl mx-auto">Ditch the notebook. Our AI-driven workout tracker calculates your 1RM, tracks volume, and adjusts your custom gym plans dynamically.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Dumbbell, title: 'Custom Gym Plans', desc: 'AI generates personalized workout splits based on your goals, schedule, and available equipment.' },
                { icon: TrendingUp, title: 'Progressive Overload', desc: 'Visual charts show your strength gains over time, ensuring you are constantly applying progressive overload.' },
                { icon: CheckCircle, title: 'Smart Logging', desc: 'Log sets, reps, and RPE with a single tap. The interface is designed for speed while resting between sets.' }
              ].map((feature, i) => (
                <div key={i} className="glass p-8 rounded-3xl border border-border/10 hover:border-emerald-500/30 transition-all group">
                  <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Apple, PieChart, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Free Food Tracker & Macro Calculator | LeanVerse',
  description: 'Log meals, track macros, and calculate your calories with our AI-powered food tracker designed for Indian and Global diets.',
  keywords: ['Food Tracker', 'Calorie Calculator', 'Macro Breakdown', 'Diet Log', 'Fitness Nutrition'],
  openGraph: {
    title: 'Free Food Tracker & Macro Calculator | LeanVerse',
    description: 'Log meals, track macros, and calculate your calories with our AI-powered food tracker.',
    url: 'https://leanverse.vercel.app/food-tracker',
  }
};

export default function FoodTrackerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the food tracker calculate macros?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LeanVerse uses an extensive database to provide an accurate macro breakdown of proteins, fats, and carbohydrates based on your portion sizes."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use it as a Calorie Calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! The food tracker acts as a powerful calorie calculator, summing up your daily intake and comparing it against your TDEE goals for fat loss or muscle gain."
        }
      }
    ]
  };

  return (
    <>
      <Script 
        id="faq-schema-food"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 font-bold text-sm">
                <Apple className="w-4 h-4" />
                <span>Smart Nutrition Logging</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
                The Most Accurate <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Food Tracker</span>
              </h1>
              <p className="text-lg md:text-xl text-muted leading-relaxed max-w-xl">
                Log every meal effortlessly. From an automatic calorie calculator to detailed macro breakdowns, we make tracking your diet easier than ever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/diet-planner" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-cyan-500/25 transition-all text-center flex justify-center items-center gap-2">
                  Calculate Calories Now <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[600px] w-full z-10 no-print">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
              <Image 
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop"
                alt="Healthy food meal prep"
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
              <h2 className="text-3xl md:text-4xl font-black text-foreground">Beyond Basic Calorie Counting</h2>
              <p className="text-muted max-w-2xl mx-auto">Discover the exact nutritional profile of your meals with our advanced macro breakdown tools.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: PieChart, title: 'Macro Breakdown', desc: 'Instantly view your split of proteins, carbs, and fats to ensure you are hitting your dietary targets.' },
                { icon: Activity, title: 'Calorie Calculator', desc: 'Automatically tally up your daily energy intake and compare it against your maintenance calories.' },
                { icon: CheckCircle, title: 'Global Database', desc: 'Search thousands of foods, including complex Indian dishes, to get precise tracking data.' }
              ].map((feature, i) => (
                <div key={i} className="glass p-8 rounded-3xl border border-border/10 hover:border-cyan-500/30 transition-all group">
                  <div className="w-14 h-14 bg-cyan-500/10 text-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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

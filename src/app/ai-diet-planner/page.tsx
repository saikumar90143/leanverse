import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Bot, Calculator, Flame, CheckCircle, ArrowRight } from 'lucide-react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'AI Diet Planner & TDEE Calculator | LeanVerse',
  description: 'Generate customized diet plans instantly with our AI Diet Planner. Calculate your TDEE and BMR accurately for perfect fat loss or muscle gain.',
  keywords: ['AI Diet Planner', 'TDEE Calculator', 'BMR Calculator', 'Custom Meal Plans', 'AI Nutrition'],
  openGraph: {
    title: 'AI Diet Planner & TDEE Calculator | LeanVerse',
    description: 'Generate customized diet plans instantly with our AI Diet Planner.',
    url: 'https://leanverse.vercel.app/ai-diet-planner',
  }
};

export default function AIDietPlannerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the AI Diet Planner work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The AI Diet Planner analyzes your body metrics, goals, and dietary preferences to instantly generate a full week of highly customized meals, perfectly balancing your macros."
        }
      },
      {
        "@type": "Question",
        "name": "What is a TDEE Calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A TDEE (Total Daily Energy Expenditure) calculator estimates how many calories you burn per day. Our AI uses this data to adjust your diet plan for either a calorie deficit (fat loss) or surplus (muscle gain)."
        }
      }
    ]
  };

  return (
    <>
      <Script 
        id="faq-schema-ai-diet"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 font-bold text-sm">
                <Bot className="w-4 h-4" />
                <span>Next-Gen AI Nutrition</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
                Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">AI Diet Planner</span>
              </h1>
              <p className="text-lg md:text-xl text-muted leading-relaxed max-w-xl">
                Stop guessing what to eat. Combine our advanced TDEE Calculator with AI to instantly generate meal plans designed for your exact body composition and goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/diet-planner" className="px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-violet-500/25 transition-all text-center flex justify-center items-center gap-2">
                  Generate My Diet Plan <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[600px] w-full z-10 no-print">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur-2xl" />
              <Image 
                src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=1300&auto=format&fit=crop"
                alt="AI generating diet plans"
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
              <h2 className="text-3xl md:text-4xl font-black text-foreground">Smarter Meal Planning</h2>
              <p className="text-muted max-w-2xl mx-auto">Let algorithms do the heavy lifting of macro balancing and recipe generation.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Calculator, title: 'TDEE Calculator', desc: 'Get an ultra-precise read on your daily energy expenditure based on activity levels.' },
                { icon: Bot, title: 'AI Diet Planner', desc: 'Generates fully customized, day-by-day meal plans adhering to your specific caloric needs.' },
                { icon: Flame, title: 'BMR Optimization', desc: 'Factors in your Basal Metabolic Rate to ensure your fat loss or bulking journey is sustainable.' }
              ].map((feature, i) => (
                <div key={i} className="glass p-8 rounded-3xl border border-border/10 hover:border-violet-500/30 transition-all group">
                  <div className="w-14 h-14 bg-violet-500/10 text-violet-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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

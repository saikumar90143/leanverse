'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, RefreshCw, X, ExternalLink, Sparkles, Check, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Product {
  name: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  affiliateLink: string;
  imageUrl: string;
  tags: string[];
}

export default function SupplementStorePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const staticProducts: Product[] = [
    {
      name: 'Optimum Nutrition Gold Standard Whey',
      category: 'Supplements',
      description: 'The world\'s best-selling whey protein powder. Delivering 24g of high-quality premium whey isolates to build muscle and support recovery.',
      price: 59.99,
      rating: 4.8,
      affiliateLink: 'https://amazon.com',
      imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400&q=80',
      tags: ['Best for Beginners', 'High Protein', 'Muscle Recovery'],
    },
    {
      name: 'Creapure Micronized Creatine Monohydrate',
      category: 'Supplements',
      description: '100% pure Creapure premium micronized creatine monohydrate. Increases athletic power, explosive force, and cellular muscular endurance.',
      price: 24.99,
      rating: 4.9,
      affiliateLink: 'https://amazon.com',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80',
      tags: ['High Quality', 'Strength Builder'],
    },
    {
      name: 'ActiveFit Smart Watch Pro v5',
      category: 'Trackers',
      description: 'Advanced dynamic biometric sensor tracking. Real-time heart rate, calorie burn calculations, sleep mapping, and integrated training assistant.',
      price: 189.00,
      rating: 4.6,
      affiliateLink: 'https://amazon.com',
      imageUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400&q=80',
      tags: ['Smart Tracker', 'Heart Monitor'],
    },
    {
      name: 'LeanVerse Smart Bluetooth Body Fat Scale',
      category: 'Accessories',
      description: 'Syncs with your phone to instantly calculate BMI, body fat %, muscle mass, hydration index, bone density, and visceral fat percentages.',
      price: 34.99,
      rating: 4.7,
      affiliateLink: 'https://amazon.com',
      imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80',
      tags: ['Best Seller', 'Weight Tracker'],
    },
    {
      name: 'Heavy Duty Latex Resistance Bands Set',
      category: 'Accessories',
      description: 'Complete workout kit featuring 5 color-coded resistance tubes, foam handles, ankle straps, and standard door anchors. Ideal for home workouts.',
      price: 19.99,
      rating: 4.5,
      affiliateLink: 'https://amazon.com',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80',
      tags: ['Home Gym', 'Portability'],
    },
  ];

  const handleToggleCompare = (prod: Product) => {
    setCompareList((prev) => {
      const exists = prev.some((item) => item.name === prod.name);
      if (exists) {
        return prev.filter((item) => item.name !== prod.name);
      } else {
        if (prev.length >= 3) {
          alert('You can compare at most 3 products at a time.');
          return prev;
        }
        return [...prev, prod];
      }
    });
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const filteredProducts = staticProducts.filter((p) => {
    return selectedCategory === 'all' || p.category === selectedCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 relative">
      {/* Banner */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest block">Affiliate fitness Closet</span>
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center justify-center">
          LeanVerse Gear Store
          <ShoppingBag className="w-5.5 h-5.5 ml-1.5 text-emerald-500 animate-bounce" />
        </h1>
        <p className="text-xs text-slate-500">Discover premium muscle supplements, smart fitness tracking watches, and home gym gear recommended by LeanVerse AI.</p>
      </div>

      {/* Category controls and compare shelf reminder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/10 pb-6">
        <div className="flex space-x-2">
          {['all', 'Supplements', 'Trackers', 'Accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-white/5 hover:text-slate-700 dark:hover:text-slate-255'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        {compareList.length > 0 && (
          <div className="flex items-center space-x-3.5 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl text-xs font-black animate-pulse">
            <span className="text-emerald-500">{compareList.length} / 3 Items Selected</span>
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Compare Specs
            </button>
            <button onClick={handleClearCompare} className="text-slate-400 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Product Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const isComparing = compareList.some((item) => item.name === p.name);
          return (
            <div key={p.name} className="glass rounded-3xl overflow-hidden border border-slate-200/10 shadow-lg flex flex-col justify-between glow-card relative">
              
              {/* Product Visual */}
              <div className="relative w-full h-48 overflow-hidden bg-slate-900 flex items-center justify-center p-6">
                <Image 
                  src={p.imageUrl} 
                  alt={p.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain hover:scale-105 transition-transform duration-500 opacity-90"
                />
                
                {/* tags */}
                {p.tags.slice(0, 1).map((t) => (
                  <span key={t} className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider bg-slate-900/80 text-white px-2 py-0.5 rounded-md backdrop-blur-sm border border-emerald-500/30">
                    {t}
                  </span>
                ))}
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">{p.category}</span>
                    <div className="flex items-center text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                      <span>{p.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm leading-snug">{p.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{p.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/10 flex justify-between items-center">
                  <span className="text-xl font-black text-slate-800 dark:text-slate-100">${p.price}</span>
                  <div className="flex items-center space-x-2">
                    {/* Compare selector button */}
                    <button
                      onClick={() => handleToggleCompare(p)}
                      className={`p-2 rounded-xl border transition-all text-xs font-bold flex items-center justify-center cursor-pointer ${
                        isComparing
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500'
                          : 'border-slate-300/10 bg-slate-200/50 dark:bg-white/5 text-slate-500 hover:text-cyan-500'
                      }`}
                      title="Compare product details"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    {/* Affiliate Buy button */}
                    <Link
                      href={p.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center text-xs space-x-1"
                    >
                      <span>Buy Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compare Modal details */}
      {compareModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto animate-fade-in relative">
            <button
              onClick={() => setCompareModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center">
              Product Specifications Comparison
              <Sparkles className="w-5 h-5 ml-1.5 text-emerald-400 animate-pulse" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {compareList.map((p) => (
                <div key={p.name} className="p-4 bg-slate-200/20 dark:bg-white/5 rounded-2xl border border-slate-350/5 space-y-4">
                  <div className="relative h-28 w-full p-2 bg-slate-900/40 rounded-xl overflow-hidden">
                    <Image src={p.imageUrl} alt={p.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-2" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">{p.name}</h4>
                    <span className="text-[10px] uppercase text-emerald-500 font-extrabold block mt-0.5">{p.category}</span>
                  </div>

                  <div className="space-y-2 border-t border-slate-200/10 pt-3 text-xs font-semibold text-slate-600 dark:text-slate-350">
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-black text-slate-800 dark:text-slate-100">${p.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="font-black text-amber-500 flex items-center">
                        <Star className="w-3.5 h-3.5 fill-current mr-0.5" /> {p.rating}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200/10 text-[11px] leading-relaxed">
                      {p.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

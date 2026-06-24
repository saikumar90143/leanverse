'use client';

import React from 'react';

export default function ReviewButton() {
  return (
    <button 
      onClick={() => alert('Review system coming soon! Thanks for wanting to share your journey.')} 
      className="w-full py-3.5 border-2 border-dashed border-emerald-500/30 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-2xl hover:bg-emerald-500/5 transition-all text-sm mt-4"
    >
      + Share Your Journey
    </button>
  );
}

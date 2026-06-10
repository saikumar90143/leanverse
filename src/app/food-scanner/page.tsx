import React from 'react';
import AIFoodScanner from '@/components/shared/AIFoodScanner';

export const metadata = {
  title: 'AI Food Scanner | LeanVerse',
  description: 'Instantly recognize food items and calculate macros from a simple photo.',
};

export default function FoodScannerPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black mb-2 text-foreground">AI Macro Lens</h1>
          <p className="text-muted text-sm max-w-lg mx-auto">
            Our vision AI can identify complex Indian and international meals. Just take a picture to automatically log your macros.
          </p>
        </div>
        
        <AIFoodScanner />
      </div>
    </div>
  );
}

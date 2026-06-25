import React from 'react';
import AIFoodScanner from '@/components/shared/AIFoodScanner';

export const metadata = {
  title: 'AI Food Scanner | LeanVerse',
  description: 'Instantly recognize food items and calculate macros from a simple photo.',
};

export default function FoodScannerPage() {
  return (
    <div className="min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
       
        
        <AIFoodScanner />
      </div>
    </div>
  );
}

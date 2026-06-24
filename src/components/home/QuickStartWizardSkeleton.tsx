import React from 'react';

export default function QuickStartWizardSkeleton() {
  return (
    <div className="lg:col-span-6 relative animate-pulse">
      <div className="relative z-10 glass bg-card/60 backdrop-blur-3xl border border-border/50 dark:border-border rounded-3xl p-6 shadow-2xl">
        
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6 border-b border-border/50 dark:border-border pb-4">
          <div className="h-6 w-48 bg-muted/20 rounded-md"></div>
          <div className="h-5 w-16 bg-muted/20 rounded-md"></div>
        </div>

        {/* Mode Toggle Skeleton */}
        <div className="flex p-1 rounded-xl mb-6 border border-border/50 dark:border-border">
          <div className="flex-1 h-10 bg-muted/20 rounded-lg mx-1"></div>
          <div className="flex-1 h-10 bg-muted/20 rounded-lg mx-1"></div>
        </div>

        <div className="space-y-5">
          {/* Goal Skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-24 bg-muted/20 rounded mb-2"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="h-12 bg-muted/20 rounded-xl"></div>
              <div className="h-12 bg-muted/20 rounded-xl"></div>
            </div>
          </div>

          {/* Location Skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-32 bg-muted/20 rounded mb-2"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-12 bg-muted/20 rounded-xl"></div>
              <div className="h-12 bg-muted/20 rounded-xl"></div>
            </div>
          </div>

          {/* Timeline Skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-20 bg-muted/20 rounded mb-2"></div>
            <div className="h-12 w-full bg-muted/20 rounded-xl"></div>
          </div>

          {/* Button Skeleton */}
          <div className="w-full mt-4 h-14 bg-muted/20 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

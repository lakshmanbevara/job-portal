import React from 'react';

const Loader = ({ fullPage, skeleton, count = 3 }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          {/* Pulsing, spinning custom gradient spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin"></div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (skeleton) {
    return (
      <div className="space-y-4 w-full">
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index} 
            className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl smooth-shadow space-y-4"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl skeleton-shimmer bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded-md skeleton-shimmer bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-3 w-1/4 rounded-md skeleton-shimmer bg-slate-200 dark:bg-slate-700"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded-md skeleton-shimmer bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-3 w-5/6 rounded-md skeleton-shimmer bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="flex space-x-2 pt-2">
              <div className="h-6 w-20 rounded-full skeleton-shimmer bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-6 w-24 rounded-full skeleton-shimmer bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Basic inline spinner
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-primary animate-spin"></div>
    </div>
  );
};

export default Loader;

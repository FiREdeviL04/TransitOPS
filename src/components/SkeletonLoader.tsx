import React from 'react';

interface SkeletonLoaderProps {
  type: 'card' | 'table' | 'dashboard' | 'chart' | 'form';
  key?: React.Key;
}

export default function SkeletonLoader({ type }: SkeletonLoaderProps) {
  const shimmerClass = "animate-pulse bg-slate-200 dark:bg-slate-700 rounded";

  if (type === 'card') {
    return (
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs h-32 flex flex-col justify-between">
        <div className="flex justify-between items-start w-full">
          <div className="space-y-2 w-2/3">
            <div className={`h-3 w-16 ${shimmerClass}`}></div>
            <div className={`h-6 w-24 ${shimmerClass}`}></div>
          </div>
          <div className={`w-9 h-9 rounded-lg ${shimmerClass}`}></div>
        </div>
        <div className={`h-3.5 w-3/4 ${shimmerClass}`}></div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs h-64 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <div className={`h-3 w-32 ${shimmerClass}`}></div>
            <div className={`h-2.5 w-20 ${shimmerClass}`}></div>
          </div>
          <div className={`h-5 w-12 ${shimmerClass}`}></div>
        </div>
        <div className="flex-1 flex items-end justify-between space-x-4 px-2 pb-2">
          <div className={`w-12 h-1/4 ${shimmerClass}`}></div>
          <div className={`w-12 h-2/3 ${shimmerClass}`}></div>
          <div className={`w-12 h-1/2 ${shimmerClass}`}></div>
          <div className={`w-12 h-5/6 ${shimmerClass}`}></div>
          <div className={`w-12 h-1/3 ${shimmerClass}`}></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className={`h-4 w-40 ${shimmerClass}`}></div>
          <div className={`h-6 w-20 ${shimmerClass}`}></div>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
              <div className="flex items-center space-x-3 w-1/4">
                <div className={`w-8 h-8 rounded-full ${shimmerClass}`}></div>
                <div className="space-y-1 flex-1">
                  <div className={`h-3 w-3/4 ${shimmerClass}`}></div>
                  <div className={`h-2.5 w-1/2 ${shimmerClass}`}></div>
                </div>
              </div>
              <div className={`h-3 w-20 ${shimmerClass}`}></div>
              <div className={`h-3 w-16 ${shimmerClass}`}></div>
              <div className={`h-4 w-16 rounded-full ${shimmerClass}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((field) => (
          <div key={field} className="space-y-2">
            <div className={`h-3.5 w-24 ${shimmerClass}`}></div>
            <div className={`h-9 w-full ${shimmerClass}`}></div>
          </div>
        ))}
        <div className="flex justify-end space-x-2 pt-2">
          <div className={`h-8 w-16 ${shimmerClass}`}></div>
          <div className={`h-8 w-24 ${shimmerClass}`}></div>
        </div>
      </div>
    );
  }

  // Dashboard skeleton layout
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonLoader key={i} type="card" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <SkeletonLoader type="chart" />
        </div>
        <div>
          <SkeletonLoader type="card" />
        </div>
      </div>
      <SkeletonLoader type="table" />
    </div>
  );
}

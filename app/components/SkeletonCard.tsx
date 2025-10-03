'use client';

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 animate-pulse">
      {/* Status Badge Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-20 bg-surface-hover rounded-full"></div>
        <div className="h-4 w-16 bg-surface-hover rounded"></div>
      </div>

      {/* Question Skeleton */}
      <div className="mb-4">
        <div className="h-5 bg-surface-hover rounded mb-2"></div>
        <div className="h-5 bg-surface-hover rounded w-3/4"></div>
      </div>

      {/* Odds Bar Skeleton */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="h-4 w-16 bg-surface-hover rounded"></div>
          <div className="h-4 w-16 bg-surface-hover rounded"></div>
        </div>
        <div className="h-2 bg-surface-hover rounded-full"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="h-4 w-20 bg-surface-hover rounded"></div>
        <div className="h-4 w-16 bg-surface-hover rounded"></div>
      </div>

      {/* Buttons Skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 bg-surface-hover rounded-md"></div>
        <div className="h-10 bg-surface-hover rounded-md"></div>
      </div>
    </div>
  );
}
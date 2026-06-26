import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-lg bg-line dark:bg-white/10',
        className
      )}
    />
  );
}

export function CampaignCardSkeleton() {
  return (
    <div className="rounded-card overflow-hidden border border-line dark:border-white/10">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-5 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-2 w-full mt-3" />
      </div>
    </div>
  );
}

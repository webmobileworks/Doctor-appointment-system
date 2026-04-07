import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn("relative overflow-hidden rounded-lg bg-muted", className)}>
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-background/60 to-transparent animate-shimmer" />
  </div>
);

export const DoctorCardSkeleton = () => (
  <div className="glass-card p-5 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
    <Skeleton className="h-10 w-full rounded-xl" />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-6">
      <Skeleton className="w-24 h-24 rounded-2xl" />
      <div className="space-y-3 flex-1">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
    <Skeleton className="h-40 w-full rounded-2xl" />
  </div>
);

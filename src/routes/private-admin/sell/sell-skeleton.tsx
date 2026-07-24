import { Skeleton } from "@/components/ui/skeleton";

export default function SellSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <div className="rounded-md border p-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-full mb-2" />
      </div>
    </div>
  );
}

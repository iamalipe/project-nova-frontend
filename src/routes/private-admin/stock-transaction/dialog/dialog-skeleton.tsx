import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DialogSkeleton() {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-h-[80vh] sm:max-w-[600px] animate-pulse">
        <DialogHeader>
          <DialogTitle>
            <Skeleton className="h-6 w-32" />
          </DialogTitle>
          <DialogDescription>
            <Skeleton className="h-4 w-full mt-2" />
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

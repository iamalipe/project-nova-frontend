import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DialogSkeleton = () => {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-h-[80vh] sm:max-w-[600px] animate-pulse">
        <DialogHeader>
          <DialogTitle>
            <Skeleton className="h-6 w-32" />
          </DialogTitle>
          <DialogDescription>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-5/6 mt-1" />
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSkeleton;

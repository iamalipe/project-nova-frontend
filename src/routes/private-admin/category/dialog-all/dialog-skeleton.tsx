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
      <DialogContent className="flex flex-col sm:max-h-[80vh] sm:max-w-[1200px] animate-pulse">
        <DialogHeader className="flex-none">
          <DialogTitle>
            <Skeleton className="h-6 w-44" />
          </DialogTitle>
          <DialogDescription>
            <Skeleton className="h-4 w-full mt-2" />
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col gap-4 py-4 overflow-hidden">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSkeleton;

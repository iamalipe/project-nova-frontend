import FormSkeleton from "@/components/form/form-skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const DialogSkeleton = () => {
  return (
    <>
      <Dialog open={true}>
        <DialogContent
          className="sm:max-w-[600px] sm:max-h-[80vh] px-2 md:px-4 sm:px-6"
          aria-live="polite"
          aria-busy="true"
        >
          <DialogHeader>
            <DialogTitle>
              <Skeleton className="h-10 w-[50%]" aria-hidden="true" />
            </DialogTitle>
            <Skeleton className="h-20 w-[80%]" aria-hidden="true" />
          </DialogHeader>
          <div
            className="grid gap-2 md:gap-4"
            role="status"
            aria-label="Loading form content"
          >
            <FormSkeleton />
            <FormSkeleton />
            <FormSkeleton />
            <FormSkeleton />
          </div>
          <DialogFooter>
            <Skeleton className="h-10 w-40" aria-hidden="true" />
            <Skeleton className="h-10 w-40" aria-hidden="true" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogSkeleton;

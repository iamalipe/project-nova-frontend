import { Skeleton } from "@/components/ui/skeleton";
import { cn, getRandomInt } from "@/lib/utils";
import { useMemo } from "react";

const _randomWidth = [
  `w-[20%]`,
  `w-[25%]`,
  `w-[30%]`,
  `w-[35%]`,
  `w-[40%]`,
  `w-[45%]`,
  `w-[50%]`,
  `w-[55%]`,
  `w-[60%]`,
];
interface FormSkeletonProps {
  /** Number of skeleton field blocks to render. Defaults to 1. */
  count?: number;
}

const FormSkeletonField = () => {
  const randomWidth = useMemo(
    () => _randomWidth[getRandomInt(0, _randomWidth.length - 1)],
    []
  );
  return (
    <div
      className="flex flex-col gap-1"
      role="status"
      aria-label="Loading form field"
    >
      <Skeleton className={cn(["h-4", randomWidth])} aria-hidden="true" />
      <Skeleton className="h-10 w-full" aria-hidden="true" />
    </div>
  );
};

const FormSkeleton = ({ count = 1 }: FormSkeletonProps = {}) => {
  if (count <= 1) return <FormSkeletonField />;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <FormSkeletonField key={index} />
      ))}
    </>
  );
};

export default FormSkeleton;

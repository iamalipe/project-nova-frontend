import { useMemo } from "react";

type QueryState = {
  isLoading?: boolean;
  isFetching?: boolean;
  isPending?: boolean;
};

export const useQueryLoadingState = (queries: QueryState[]) => {
  const isLoading = useMemo(() => {
    return queries.some((q) => q.isLoading);
  }, [queries]);
  const isFetching = useMemo(() => {
    return queries.some((q) => q.isFetching);
  }, [queries]);
  const isPending = useMemo(() => {
    return queries.some((q) => q.isPending);
  }, [queries]);

  return {
    isLoading,
    isFetching,
    isPending,
  };
};

export default useQueryLoadingState;

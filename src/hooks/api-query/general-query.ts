import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query";

import { sleep } from "@/lib/utils";

export const generalQueryKey = ["general"];

type SleepParams = {
  ms?: number;
  payload?: unknown;
};

const emulateApiCall = async ({ ms = 800, payload }: SleepParams) => {
  await sleep(ms);
  return {
    ok: true,
    delayedMs: ms,
    payload: payload ?? null,
    timestamp: Date.now(),
  } as const;
};

const getEmulatedOptions = (params?: SleepParams) =>
  queryOptions({
    queryKey: [...generalQueryKey, params ?? {}],
    queryFn: () => emulateApiCall(params ?? {}),
    staleTime: 0,
    gcTime: 0,
  });

export const generalQuery = (queryClient: QueryClient) => ({
  emulateOptions: getEmulatedOptions,
  emulate: (params?: SleepParams) =>
    queryClient.fetchQuery(getEmulatedOptions(params)),
  useEmulate: (params?: SleepParams) => useQuery(getEmulatedOptions(params)),
});

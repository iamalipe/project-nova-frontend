import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query";

import api from "@/api/api";

export const currentUserQueryKey = ["current-user"];
const getCurrentUserOptions = () =>
  queryOptions({
    queryKey: [...currentUserQueryKey],
    queryFn: () => api.auth.me(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

// Create a function that returns the authQuery object with the provided queryClient
export const authQuery = (queryClient: QueryClient) => ({
  getCurrentUserOptions: getCurrentUserOptions,
  getCurrentUser: () => queryClient.fetchQuery(getCurrentUserOptions()),
  useGetCurrentUser: () => useQuery(getCurrentUserOptions()),

  logoutUser: async () => {
    const result = await api.auth.logout();
    // Drop all cached data instead of invalidating it: invalidating would
    // trigger refetches for every mounted query right as we log out, and
    // those would just fail auth before the redirect happens.
    queryClient.clear();
    return result;
  },
});

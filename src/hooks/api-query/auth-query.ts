import { QueryClient, queryOptions, useQuery, useMutation } from "@tanstack/react-query";

import api from "@/api/api";
import { type CurrentUser, type ChangePasswordPayload } from "@/api/auth-api";

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

  useUpdateProfile: () =>
    useMutation({
      mutationFn: (data: Partial<CurrentUser>) => api.auth.updateProfile(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
      },
    }),

  useUpdateProfileImage: () =>
    useMutation({
      mutationFn: (formData: FormData) => api.auth.updateProfileImage(formData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
      },
    }),

  updateProfile: async (data: Partial<CurrentUser>) => {
    const result = await api.auth.updateProfile(data);
    queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    return result;
  },

  useChangePassword: () =>
    useMutation({
      mutationFn: (data: ChangePasswordPayload) => api.auth.changePassword(data),
    }),

  useGetSessions: () =>
    useQuery({
      queryKey: ["user-sessions"],
      queryFn: () => api.auth.getSessions(),
    }),

  useDeleteSession: () =>
    useMutation({
      mutationFn: (id: string) => api.auth.deleteSession(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
      },
    }),
});

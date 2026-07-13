import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import api from "@/api/api";
import {
  type ApiUserGetAllParams,
} from "@/api/user-api";
import { QueryClient } from "@tanstack/react-query";

export const userQueryKey = ["user"];

const getAllOptions = (params?: ApiUserGetAllParams) =>
  queryOptions({
    queryKey: [...userQueryKey, params],
    queryFn: () => api.user.getAll(params),
    placeholderData: keepPreviousData,
  });

const getOptions = (id: string) =>
  queryOptions({
    queryKey: [...userQueryKey, id],
    queryFn: () => api.user.get(id),
  });

export const userQuery = (queryClient: QueryClient) => ({
  // getAll
  getAllOptions,
  getAll: (params?: ApiUserGetAllParams) =>
    queryClient.fetchQuery(getAllOptions(params)),
  useGetAll: (params?: ApiUserGetAllParams) =>
    useQuery(getAllOptions(params)),

  // get
  getOptions,
  get: (id: string) => queryClient.fetchQuery(getOptions(id)),
  useGet: (id: string) => useQuery(getOptions(id)),

  // delete
  useDelete: () =>
    useMutation({
      mutationFn: (id: string) => api.user.delete(id),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: userQueryKey }),
    }),
  delete: async (id: string) => {
    const result = await api.user.delete(id);
    queryClient.invalidateQueries({ queryKey: userQueryKey });
    return result;
  },

  // delete many
  useDeleteMany: () =>
    useMutation({
      mutationFn: (ids: string[]) => api.user.deleteMany(ids),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: userQueryKey }),
    }),
  deleteMany: async (ids: string[]) => {
    const result = await api.user.deleteMany(ids);
    queryClient.invalidateQueries({ queryKey: userQueryKey });
    return result;
  },
});

import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  type QueryClient,
} from "@tanstack/react-query";
import api from "@/api/api";
import type {
  ApiStoreCreate,
  ApiStoreGetAllParams,
  ApiStoreUpdate,
} from "@/api/store-api";

export const storeQueryKey = ["store"];

const getAllOptions = (params?: ApiStoreGetAllParams) =>
  queryOptions({
    queryKey: [...storeQueryKey, params],
    queryFn: () => api.store.getAll(params),
    placeholderData: keepPreviousData,
  });

const getOptions = (id: string) =>
  queryOptions({
    queryKey: [...storeQueryKey, id],
    queryFn: () => api.store.get(id),
  });

export const storeQuery = (queryClient: QueryClient) => ({
  getAllOptions,
  getAll: (params?: ApiStoreGetAllParams) =>
    queryClient.fetchQuery(getAllOptions(params)),
  useGetAll: (params?: ApiStoreGetAllParams) =>
    useQuery(getAllOptions(params)),

  getOptions,
  get: (id: string) => queryClient.fetchQuery(getOptions(id)),
  useGet: (id: string) => useQuery(getOptions(id)),

  useCreate: () =>
    useMutation({
      mutationFn: (data: ApiStoreCreate) => api.store.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: storeQueryKey });
      },
    }),
  create: (data: ApiStoreCreate) => api.store.create(data),

  useCreateMany: () =>
    useMutation({
      mutationFn: (data: ApiStoreCreate[]) => api.store.createMany(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: storeQueryKey });
      },
    }),
  createMany: (data: ApiStoreCreate[]) => api.store.createMany(data),

  useUpdate: () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: ApiStoreUpdate }) =>
        api.store.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: storeQueryKey });
      },
    }),
  update: ({ id, data }: { id: string; data: ApiStoreUpdate }) =>
    api.store.update(id, data),

  useDelete: () =>
    useMutation({
      mutationFn: (id: string) => api.store.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: storeQueryKey });
      },
    }),
  delete: (id: string) => api.store.delete(id),

  useDeleteMany: () =>
    useMutation({
      mutationFn: (ids: string[]) => api.store.deleteMany(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: storeQueryKey });
      },
    }),
  deleteMany: (ids: string[]) => api.store.deleteMany(ids),
});

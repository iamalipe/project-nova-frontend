import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  type QueryClient,
} from "@tanstack/react-query";
import api from "@/api/api";
import type {
  ApiSellCreate,
  ApiSellGetAllParams,
  ApiSellUpdate,
} from "@/api/sell-api";

export const sellQueryKey = ["sell"];

const getAllOptions = (params?: ApiSellGetAllParams) =>
  queryOptions({
    queryKey: [...sellQueryKey, params],
    queryFn: () => api.sell.getAll(params),
    placeholderData: keepPreviousData,
  });

const getOptions = (id: string) =>
  queryOptions({
    queryKey: [...sellQueryKey, id],
    queryFn: () => api.sell.get(id),
  });

export const sellQuery = (queryClient: QueryClient) => ({
  getAllOptions,
  getAll: (params?: ApiSellGetAllParams) =>
    queryClient.fetchQuery(getAllOptions(params)),
  useGetAll: (params?: ApiSellGetAllParams) =>
    useQuery(getAllOptions(params)),

  getOptions,
  get: (id: string) => queryClient.fetchQuery(getOptions(id)),
  useGet: (id: string) => useQuery(getOptions(id)),

  useCreate: () =>
    useMutation({
      mutationFn: (data: ApiSellCreate) => api.sell.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: sellQueryKey });
      },
    }),
  create: (data: ApiSellCreate) => api.sell.create(data),

  useCreateMany: () =>
    useMutation({
      mutationFn: (data: ApiSellCreate[]) => api.sell.createMany(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: sellQueryKey });
      },
    }),
  createMany: (data: ApiSellCreate[]) => api.sell.createMany(data),

  useUpdate: () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: ApiSellUpdate }) =>
        api.sell.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: sellQueryKey });
      },
    }),
  update: ({ id, data }: { id: string; data: ApiSellUpdate }) =>
    api.sell.update(id, data),

  useDelete: () =>
    useMutation({
      mutationFn: (id: string) => api.sell.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: sellQueryKey });
      },
    }),
  delete: (id: string) => api.sell.delete(id),

  useDeleteMany: () =>
    useMutation({
      mutationFn: (ids: string[]) => api.sell.deleteMany(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: sellQueryKey });
      },
    }),
  deleteMany: (ids: string[]) => api.sell.deleteMany(ids),
});

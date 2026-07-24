import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  type QueryClient,
} from "@tanstack/react-query";
import api from "@/api/api";
import type {
  ApiStockCreate,
  ApiStockGetAllParams,
  ApiStockUpdate,
} from "@/api/stock-api";

export const stockQueryKey = ["stock"];

const getAllOptions = (params?: ApiStockGetAllParams) =>
  queryOptions({
    queryKey: [...stockQueryKey, params],
    queryFn: () => api.stock.getAll(params),
    placeholderData: keepPreviousData,
  });

const getOptions = (id: string) =>
  queryOptions({
    queryKey: [...stockQueryKey, id],
    queryFn: () => api.stock.get(id),
  });

export const stockQuery = (queryClient: QueryClient) => ({
  getAllOptions,
  getAll: (params?: ApiStockGetAllParams) =>
    queryClient.fetchQuery(getAllOptions(params)),
  useGetAll: (params?: ApiStockGetAllParams) =>
    useQuery(getAllOptions(params)),

  getOptions,
  get: (id: string) => queryClient.fetchQuery(getOptions(id)),
  useGet: (id: string) => useQuery(getOptions(id)),

  useCreate: () =>
    useMutation({
      mutationFn: (data: ApiStockCreate) => api.stock.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: stockQueryKey });
      },
    }),
  create: (data: ApiStockCreate) => api.stock.create(data),

  useCreateMany: () =>
    useMutation({
      mutationFn: (data: ApiStockCreate[]) => api.stock.createMany(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: stockQueryKey });
      },
    }),
  createMany: (data: ApiStockCreate[]) => api.stock.createMany(data),

  useUpdate: () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: ApiStockUpdate }) =>
        api.stock.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: stockQueryKey });
      },
    }),
  update: ({ id, data }: { id: string; data: ApiStockUpdate }) =>
    api.stock.update(id, data),

  useDelete: () =>
    useMutation({
      mutationFn: (id: string) => api.stock.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: stockQueryKey });
      },
    }),
  delete: (id: string) => api.stock.delete(id),

  useDeleteMany: () =>
    useMutation({
      mutationFn: (ids: string[]) => api.stock.deleteMany(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: stockQueryKey });
      },
    }),
  deleteMany: (ids: string[]) => api.stock.deleteMany(ids),
});

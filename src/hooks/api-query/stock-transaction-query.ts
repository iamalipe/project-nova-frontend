import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  type QueryClient,
} from "@tanstack/react-query";
import api from "@/api/api";
import type {
  ApiStockTransactionCreate,
  ApiStockTransactionGetAllParams,
  ApiStockTransactionUpdate,
} from "@/api/stock-transaction-api";

export const stockTransactionQueryKey = ["stockTransaction"];

const getAllOptions = (params?: ApiStockTransactionGetAllParams) =>
  queryOptions({
    queryKey: [...stockTransactionQueryKey, params],
    queryFn: () => api.stockTransaction.getAll(params),
    placeholderData: keepPreviousData,
  });

const getOptions = (id: string) =>
  queryOptions({
    queryKey: [...stockTransactionQueryKey, id],
    queryFn: () => api.stockTransaction.get(id),
  });

export const stockTransactionQuery = (queryClient: QueryClient) => ({
  getAllOptions,
  getAll: (params?: ApiStockTransactionGetAllParams) =>
    queryClient.fetchQuery(getAllOptions(params)),
  useGetAll: (params?: ApiStockTransactionGetAllParams) =>
    useQuery(getAllOptions(params)),

  getOptions,
  get: (id: string) => queryClient.fetchQuery(getOptions(id)),
  useGet: (id: string) => useQuery(getOptions(id)),

  useCreate: () =>
    useMutation({
      mutationFn: (data: ApiStockTransactionCreate) => api.stockTransaction.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: stockTransactionQueryKey });
      },
    }),
  create: (data: ApiStockTransactionCreate) => api.stockTransaction.create(data),

  useCreateMany: () =>
    useMutation({
      mutationFn: (data: ApiStockTransactionCreate[]) => api.stockTransaction.createMany(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: stockTransactionQueryKey });
      },
    }),
  createMany: (data: ApiStockTransactionCreate[]) => api.stockTransaction.createMany(data),

  useUpdate: () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: ApiStockTransactionUpdate }) =>
        api.stockTransaction.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: stockTransactionQueryKey });
      },
    }),
  update: ({ id, data }: { id: string; data: ApiStockTransactionUpdate }) =>
    api.stockTransaction.update(id, data),

  useDelete: () =>
    useMutation({
      mutationFn: (id: string) => api.stockTransaction.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: stockTransactionQueryKey });
      },
    }),
  delete: (id: string) => api.stockTransaction.delete(id),

  useDeleteMany: () =>
    useMutation({
      mutationFn: (ids: string[]) => api.stockTransaction.deleteMany(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: stockTransactionQueryKey });
      },
    }),
  deleteMany: (ids: string[]) => api.stockTransaction.deleteMany(ids),
});

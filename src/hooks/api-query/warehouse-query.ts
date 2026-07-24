import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  type QueryClient,
} from "@tanstack/react-query";
import api from "@/api/api";
import type {
  ApiWarehouseCreate,
  ApiWarehouseGetAllParams,
  ApiWarehouseUpdate,
} from "@/api/warehouse-api";

export const warehouseQueryKey = ["warehouse"];

const getAllOptions = (params?: ApiWarehouseGetAllParams) =>
  queryOptions({
    queryKey: [...warehouseQueryKey, params],
    queryFn: () => api.warehouse.getAll(params),
    placeholderData: keepPreviousData,
  });

const getOptions = (id: string) =>
  queryOptions({
    queryKey: [...warehouseQueryKey, id],
    queryFn: () => api.warehouse.get(id),
  });

export const warehouseQuery = (queryClient: QueryClient) => ({
  getAllOptions,
  getAll: (params?: ApiWarehouseGetAllParams) =>
    queryClient.fetchQuery(getAllOptions(params)),
  useGetAll: (params?: ApiWarehouseGetAllParams) =>
    useQuery(getAllOptions(params)),

  getOptions,
  get: (id: string) => queryClient.fetchQuery(getOptions(id)),
  useGet: (id: string) => useQuery(getOptions(id)),

  useCreate: () =>
    useMutation({
      mutationFn: (data: ApiWarehouseCreate) => api.warehouse.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: warehouseQueryKey });
      },
    }),
  create: (data: ApiWarehouseCreate) => api.warehouse.create(data),

  useCreateMany: () =>
    useMutation({
      mutationFn: (data: ApiWarehouseCreate[]) => api.warehouse.createMany(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: warehouseQueryKey });
      },
    }),
  createMany: (data: ApiWarehouseCreate[]) => api.warehouse.createMany(data),

  useUpdate: () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: ApiWarehouseUpdate }) =>
        api.warehouse.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: warehouseQueryKey });
      },
    }),
  update: ({ id, data }: { id: string; data: ApiWarehouseUpdate }) =>
    api.warehouse.update(id, data),

  useDelete: () =>
    useMutation({
      mutationFn: (id: string) => api.warehouse.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: warehouseQueryKey });
      },
    }),
  delete: (id: string) => api.warehouse.delete(id),

  useDeleteMany: () =>
    useMutation({
      mutationFn: (ids: string[]) => api.warehouse.deleteMany(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: warehouseQueryKey });
      },
    }),
  deleteMany: (ids: string[]) => api.warehouse.deleteMany(ids),
});

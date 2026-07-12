import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import api from "@/api/api";
import {
  type ApiProductCreate,
  type ApiProductGetAllParams,
  type ApiProductUpdate,
} from "@/api/product-api";
import { QueryClient } from "@tanstack/react-query";

export const productQueryKey = ["product"];

const getAllOptions = (params?: ApiProductGetAllParams) =>
  queryOptions({
    queryKey: [...productQueryKey, params],
    queryFn: () => api.product.getAll(params),
    placeholderData: keepPreviousData,
  });

const getOptions = (id: string) =>
  queryOptions({
    queryKey: [...productQueryKey, id],
    queryFn: () => api.product.get(id),
  });

export const productQuery = (queryClient: QueryClient) => ({
  // getAll
  getAllOptions,
  getAll: (params?: ApiProductGetAllParams) =>
    queryClient.fetchQuery(getAllOptions(params)),
  useGetAll: (params?: ApiProductGetAllParams) =>
    useQuery(getAllOptions(params)),

  // get
  getOptions,
  get: (id: string) => queryClient.fetchQuery(getOptions(id)),
  useGet: (id: string) => useQuery(getOptions(id)),

  // create
  useCreate: () =>
    useMutation({
      mutationFn: (data: ApiProductCreate) => api.product.create(data),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: productQueryKey }),
    }),
  create: async (data: ApiProductCreate) => {
    const result = await api.product.create(data);
    queryClient.invalidateQueries({ queryKey: productQueryKey });
    return result;
  },

  // update
  useUpdate: () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: ApiProductUpdate }) =>
        api.product.update(id, data),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: productQueryKey });
        queryClient.invalidateQueries({ queryKey: [...productQueryKey, id] });
      },
    }),
  update: async ({ id, data }: { id: string; data: ApiProductUpdate }) => {
    const result = await api.product.update(id, data);
    queryClient.invalidateQueries({ queryKey: productQueryKey });
    queryClient.invalidateQueries({ queryKey: [...productQueryKey, id] });
    return result;
  },

  // delete
  useDelete: () =>
    useMutation({
      mutationFn: (id: string) => api.product.delete(id),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: productQueryKey }),
    }),
  delete: async (id: string) => {
    const result = await api.product.delete(id);
    queryClient.invalidateQueries({ queryKey: productQueryKey });
    return result;
  },

  // delete many
  useDeleteMany: () =>
    useMutation({
      mutationFn: (ids: string[]) => api.product.deleteMany(ids),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: productQueryKey }),
    }),
  deleteMany: async (ids: string[]) => {
    const result = await api.product.deleteMany(ids);
    queryClient.invalidateQueries({ queryKey: productQueryKey });
    return result;
  },
});

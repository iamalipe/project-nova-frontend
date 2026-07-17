import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import api from "@/api/api";
import {
  type ApiCategoryCreate,
  type ApiCategoryGetAllParams,
  type ApiCategoryUpdate,
} from "@/api/category-api";
import { QueryClient } from "@tanstack/react-query";

export const categoryQueryKey = ["category"];

const getAllOptions = (params?: ApiCategoryGetAllParams) =>
  queryOptions({
    queryKey: [...categoryQueryKey, params],
    queryFn: () => api.category.getAll(params),
    placeholderData: keepPreviousData,
  });

const getOptions = (id: string) =>
  queryOptions({
    queryKey: [...categoryQueryKey, id],
    queryFn: () => api.category.get(id),
  });

export const categoryQuery = (queryClient: QueryClient) => ({
  // getAll
  getAllOptions,
  getAll: (params?: ApiCategoryGetAllParams) =>
    queryClient.fetchQuery(getAllOptions(params)),
  useGetAll: (params?: ApiCategoryGetAllParams) =>
    useQuery(getAllOptions(params)),

  // get
  getOptions,
  get: (id: string) => queryClient.fetchQuery(getOptions(id)),
  useGet: (id: string) => useQuery(getOptions(id)),

  // create
  useCreate: () =>
    useMutation({
      mutationFn: (data: ApiCategoryCreate) => api.category.create(data),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: categoryQueryKey }),
    }),
  create: async (data: ApiCategoryCreate) => {
    const result = await api.category.create(data);
    queryClient.invalidateQueries({ queryKey: categoryQueryKey });
    return result;
  },

  // create many
  useCreateMany: () =>
    useMutation({
      mutationFn: (data: ApiCategoryCreate[]) => api.category.createMany(data),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: categoryQueryKey }),
    }),
  createMany: async (data: ApiCategoryCreate[]) => {
    const result = await api.category.createMany(data);
    queryClient.invalidateQueries({ queryKey: categoryQueryKey });
    return result;
  },

  // update
  useUpdate: () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: ApiCategoryUpdate }) =>
        api.category.update(id, data),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: categoryQueryKey });
        queryClient.invalidateQueries({ queryKey: [...categoryQueryKey, id] });
      },
    }),
  update: async ({ id, data }: { id: string; data: ApiCategoryUpdate }) => {
    const result = await api.category.update(id, data);
    queryClient.invalidateQueries({ queryKey: categoryQueryKey });
    queryClient.invalidateQueries({ queryKey: [...categoryQueryKey, id] });
    return result;
  },

  // delete
  useDelete: () =>
    useMutation({
      mutationFn: (id: string) => api.category.delete(id),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: categoryQueryKey }),
    }),
  delete: async (id: string) => {
    const result = await api.category.delete(id);
    queryClient.invalidateQueries({ queryKey: categoryQueryKey });
    return result;
  },

  // delete many
  useDeleteMany: () =>
    useMutation({
      mutationFn: (ids: string[]) => api.category.deleteMany(ids),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: categoryQueryKey }),
    }),
  deleteMany: async (ids: string[]) => {
    const result = await api.category.deleteMany(ids);
    queryClient.invalidateQueries({ queryKey: categoryQueryKey });
    return result;
  },
});

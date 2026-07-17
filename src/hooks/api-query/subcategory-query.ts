import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import api from "@/api/api";
import {
  type ApiSubcategoryCreate,
  type ApiSubcategoryGetAllParams,
  type ApiSubcategoryUpdate,
} from "@/api/subcategory-api";
import { QueryClient } from "@tanstack/react-query";

export const subcategoryQueryKey = ["subcategory"];

const getAllOptions = (params?: ApiSubcategoryGetAllParams) =>
  queryOptions({
    queryKey: [...subcategoryQueryKey, params],
    queryFn: () => api.subcategory.getAll(params),
    placeholderData: keepPreviousData,
  });

const getOptions = (id: string) =>
  queryOptions({
    queryKey: [...subcategoryQueryKey, id],
    queryFn: () => api.subcategory.get(id),
  });

export const subcategoryQuery = (queryClient: QueryClient) => ({
  // getAll
  getAllOptions,
  getAll: (params?: ApiSubcategoryGetAllParams) =>
    queryClient.fetchQuery(getAllOptions(params)),
  useGetAll: (params?: ApiSubcategoryGetAllParams) =>
    useQuery(getAllOptions(params)),

  // get
  getOptions,
  get: (id: string) => queryClient.fetchQuery(getOptions(id)),
  useGet: (id: string) => useQuery(getOptions(id)),

  // create
  useCreate: () =>
    useMutation({
      mutationFn: (data: ApiSubcategoryCreate) => api.subcategory.create(data),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: subcategoryQueryKey }),
    }),
  create: async (data: ApiSubcategoryCreate) => {
    const result = await api.subcategory.create(data);
    queryClient.invalidateQueries({ queryKey: subcategoryQueryKey });
    return result;
  },

  // create many
  useCreateMany: () =>
    useMutation({
      mutationFn: (data: ApiSubcategoryCreate[]) => api.subcategory.createMany(data),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: subcategoryQueryKey }),
    }),
  createMany: async (data: ApiSubcategoryCreate[]) => {
    const result = await api.subcategory.createMany(data);
    queryClient.invalidateQueries({ queryKey: subcategoryQueryKey });
    return result;
  },

  // update
  useUpdate: () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: ApiSubcategoryUpdate }) =>
        api.subcategory.update(id, data),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: subcategoryQueryKey });
        queryClient.invalidateQueries({ queryKey: [...subcategoryQueryKey, id] });
      },
    }),
  update: async ({ id, data }: { id: string; data: ApiSubcategoryUpdate }) => {
    const result = await api.subcategory.update(id, data);
    queryClient.invalidateQueries({ queryKey: subcategoryQueryKey });
    queryClient.invalidateQueries({ queryKey: [...subcategoryQueryKey, id] });
    return result;
  },

  // delete
  useDelete: () =>
    useMutation({
      mutationFn: (id: string) => api.subcategory.delete(id),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: subcategoryQueryKey }),
    }),
  delete: async (id: string) => {
    const result = await api.subcategory.delete(id);
    queryClient.invalidateQueries({ queryKey: subcategoryQueryKey });
    return result;
  },

  // delete many
  useDeleteMany: () =>
    useMutation({
      mutationFn: (ids: string[]) => api.subcategory.deleteMany(ids),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: subcategoryQueryKey }),
    }),
  deleteMany: async (ids: string[]) => {
    const result = await api.subcategory.deleteMany(ids);
    queryClient.invalidateQueries({ queryKey: subcategoryQueryKey });
    return result;
  },
});

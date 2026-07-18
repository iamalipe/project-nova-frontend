import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import api from "@/api/api";
import {
  type ApiCountryCreate,
  type ApiCountryGetAllParams,
  type ApiCountryUpdate,
} from "@/api/country-api";
import { QueryClient } from "@tanstack/react-query";

export const countryQueryKey = ["country"];

const getAllOptions = (params?: ApiCountryGetAllParams) =>
  queryOptions({
    queryKey: [...countryQueryKey, params],
    queryFn: () => api.country.getAll(params),
    placeholderData: keepPreviousData,
  });

const getOptions = (id: string) =>
  queryOptions({
    queryKey: [...countryQueryKey, id],
    queryFn: () => api.country.get(id),
  });

export const countryQuery = (queryClient: QueryClient) => ({
  // getAll
  getAllOptions,
  getAll: (params?: ApiCountryGetAllParams) =>
    queryClient.fetchQuery(getAllOptions(params)),
  useGetAll: (params?: ApiCountryGetAllParams) =>
    useQuery(getAllOptions(params)),

  // get
  getOptions,
  get: (id: string) => queryClient.fetchQuery(getOptions(id)),
  useGet: (id: string) => useQuery(getOptions(id)),

  // create
  useCreate: () =>
    useMutation({
      mutationFn: (data: ApiCountryCreate) => api.country.create(data),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: countryQueryKey }),
    }),
  create: async (data: ApiCountryCreate) => {
    const result = await api.country.create(data);
    queryClient.invalidateQueries({ queryKey: countryQueryKey });
    return result;
  },

  // create many
  useCreateMany: () =>
    useMutation({
      mutationFn: (data: ApiCountryCreate[]) => api.country.createMany(data),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: countryQueryKey }),
    }),
  createMany: async (data: ApiCountryCreate[]) => {
    const result = await api.country.createMany(data);
    queryClient.invalidateQueries({ queryKey: countryQueryKey });
    return result;
  },

  // update
  useUpdate: () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: ApiCountryUpdate }) =>
        api.country.update(id, data),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: countryQueryKey });
        queryClient.invalidateQueries({ queryKey: [...countryQueryKey, id] });
      },
    }),
  update: async ({ id, data }: { id: string; data: ApiCountryUpdate }) => {
    const result = await api.country.update(id, data);
    queryClient.invalidateQueries({ queryKey: countryQueryKey });
    queryClient.invalidateQueries({ queryKey: [...countryQueryKey, id] });
    return result;
  },

  // delete
  useDelete: () =>
    useMutation({
      mutationFn: (id: string) => api.country.delete(id),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: countryQueryKey }),
    }),
  delete: async (id: string) => {
    const result = await api.country.delete(id);
    queryClient.invalidateQueries({ queryKey: countryQueryKey });
    return result;
  },

  // delete many
  useDeleteMany: () =>
    useMutation({
      mutationFn: (ids: string[]) => api.country.deleteMany(ids),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: countryQueryKey }),
    }),
  deleteMany: async (ids: string[]) => {
    const result = await api.country.deleteMany(ids);
    queryClient.invalidateQueries({ queryKey: countryQueryKey });
    return result;
  },
});

import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import api from "@/api/api";
import {
  type ApiStateCreate,
  type ApiStateGetAllParams,
  type ApiStateUpdate,
} from "@/api/state-api";
import { QueryClient } from "@tanstack/react-query";

export const stateQueryKey = ["state"];

const getAllOptions = (params?: ApiStateGetAllParams) =>
  queryOptions({
    queryKey: [...stateQueryKey, params],
    queryFn: () => api.state.getAll(params),
    placeholderData: keepPreviousData,
  });

const getOptions = (id: string) =>
  queryOptions({
    queryKey: [...stateQueryKey, id],
    queryFn: () => api.state.get(id),
  });

export const stateQuery = (queryClient: QueryClient) => ({
  // getAll
  getAllOptions,
  getAll: (params?: ApiStateGetAllParams) =>
    queryClient.fetchQuery(getAllOptions(params)),
  useGetAll: (params?: ApiStateGetAllParams) =>
    useQuery(getAllOptions(params)),

  // get
  getOptions,
  get: (id: string) => queryClient.fetchQuery(getOptions(id)),
  useGet: (id: string) => useQuery(getOptions(id)),

  // create
  useCreate: () =>
    useMutation({
      mutationFn: (data: ApiStateCreate) => api.state.create(data),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: stateQueryKey }),
    }),
  create: async (data: ApiStateCreate) => {
    const result = await api.state.create(data);
    queryClient.invalidateQueries({ queryKey: stateQueryKey });
    return result;
  },

  // create many
  useCreateMany: () =>
    useMutation({
      mutationFn: (data: ApiStateCreate[]) => api.state.createMany(data),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: stateQueryKey }),
    }),
  createMany: async (data: ApiStateCreate[]) => {
    const result = await api.state.createMany(data);
    queryClient.invalidateQueries({ queryKey: stateQueryKey });
    return result;
  },

  // update
  useUpdate: () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: ApiStateUpdate }) =>
        api.state.update(id, data),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: stateQueryKey });
        queryClient.invalidateQueries({ queryKey: [...stateQueryKey, id] });
      },
    }),
  update: async ({ id, data }: { id: string; data: ApiStateUpdate }) => {
    const result = await api.state.update(id, data);
    queryClient.invalidateQueries({ queryKey: stateQueryKey });
    queryClient.invalidateQueries({ queryKey: [...stateQueryKey, id] });
    return result;
  },

  // delete
  useDelete: () =>
    useMutation({
      mutationFn: (id: string) => api.state.delete(id),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: stateQueryKey }),
    }),
  delete: async (id: string) => {
    const result = await api.state.delete(id);
    queryClient.invalidateQueries({ queryKey: stateQueryKey });
    return result;
  },

  // delete many
  useDeleteMany: () =>
    useMutation({
      mutationFn: (ids: string[]) => api.state.deleteMany(ids),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: stateQueryKey }),
    }),
  deleteMany: async (ids: string[]) => {
    const result = await api.state.deleteMany(ids);
    queryClient.invalidateQueries({ queryKey: stateQueryKey });
    return result;
  },
});

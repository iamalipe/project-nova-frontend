import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { unwrapApiError } from "./api-utils";

export type CategoryType = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  images: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiCategoryCreate = {
  name: string;
  description?: string | null;
  images?: string | null;
};

export type ApiCategoryUpdate = Partial<ApiCategoryCreate>;

export type ApiCategoryGetAll = ApiNormalResponse & {
  data: CategoryType[];
  pagination: { total: number; page: number; limit: number };
  sort: { orderBy: string; order: "asc" | "desc" };
  config?: TableConfigType;
};

export type ApiCategoryGet = ApiNormalResponse & { data: CategoryType };
export type ApiCategoryDeleteMany = ApiNormalResponse & {
  data: { count: number };
};

export type ApiCategoryGetAllParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
};

export const categoryAPI = (axiosInstance: AxiosInstance) => ({
  getAll: (params?: ApiCategoryGetAllParams, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const stringifiedParams = params ? qString(params) : "";
      const response = await axiosInstance.get<ApiCategoryGetAll>(
        stringifiedParams ? `/category?${stringifiedParams}` : "/category",
        config,
      );
      return response.data;
    }),

  get: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ApiCategoryGet>(
        `/category/${id}`,
        config,
      );
      return response.data;
    }),

  create: (data: ApiCategoryCreate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiCategoryGet>(
        "/category",
        data,
        config,
      );
      return response.data;
    }),

  update: (
    id: string,
    data: ApiCategoryUpdate,
    config?: AxiosRequestConfig,
  ) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<ApiCategoryGet>(
        `/category/${id}`,
        data,
        config,
      );
      return response.data;
    }),

  delete: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<ApiNormalResponse>(
        `/category/${id}`,
        config,
      );
      return response.data;
    }),

  deleteMany: (ids: string[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiCategoryDeleteMany>(
        "/category/delete-many",
        { ids },
        config,
      );
      return response.data;
    }),

  createMany: (data: ApiCategoryCreate[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiCategoryCreateMany>(
        "/category/many",
        data,
        config,
      );
      return response.data;
    }),
});

export type ApiCategoryCreateMany = ApiNormalResponse & {
  data: { success: CategoryType[]; failed: any[] };
  info: { success: number; failed: number };
};

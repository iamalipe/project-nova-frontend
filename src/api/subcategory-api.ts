import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { unwrapApiError } from "./api-utils";

export type SubcategoryType = {
  id: string;
  name: string;
  categoryId: string;
  sku: string;
  description: string | null;
  images: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    sku: string;
  };
};

export type ApiSubcategoryCreate = {
  name: string;
  categoryId: string;
  description?: string | null;
  images?: string | null;
};

export type ApiSubcategoryUpdate = Partial<ApiSubcategoryCreate>;

export type ApiSubcategoryGetAll = ApiNormalResponse & {
  data: SubcategoryType[];
  pagination: { total: number; page: number; limit: number };
  sort: { orderBy: string; order: "asc" | "desc" };
  config?: TableConfigType;
};

export type ApiSubcategoryGet = ApiNormalResponse & { data: SubcategoryType };
export type ApiSubcategoryDeleteMany = ApiNormalResponse & {
  data: { count: number };
};

export type ApiSubcategoryGetAllParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  categoryId?: string;
};

export const subcategoryAPI = (axiosInstance: AxiosInstance) => ({
  getAll: (params?: ApiSubcategoryGetAllParams, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const stringifiedParams = params ? qString(params) : "";
      const response = await axiosInstance.get<ApiSubcategoryGetAll>(
        stringifiedParams ? `/subcategory?${stringifiedParams}` : "/subcategory",
        config,
      );
      return response.data;
    }),

  get: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ApiSubcategoryGet>(
        `/subcategory/${id}`,
        config,
      );
      return response.data;
    }),

  create: (data: ApiSubcategoryCreate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiSubcategoryGet>(
        "/subcategory",
        data,
        config,
      );
      return response.data;
    }),

  update: (
    id: string,
    data: ApiSubcategoryUpdate,
    config?: AxiosRequestConfig,
  ) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<ApiSubcategoryGet>(
        `/subcategory/${id}`,
        data,
        config,
      );
      return response.data;
    }),

  delete: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<ApiNormalResponse>(
        `/subcategory/${id}`,
        config,
      );
      return response.data;
    }),

  deleteMany: (ids: string[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiSubcategoryDeleteMany>(
        "/subcategory/delete-many",
        { ids },
        config,
      );
      return response.data;
    }),

  createMany: (data: ApiSubcategoryCreate[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiSubcategoryCreateMany>(
        "/subcategory/many",
        data,
        config,
      );
      return response.data;
    }),
});

export type ApiSubcategoryCreateMany = ApiNormalResponse & {
  data: { success: SubcategoryType[]; failed: any[] };
  info: { success: number; failed: number };
};

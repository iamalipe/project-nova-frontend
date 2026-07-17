import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { unwrapApiError } from "./api-utils";

export type ProductType = {
  id: string;
  name: string;
  description: string | null;
  subcategoryId: string;
  sku: string;
  mrp: number;
  mop: number;
  images: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  subcategory?: {
    id: string;
    name: string;
    sku: string;
    categoryId: string;
    category?: {
      id: string;
      name: string;
      sku: string;
    };
  };
};

export type ApiProductCreate = {
  name: string;
  description?: string;
  subcategoryId: string;
  mrp: number;
  mop: number;
  images?: string;
};

export type ApiProductUpdate = Partial<ApiProductCreate>;

export type ApiProductGetAll = ApiNormalResponse & {
  data: ProductType[];
  pagination: { total: number; page: number; limit: number };
  sort: { orderBy: string; order: "asc" | "desc" };
  config?: TableConfigType;
};
export type ApiProductGet = ApiNormalResponse & { data: ProductType };
export type ApiProductDeleteMany = ApiNormalResponse & {
  data: { count: number };
};

export type ApiProductGetAllParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  subcategoryId?: string;
};

export const productAPI = (axiosInstance: AxiosInstance) => ({
  getAll: (params?: ApiProductGetAllParams, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const stringifiedParams = params ? qString(params) : "";
      const response = await axiosInstance.get<ApiProductGetAll>(
        stringifiedParams ? `/product?${stringifiedParams}` : "/product",
        config,
      );
      return response.data;
    }),

  get: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ApiProductGet>(
        `/product/${id}`,
        config,
      );
      return response.data;
    }),

  create: (data: ApiProductCreate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiProductGet>(
        "/product",
        data,
        config,
      );
      return response.data;
    }),

  update: (
    id: string,
    data: ApiProductUpdate,
    config?: AxiosRequestConfig,
  ) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<ApiProductGet>(
        `/product/${id}`,
        data,
        config,
      );
      return response.data;
    }),

  delete: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<ApiNormalResponse>(
        `/product/${id}`,
        config,
      );
      return response.data;
    }),

  deleteMany: (ids: string[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiProductDeleteMany>(
        "/product/delete-many",
        { ids },
        config,
      );
      return response.data;
    }),

  createMany: (data: ApiProductCreate[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiProductCreateMany>(
        "/product/many",
        data,
        config,
      );
      return response.data;
    }),
});

export type ApiProductCreateMany = ApiNormalResponse & {
  data: { success: ProductType[]; failed: any[] };
  info: { success: number; failed: number };
};

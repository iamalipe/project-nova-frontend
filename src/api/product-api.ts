// project-api.ts
import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { unwrapApiError } from "./api-utils";

export type ProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiProductCreate = Pick<
  ProductType,
  "name" | "description" | "category" | "price"
>;

export type ApiProductUpdate = Partial<
  Pick<ProductType, "name" | "description" | "category" | "price">
>;

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
});

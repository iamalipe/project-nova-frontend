import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { unwrapApiError } from "./api-utils";
import type { ProductType } from "./product-api";
import type { StoreType } from "./store-api";
import type { UserType } from "./user-api";

export type SellType = {
  id: string;
  productId: string;
  product?: ProductType;
  storeId: string;
  store?: StoreType;
  customerId: string;
  customer?: UserType;
  staffId: string;
  staff?: UserType;
  quantity: number;
  finalSellPrice: number;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiSellCreate = {
  productId: string;
  storeId: string;
  customerId: string;
  staffId: string;
  quantity: number;
  finalSellPrice: number;
  transactionDate?: string;
};

export type ApiSellUpdate = Partial<ApiSellCreate>;

export type ApiSellGetAll = ApiNormalResponse & {
  data: SellType[];
  pagination: { total: number; page: number; limit: number };
  sort: { orderBy: string; order: "asc" | "desc" };
  config?: TableConfigType;
};

export type ApiSellGet = ApiNormalResponse & { data: SellType };
export type ApiSellDeleteMany = ApiNormalResponse & { data: { count: number } };

export type ApiSellGetAllParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  productId?: string;
  storeId?: string;
  customerId?: string;
  staffId?: string;
};

export type ApiSellCreateMany = ApiNormalResponse & {
  data: { success: SellType[]; failed: any[] };
  info: { success: number; failed: number };
};

export const sellAPI = (axiosInstance: AxiosInstance) => ({
  getAll: (params?: ApiSellGetAllParams, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const stringifiedParams = params ? qString(params) : "";
      const response = await axiosInstance.get<ApiSellGetAll>(
        stringifiedParams ? `/sell?${stringifiedParams}` : "/sell",
        config,
      );
      return response.data;
    }),

  get: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ApiSellGet>(`/sell/${id}`, config);
      return response.data;
    }),

  create: (data: ApiSellCreate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiSellGet>("/sell", data, config);
      return response.data;
    }),

  update: (id: string, data: ApiSellUpdate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<ApiSellGet>(`/sell/${id}`, data, config);
      return response.data;
    }),

  delete: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<ApiNormalResponse>(`/sell/${id}`, config);
      return response.data;
    }),

  deleteMany: (ids: string[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiSellDeleteMany>("/sell/delete-many", { ids }, config);
      return response.data;
    }),

  createMany: (data: ApiSellCreate[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiSellCreateMany>("/sell/many", data, config);
      return response.data;
    }),
});

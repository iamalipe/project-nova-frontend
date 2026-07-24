import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { unwrapApiError } from "./api-utils";
import type { ProductType } from "./product-api";
import type { StoreType } from "./store-api";
import type { WarehouseType } from "./warehouse-api";

export type StockType = {
  id: string;
  productId: string;
  product?: ProductType;
  storeId: string | null;
  store?: StoreType;
  warehouseId: string | null;
  warehouse?: WarehouseType;
  quantity: number;
  minThreshold: number | null;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiStockCreate = {
  productId: string;
  storeId?: string | null;
  warehouseId?: string | null;
  quantity: number;
  minThreshold?: number | null;
};

export type ApiStockUpdate = Partial<ApiStockCreate>;

export type ApiStockGetAll = ApiNormalResponse & {
  data: StockType[];
  pagination: { total: number; page: number; limit: number };
  sort: { orderBy: string; order: "asc" | "desc" };
  config?: TableConfigType;
};

export type ApiStockGet = ApiNormalResponse & { data: StockType };
export type ApiStockDeleteMany = ApiNormalResponse & { data: { count: number } };

export type ApiStockGetAllParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  productId?: string;
  storeId?: string;
  warehouseId?: string;
};

export type ApiStockCreateMany = ApiNormalResponse & {
  data: { success: StockType[]; failed: any[] };
  info: { success: number; failed: number };
};

export const stockAPI = (axiosInstance: AxiosInstance) => ({
  getAll: (params?: ApiStockGetAllParams, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const stringifiedParams = params ? qString(params) : "";
      const response = await axiosInstance.get<ApiStockGetAll>(
        stringifiedParams ? `/stock?${stringifiedParams}` : "/stock",
        config,
      );
      return response.data;
    }),

  get: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ApiStockGet>(`/stock/${id}`, config);
      return response.data;
    }),

  create: (data: ApiStockCreate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStockGet>("/stock", data, config);
      return response.data;
    }),

  update: (id: string, data: ApiStockUpdate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<ApiStockGet>(`/stock/${id}`, data, config);
      return response.data;
    }),

  delete: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<ApiNormalResponse>(`/stock/${id}`, config);
      return response.data;
    }),

  deleteMany: (ids: string[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStockDeleteMany>("/stock/delete-many", { ids }, config);
      return response.data;
    }),

  createMany: (data: ApiStockCreate[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStockCreateMany>("/stock/many", data, config);
      return response.data;
    }),
});

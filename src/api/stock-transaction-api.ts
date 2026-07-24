import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { unwrapApiError } from "./api-utils";
import type { StoreType } from "./store-api";
import type { WarehouseType } from "./warehouse-api";

export type TransactionItem = {
  productId: string;
  qty: number;
  dropStoreId?: string;
  dropWarehouseId?: string;
};

export type StockTransactionType = {
  id: string;
  fromStoreId: string | null;
  fromStore?: StoreType;
  fromWarehouseId: string | null;
  fromWarehouse?: WarehouseType;
  products: TransactionItem[];
  travelCost: number;
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED";
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiStockTransactionCreate = {
  fromStoreId?: string | null;
  fromWarehouseId?: string | null;
  products: TransactionItem[];
  travelCost: number;
  status?: "PENDING" | "IN_TRANSIT" | "DELIVERED";
  transactionDate?: string;
};

export type ApiStockTransactionUpdate = Partial<ApiStockTransactionCreate>;

export type ApiStockTransactionGetAll = ApiNormalResponse & {
  data: StockTransactionType[];
  pagination: { total: number; page: number; limit: number };
  sort: { orderBy: string; order: "asc" | "desc" };
  config?: TableConfigType;
};

export type ApiStockTransactionGet = ApiNormalResponse & { data: StockTransactionType };
export type ApiStockTransactionDeleteMany = ApiNormalResponse & { data: { count: number } };

export type ApiStockTransactionGetAllParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  status?: "PENDING" | "IN_TRANSIT" | "DELIVERED";
  fromStoreId?: string;
  fromWarehouseId?: string;
};

export type ApiStockTransactionCreateMany = ApiNormalResponse & {
  data: { success: StockTransactionType[]; failed: any[] };
  info: { success: number; failed: number };
};

export const stockTransactionAPI = (axiosInstance: AxiosInstance) => ({
  getAll: (params?: ApiStockTransactionGetAllParams, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const stringifiedParams = params ? qString(params) : "";
      const response = await axiosInstance.get<ApiStockTransactionGetAll>(
        stringifiedParams ? `/stock-transaction?${stringifiedParams}` : "/stock-transaction",
        config,
      );
      return response.data;
    }),

  get: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ApiStockTransactionGet>(`/stock-transaction/${id}`, config);
      return response.data;
    }),

  create: (data: ApiStockTransactionCreate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStockTransactionGet>("/stock-transaction", data, config);
      return response.data;
    }),

  update: (id: string, data: ApiStockTransactionUpdate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<ApiStockTransactionGet>(`/stock-transaction/${id}`, data, config);
      return response.data;
    }),

  delete: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<ApiNormalResponse>(`/stock-transaction/${id}`, config);
      return response.data;
    }),

  deleteMany: (ids: string[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStockTransactionDeleteMany>("/stock-transaction/delete-many", { ids }, config);
      return response.data;
    }),

  createMany: (data: ApiStockTransactionCreate[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStockTransactionCreateMany>("/stock-transaction/many", data, config);
      return response.data;
    }),
});

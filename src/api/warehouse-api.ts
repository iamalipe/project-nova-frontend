import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { unwrapApiError } from "./api-utils";
import type { CountryType } from "./country-api";
import type { StateType } from "./state-api";

export type WarehouseType = {
  id: string;
  name: string;
  warehouseCode: string;
  addressLine1: string;
  zip: string;
  stateId: string;
  state?: StateType;
  countryId: string;
  country?: CountryType;
  mapLocation: string | null;
  images: string[];
  description: string | null;
  supplyStoreIds: string[];
  yearlyUpkeep: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiWarehouseCreate = {
  name: string;
  warehouseCode: string;
  addressLine1: string;
  zip: string;
  stateId: string;
  countryId: string;
  mapLocation?: string | null;
  images?: string[];
  description?: string | null;
  supplyStoreIds?: string[];
  yearlyUpkeep: number;
};

export type ApiWarehouseUpdate = Partial<ApiWarehouseCreate>;

export type ApiWarehouseGetAll = ApiNormalResponse & {
  data: WarehouseType[];
  pagination: { total: number; page: number; limit: number };
  sort: { orderBy: string; order: "asc" | "desc" };
  config?: TableConfigType;
};

export type ApiWarehouseGet = ApiNormalResponse & { data: WarehouseType };
export type ApiWarehouseDeleteMany = ApiNormalResponse & { data: { count: number } };

export type ApiWarehouseGetAllParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  countryId?: string;
  stateId?: string;
};

export type ApiWarehouseCreateMany = ApiNormalResponse & {
  data: { success: WarehouseType[]; failed: any[] };
  info: { success: number; failed: number };
};

export const warehouseAPI = (axiosInstance: AxiosInstance) => ({
  getAll: (params?: ApiWarehouseGetAllParams, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const stringifiedParams = params ? qString(params) : "";
      const response = await axiosInstance.get<ApiWarehouseGetAll>(
        stringifiedParams ? `/warehouse?${stringifiedParams}` : "/warehouse",
        config,
      );
      return response.data;
    }),

  get: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ApiWarehouseGet>(`/warehouse/${id}`, config);
      return response.data;
    }),

  create: (data: ApiWarehouseCreate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiWarehouseGet>("/warehouse", data, config);
      return response.data;
    }),

  update: (id: string, data: ApiWarehouseUpdate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<ApiWarehouseGet>(`/warehouse/${id}`, data, config);
      return response.data;
    }),

  delete: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<ApiNormalResponse>(`/warehouse/${id}`, config);
      return response.data;
    }),

  deleteMany: (ids: string[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiWarehouseDeleteMany>("/warehouse/delete-many", { ids }, config);
      return response.data;
    }),

  createMany: (data: ApiWarehouseCreate[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiWarehouseCreateMany>("/warehouse/many", data, config);
      return response.data;
    }),
});

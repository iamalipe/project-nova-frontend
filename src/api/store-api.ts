import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { unwrapApiError } from "./api-utils";
import type { CountryType } from "./country-api";
import type { StateType } from "./state-api";

export type StoreType = {
  id: string;
  name: string;
  storeCode: string;
  addressLine1: string;
  zip: string;
  stateId: string;
  state?: StateType;
  countryId: string;
  country?: CountryType;
  locationMapLink: string | null;
  images: string[];
  description: string | null;
  yearlyUpkeep: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiStoreCreate = {
  name: string;
  storeCode: string;
  addressLine1: string;
  zip: string;
  stateId: string;
  countryId: string;
  locationMapLink?: string | null;
  images?: string[];
  description?: string | null;
  yearlyUpkeep: number;
};

export type ApiStoreUpdate = Partial<ApiStoreCreate>;

export type ApiStoreGetAll = ApiNormalResponse & {
  data: StoreType[];
  pagination: { total: number; page: number; limit: number };
  sort: { orderBy: string; order: "asc" | "desc" };
  config?: TableConfigType;
};

export type ApiStoreGet = ApiNormalResponse & { data: StoreType };
export type ApiStoreDeleteMany = ApiNormalResponse & { data: { count: number } };

export type ApiStoreGetAllParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  countryId?: string;
  stateId?: string;
};

export type ApiStoreCreateMany = ApiNormalResponse & {
  data: { success: StoreType[]; failed: any[] };
  info: { success: number; failed: number };
};

export const storeAPI = (axiosInstance: AxiosInstance) => ({
  getAll: (params?: ApiStoreGetAllParams, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const stringifiedParams = params ? qString(params) : "";
      const response = await axiosInstance.get<ApiStoreGetAll>(
        stringifiedParams ? `/store?${stringifiedParams}` : "/store",
        config,
      );
      return response.data;
    }),

  get: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ApiStoreGet>(`/store/${id}`, config);
      return response.data;
    }),

  create: (data: ApiStoreCreate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStoreGet>("/store", data, config);
      return response.data;
    }),

  update: (id: string, data: ApiStoreUpdate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<ApiStoreGet>(`/store/${id}`, data, config);
      return response.data;
    }),

  delete: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<ApiNormalResponse>(`/store/${id}`, config);
      return response.data;
    }),

  deleteMany: (ids: string[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStoreDeleteMany>("/store/delete-many", { ids }, config);
      return response.data;
    }),

  createMany: (data: ApiStoreCreate[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStoreCreateMany>("/store/many", data, config);
      return response.data;
    }),
});

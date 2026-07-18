import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { unwrapApiError } from "./api-utils";

export type CountryType = {
  id: string;
  name: string;
  flag: string;
  code3: string;
  code2: string;
  tz: string;
  currency3: string;
  currencySymbol: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiCountryCreate = {
  name: string;
  flag: string;
  code3: string;
  code2: string;
  tz: string;
  currency3: string;
  currencySymbol: string;
};

export type ApiCountryUpdate = Partial<ApiCountryCreate>;

export type ApiCountryGetAll = ApiNormalResponse & {
  data: CountryType[];
  pagination: { total: number; page: number; limit: number };
  sort: { orderBy: string; order: "asc" | "desc" };
  config?: TableConfigType;
};

export type ApiCountryGet = ApiNormalResponse & { data: CountryType };
export type ApiCountryDeleteMany = ApiNormalResponse & {
  data: { count: number };
};

export type ApiCountryGetAllParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
};

export const countryAPI = (axiosInstance: AxiosInstance) => ({
  getAll: (params?: ApiCountryGetAllParams, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const stringifiedParams = params ? qString(params) : "";
      const response = await axiosInstance.get<ApiCountryGetAll>(
        stringifiedParams ? `/country?${stringifiedParams}` : "/country",
        config,
      );
      return response.data;
    }),

  get: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ApiCountryGet>(
        `/country/${id}`,
        config,
      );
      return response.data;
    }),

  create: (data: ApiCountryCreate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiCountryGet>(
        "/country",
        data,
        config,
      );
      return response.data;
    }),

  update: (
    id: string,
    data: ApiCountryUpdate,
    config?: AxiosRequestConfig,
  ) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<ApiCountryGet>(
        `/country/${id}`,
        data,
        config,
      );
      return response.data;
    }),

  delete: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<ApiNormalResponse>(
        `/country/${id}`,
        config,
      );
      return response.data;
    }),

  deleteMany: (ids: string[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiCountryDeleteMany>(
        "/country/delete-many",
        { ids },
        config,
      );
      return response.data;
    }),

  createMany: (data: ApiCountryCreate[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiCountryCreateMany>(
        "/country/many",
        data,
        config,
      );
      return response.data;
    }),
});

export type ApiCountryCreateMany = ApiNormalResponse & {
  data: { success: CountryType[]; failed: any[] };
  info: { success: number; failed: number };
};

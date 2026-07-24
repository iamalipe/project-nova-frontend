import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { unwrapApiError } from "./api-utils";
import type { CountryType } from "./country-api";

export type StateType = {
  id: string;
  name: string;
  countryId: string;
  country: CountryType;
  subdivisionCode: string;
  tz: string | null;
  flag: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiStateCreate = {
  name: string;
  countryId: string;
  subdivisionCode: string;
  tz?: string | null;
  flag?: string | null;
};

export type ApiStateUpdate = Partial<ApiStateCreate>;

export type ApiStateGetAll = ApiNormalResponse & {
  data: StateType[];
  pagination: { total: number; page: number; limit: number };
  sort: { orderBy: string; order: "asc" | "desc" };
  config?: TableConfigType;
};

export type ApiStateGet = ApiNormalResponse & { data: StateType };
export type ApiStateDeleteMany = ApiNormalResponse & {
  data: { count: number };
};

export type ApiStateGetAllParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  countryId?: string;
};

export const stateAPI = (axiosInstance: AxiosInstance) => ({
  getAll: (params?: ApiStateGetAllParams, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const stringifiedParams = params ? qString(params) : "";
      const response = await axiosInstance.get<ApiStateGetAll>(
        stringifiedParams ? `/state?${stringifiedParams}` : "/state",
        config,
      );
      return response.data;
    }),

  get: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ApiStateGet>(
        `/state/${id}`,
        config,
      );
      return response.data;
    }),

  create: (data: ApiStateCreate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStateGet>(
        "/state",
        data,
        config,
      );
      return response.data;
    }),

  update: (
    id: string,
    data: ApiStateUpdate,
    config?: AxiosRequestConfig,
  ) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<ApiStateGet>(
        `/state/${id}`,
        data,
        config,
      );
      return response.data;
    }),

  delete: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<ApiNormalResponse>(
        `/state/${id}`,
        config,
      );
      return response.data;
    }),

  deleteMany: (ids: string[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStateDeleteMany>(
        "/state/delete-many",
        { ids },
        config,
      );
      return response.data;
    }),

  createMany: (data: ApiStateCreate[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiStateCreateMany>(
        "/state/many",
        data,
        config,
      );
      return response.data;
    }),
});

export type ApiStateCreateMany = ApiNormalResponse & {
  data: { success: StateType[]; failed: any[] };
  info: { success: number; failed: number };
};

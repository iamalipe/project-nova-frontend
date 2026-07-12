// project-api.ts
import { qString } from "@/lib/utils";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

export type ProductType = {
  _id: string;
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

export type ApiProductGetAllParams = {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
};

export const productAPI = (axiosInstance: AxiosInstance) => ({
  getAll: async (
    params?: ApiProductGetAllParams,
    config?: AxiosRequestConfig,
  ): Promise<ApiProductGetAll> => {
    try {
      const stringifiedParams = params ? qString(params) : "";
      const response = await axiosInstance.get<ApiProductGetAll>(
        `/product?${stringifiedParams}`,
        config,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiNormalResponse;
      }
      throw error;
    }
  },

  get: async (
    id: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiProductGet> => {
    try {
      const response = await axiosInstance.get<ApiProductGet>(
        `/product/${id}`,
        config,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiNormalResponse;
      }
      throw error;
    }
  },

  create: async (
    data: ApiProductCreate,
    config?: AxiosRequestConfig,
  ): Promise<ApiProductGet> => {
    try {
      const response = await axiosInstance.post<ApiProductGet>(
        "/product",
        data,
        config,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiNormalResponse;
      }
      throw error;
    }
  },

  update: async (
    id: string,
    data: ApiProductUpdate,
    config?: AxiosRequestConfig,
  ): Promise<ApiProductGet> => {
    try {
      const response = await axiosInstance.put<ApiProductGet>(
        `/product/${id}`,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiNormalResponse;
      }
      throw error;
    }
  },

  delete: async (
    id: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiNormalResponse> => {
    try {
      const response = await axiosInstance.delete<ApiNormalResponse>(
        `/product/${id}`,
        config,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiNormalResponse;
      }
      throw error;
    }
  },
});

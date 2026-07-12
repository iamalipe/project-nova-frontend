// auth-api.ts
import type { ApiNormalResponse } from "@/types/generic-type";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginReturn = {
  success: boolean;
};

export type RegisterPayload = {
  email: string;
  password: string;
};

export type RegisterReturn = {
  success: boolean;
};

export type CurrentUser = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName?: string;
  profileImage?: string;
};
export type CurrentUserReturn = {
  success: boolean;
  data: CurrentUser;
};

export const authAPI = (axiosInstance: AxiosInstance) => ({
  login: async (
    data: LoginPayload,
    config?: AxiosRequestConfig
  ): Promise<LoginReturn> => {
    try {
      const response = await axiosInstance.post<LoginReturn>(
        "/auth/login",
        data,
        config
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiNormalResponse;
      }
      throw error;
    }
  },

  register: async (
    data: RegisterPayload,
    config?: AxiosRequestConfig
  ): Promise<RegisterReturn> => {
    try {
      const response = await axiosInstance.post<RegisterReturn>(
        "/auth/register",
        data,
        config
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiNormalResponse;
      }
      throw error;
    }
  },

  me: async (
    config?: AxiosRequestConfig
  ): Promise<CurrentUserReturn | null> => {
    try {
      const response = await axiosInstance.get<CurrentUserReturn>(
        `/auth/me`,
        config
      );
      return response.data;
    } catch {
      return null;
    }
  },
  logout: async (config?: AxiosRequestConfig): Promise<null> => {
    try {
      const response = await axiosInstance.get<null>(`/auth/logout`, config);
      return response.data;
    } catch {
      return null;
    }
  }
});

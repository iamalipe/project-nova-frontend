// auth-api.ts
import { normalizeApiError, unwrapApiError } from "./api-utils";
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
  login: (data: LoginPayload, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<LoginReturn>(
        "/auth/login",
        data,
        config
      );
      return response.data;
    }),

  register: (data: RegisterPayload, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<RegisterReturn>(
        "/auth/register",
        data,
        config
      );
      return response.data;
    }),

  // A 401 here just means "not logged in", so it resolves to null instead of
  // throwing. Any other failure (5xx, network error) is a real problem and
  // is rethrown so callers don't mistake an outage for a logged-out state.
  me: async (
    config?: AxiosRequestConfig
  ): Promise<CurrentUserReturn | null> => {
    try {
      const response = await axiosInstance.get<CurrentUserReturn>(
        `/auth/me`,
        config
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null;
      }
      normalizeApiError(error);
    }
  },

  logout: async (config?: AxiosRequestConfig): Promise<null> => {
    try {
      const response = await axiosInstance.get<null>(`/auth/logout`, config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null;
      }
      normalizeApiError(error);
    }
  },
});

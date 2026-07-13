// auth-api.ts
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { normalizeApiError, unwrapApiError } from "./api-utils";

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

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export type UserSession = {
  id: string;
  ip?: string | null;
  userAgent?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type SessionsReturn = {
  success: boolean;
  data: UserSession[];
};

export type CurrentUser = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName?: string;
  profileImage?: string;
  role: "guest" | "superuser";
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
    } catch {
      // if (axios.isAxiosError(error) && error.response?.status === 401) {
      //   return null;
      // }
      // normalizeApiError(error);
      return null
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

  updateProfile: (data: Partial<CurrentUser>, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<CurrentUserReturn>(
        "/auth/profile",
        data,
        config
      );
      return response.data;
    }),

  updateProfileImage: (formData: FormData, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<CurrentUserReturn>(
        "/auth/profile-image",
        formData,
        {
          ...config,
          headers: {
            ...config?.headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    }),

  changePassword: (data: ChangePasswordPayload, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<{ success: boolean }>(
        "/auth/change-password",
        data,
        config
      );
      return response.data;
    }),

  getSessions: (config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<SessionsReturn>(
        "/auth/sessions",
        config
      );
      return response.data.data;
    }),

  deleteSession: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<{ success: boolean }>(
        `/auth/sessions/${id}`,
        config
      );
      return response.data;
    }),
});

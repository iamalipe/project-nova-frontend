import { qString } from "@/lib/utils"
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type"
import type { AxiosInstance, AxiosRequestConfig } from "axios"
import { unwrapApiError } from "./api-utils"

export type UserType = {
  id: string
  email: string
  firstName: string
  lastName?: string
  profileImage?: string
  role: "guest" | "SUPERUSER"
  createdAt: string
  updatedAt: string
}

export type ApiUserGetAll = ApiNormalResponse & {
  data: UserType[]
  pagination: { total: number; page: number; limit: number }
  sort: { orderBy: string; order: "asc" | "desc" }
  config?: TableConfigType
}
export type ApiUserGet = ApiNormalResponse & { data: UserType }
export type ApiUserDeleteMany = ApiNormalResponse & {
  data: { count: number }
}

export type ApiUserGetAllParams = {
  page?: number
  limit?: number
  orderBy?: string
  order?: "asc" | "desc"
  search?: string
}

export const userAPI = (axiosInstance: AxiosInstance) => ({
  getAll: (params?: ApiUserGetAllParams, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const stringifiedParams = params ? qString(params) : ""
      const response = await axiosInstance.get<ApiUserGetAll>(
        stringifiedParams ? `/user?${stringifiedParams}` : "/user",
        config
      )
      return response.data
    }),

  get: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ApiUserGet>(
        `/user/${id}`,
        config
      )
      return response.data
    }),

  delete: (id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.delete<ApiNormalResponse>(
        `/user/${id}`,
        config
      )
      return response.data
    }),

  deleteMany: (ids: string[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiUserDeleteMany>(
        "/user/delete-many",
        { ids },
        config
      )
      return response.data
    }),
})

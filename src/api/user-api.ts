import { qString } from "@/lib/utils"
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type"
import type { AxiosInstance, AxiosRequestConfig } from "axios"
import { unwrapApiError } from "./api-utils"
import type { CountryType } from "./country-api"
import type { StateType } from "./state-api"

export type UserRole = "SUPERUSER" | "GUEST" | "STORE_MANAGER" | "STAFF" | "CUSTOMER"

export type UserType = {
  id: string
  email: string
  firstName: string
  lastName?: string | null
  profileImage?: string | null
  role: UserRole
  salary?: number | null
  countryId?: string | null
  country?: CountryType | null
  stateId?: string | null
  state?: StateType | null
  address?: string | null
  zip?: string | null
  createdAt: string
  updatedAt: string
}

export type ApiUserCreate = {
  email: string
  firstName: string
  lastName?: string | null
  password?: string | null
  profileImage?: string | null
  role?: UserRole
  salary?: number | null
  countryId?: string | null
  stateId?: string | null
  address?: string | null
  zip?: string | null
}

export type ApiUserUpdate = Partial<ApiUserCreate>

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
export type ApiUserCreateMany = ApiNormalResponse & {
  data: { success: UserType[]; failed: any[] }
  info: { success: number; failed: number }
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

  create: (data: ApiUserCreate, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiUserGet>(
        "/user",
        data,
        config
      )
      return response.data
    }),

  update: (
    id: string,
    data: ApiUserUpdate,
    config?: AxiosRequestConfig
  ) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.put<ApiUserGet>(
        `/user/${id}`,
        data,
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

  createMany: (data: ApiUserCreate[], config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ApiUserCreateMany>(
        "/user/many",
        data,
        config
      )
      return response.data
    }),
})


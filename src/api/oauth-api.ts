// oauth-api.ts
import type { AxiosInstance, AxiosRequestConfig } from "axios"
import { unwrapApiError } from "./api-utils"

export type ClientInfo = {
  clientId: string
  clientName: string
}
export type ClientInfoReturn = {
  success: boolean
  data: ClientInfo
}

export type ConsentPayload = {
  client_id: string
  redirect_uri: string
  code_challenge: string
  code_challenge_method: "S256"
  state: string
}
export type ConsentReturn = {
  success: boolean
  data: { redirectTo: string }
}

export const oauthAPI = (axiosInstance: AxiosInstance) => ({
  getClientInfo: (client_id: string, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.get<ClientInfoReturn>(
        "/oauth/client-info",
        { ...config, params: { client_id } }
      )
      return response.data
    }),

  consent: (data: ConsentPayload, config?: AxiosRequestConfig) =>
    unwrapApiError(async () => {
      const response = await axiosInstance.post<ConsentReturn>(
        "/oauth/consent",
        data,
        config
      )
      return response.data
    }),
})

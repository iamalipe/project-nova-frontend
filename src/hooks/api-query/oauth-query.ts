import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"

import api from "@/api/api"

export const oauthClientInfoQueryKey = ["oauth-client-info"]

const getClientInfoOptions = (clientId: string) =>
  queryOptions({
    queryKey: [...oauthClientInfoQueryKey, clientId],
    queryFn: () => api.oauth.getClientInfo(clientId),
    staleTime: 5 * 60 * 1000,
  })

export const oauthQuery = (queryClient: QueryClient) => ({
  getClientInfoOptions,
  getClientInfo: (clientId: string) =>
    queryClient.fetchQuery(getClientInfoOptions(clientId)),
  useGetClientInfo: (clientId: string) =>
    useQuery(getClientInfoOptions(clientId)),
})

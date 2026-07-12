import "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"

// Create and export queryClient first to avoid circular dependencies
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: false,
    },
  },
})

// Import query modules after exporting queryClient
import { authQuery } from "./api-query/auth-query"
import { generalQuery } from "./api-query/general-query"
import { oauthQuery } from "./api-query/oauth-query"
import { productQuery } from "./api-query/product-query"

const apiQuery = {
  auth: authQuery(queryClient),
  general: generalQuery(queryClient),
  oauth: oauthQuery(queryClient),
  product: productQuery(queryClient),
}

export type ApiQuery = typeof apiQuery

export default apiQuery

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
import { categoryQuery } from "./api-query/category-query"
import { subcategoryQuery } from "./api-query/subcategory-query"
import { generalQuery } from "./api-query/general-query"
import { oauthQuery } from "./api-query/oauth-query"
import { productQuery } from "./api-query/product-query"
import { userQuery } from "./api-query/user-query"

const apiQuery = {
  auth: authQuery(queryClient),
  category: categoryQuery(queryClient),
  subcategory: subcategoryQuery(queryClient),
  general: generalQuery(queryClient),
  oauth: oauthQuery(queryClient),
  product: productQuery(queryClient),
  user: userQuery(queryClient),
}

export type ApiQuery = typeof apiQuery

export default apiQuery

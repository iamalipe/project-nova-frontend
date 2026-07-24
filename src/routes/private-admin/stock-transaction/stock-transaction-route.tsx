import privateAdminRoute from "@/routes/private-admin/private-admin-route";
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { createTypeSafeLoaderDeps } from "@/lib/generic-validation";
import ErrorPage from "@/components/general/error-page";
import LoadingElement from "@/components/general/loading-element";
import PageNotFound from "@/components/general/page-not-found";
import { z } from "zod";

export const getAllZodSchema = z.object({
  page: z.number().min(0).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  orderBy: z
    .string()
    .optional()
    .transform((val) => (val === "" || val === undefined ? "createdAt" : val))
    .default("createdAt"),
  search: z.string().optional(),
  status: z.enum(["PENDING", "IN_TRANSIT", "DELIVERED"]).optional(),
  fromStoreId: z.string().uuid().optional(),
  fromWarehouseId: z.string().uuid().optional(),
});

export const stockTransactionRoute = createRoute({
  getParentRoute: () => privateAdminRoute,
  path: "/stock-transaction",
  component: lazyRouteComponent(() => import("./stock-transaction-root")),
  loaderDeps: ({ search }) => createTypeSafeLoaderDeps(getAllZodSchema, search),
  validateSearch: getAllZodSchema,
  errorComponent: ErrorPage,
  notFoundComponent: PageNotFound,
  pendingComponent: LoadingElement,
});

export default stockTransactionRoute;

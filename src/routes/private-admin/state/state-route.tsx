import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import ErrorPage from "@/components/general/error-page";
import LoadingElement from "@/components/general/loading-element";
import PageNotFound from "@/components/general/page-not-found";
import privateAdminRoute from "@/routes/private-admin/private-admin-route";

import { createTypeSafeLoaderDeps } from "@/lib/generic-validation";
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
  countryId: z.string().uuid().optional(),
});

const stateRoute = createRoute({
  getParentRoute: () => privateAdminRoute,
  path: "/state",
  component: lazyRouteComponent(() => import("./state-root")),
  loaderDeps: ({ search }) => createTypeSafeLoaderDeps(getAllZodSchema, search),
  validateSearch: getAllZodSchema,
  errorComponent: ErrorPage,
  notFoundComponent: PageNotFound,
  pendingComponent: LoadingElement,
});

export default stateRoute;

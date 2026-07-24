import apiQuery from "@/hooks/use-api-query";
import { createTypeSafeLoaderDeps } from "@/lib/generic-validation";
import PrivateAppLayout from "@/routes/private-admin/private-admin-layout";
import { rootRoute } from "@/routes/root-route";
import { createRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

export const dialogStateZodSchema = z.object({
  mode: z.enum(["CREATE", "UPDATE", "VIEW", "VIEW-ALL", "IMPORT"]).optional(),
  dialog: z.enum([
    "Product",
    "User",
    "Category",
    "Subcategory",
    "Country",
    "CountryState",
    "Store",
    "Warehouse",
    "Stock",
    "StockTransaction",
    "Sell",
  ]).optional(),
  id: z.uuid().optional(),
});
export type DialogStateType = z.infer<typeof dialogStateZodSchema>;

export const privateRouteZodSchema = z.object({
  ds: z.string().optional(), // dialog state
});

const privateAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: PrivateAppLayout,
  loaderDeps: ({ search }) =>
    createTypeSafeLoaderDeps(privateRouteZodSchema, search),
  validateSearch: privateRouteZodSchema,
  beforeLoad: async ({ location }) => {
    const res = await apiQuery.auth.getCurrentUser();
    if (!res || !res.success) {
      throw redirect({
        to: "/login",
        search:
          location.pathname === "/" ? undefined : { redirect: location.href },
      });
    }
  },
});

export default privateAdminRoute;

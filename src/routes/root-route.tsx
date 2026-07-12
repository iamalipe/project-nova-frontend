import { createRootRoute } from "@tanstack/react-router";

import ErrorPage from "@/components/general/error-page";
import LoadingElement from "@/components/general/loading-element";
import PageNotFound from "@/components/general/page-not-found";
import RootLayout from "@/routes/root-layout";

// This file must NOT import any child route (auth-route, private-admin-route,
// public-home-route, etc.) — each of those imports `rootRoute` from here for
// their `getParentRoute`, which TanStack Router calls eagerly at
// `createRoute()` time, not lazily. If this file also imported them back,
// that circular import can crash with "Cannot access '...' before
// initialization" depending on module evaluation order. The full route tree
// is assembled in `@/routes/route-tree.ts` instead, which is free to import
// everything since nothing imports it back.
export const rootRoute = createRootRoute({
  component: RootLayout,
  errorComponent: ErrorPage,
  notFoundComponent: PageNotFound,
  pendingComponent: LoadingElement,
});

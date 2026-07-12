import { createRootRoute } from "@tanstack/react-router";

import ErrorPage from "@/components/general/error-page";
import LoadingElement from "@/components/general/loading-element";
import PageNotFound from "@/components/general/page-not-found";
import RootLayout from "@/routes/root-layout";

import authRoute from "./auth/auth-route";
import loginRoute from "./auth/login/login-route";
import registerRoute from "./auth/register/register-route";
import homeRoute from "./private-admin/home/home-route";
import privateAdminRoute from "./private-admin/private-admin-route";
import productRoute from "./private-admin/product/product-route";
import profileRoute from "./private-admin/profile/profile-route";
import publicHomeRoute from "./public-home/public-home-route";

export const rootRoute = createRootRoute({
  component: RootLayout,
  errorComponent: ErrorPage,
  notFoundComponent: PageNotFound,
  pendingComponent: LoadingElement,
});

export const routeTree = rootRoute.addChildren([
  publicHomeRoute,
  privateAdminRoute.addChildren([
    homeRoute,
    productRoute,
    profileRoute,
  ]),
  authRoute.addChildren([loginRoute, registerRoute]),
]);

import { rootRoute } from "@/routes/root-route";

import authRoute from "./auth/auth-route";
import loginRoute from "./auth/login/login-route";
import registerRoute from "./auth/register/register-route";
import oauthConsentRoute from "./oauth/oauth-consent-route";
import homeRoute from "./private-admin/home/home-route";
import privateAdminRoute from "./private-admin/private-admin-route";
import productRoute from "./private-admin/product/product-route";
import profileRoute from "./private-admin/profile/profile-route";
import publicHomeRoute from "./public-home/public-home-route";

export const routeTree = rootRoute.addChildren([
  publicHomeRoute,
  privateAdminRoute.addChildren([homeRoute, productRoute, profileRoute]),
  authRoute.addChildren([loginRoute, registerRoute]),
  oauthConsentRoute,
]);

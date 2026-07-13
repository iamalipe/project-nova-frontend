import { rootRoute } from "@/routes/root-route";

import authRoute from "./auth/auth-route";
import loginRoute from "./auth/login/login-route";
import registerRoute from "./auth/register/register-route";
import oauthConsentRoute from "./oauth/oauth-consent-route";
import homeRoute from "./private-admin/home/home-route";
import privateAdminRoute from "./private-admin/private-admin-route";
import productRoute from "./private-admin/product/product-route";
import userRoute from "./private-admin/user/user-route";
import publicHomeRoute from "./public-home/public-home-route";

import settingsRoute from "./private-admin/settings/settings-route";
import settingsProfileRoute from "./private-admin/settings/profile-route";
import settingsSecurityRoute from "./private-admin/settings/security-route";
import settingsBillingRoute from "./private-admin/settings/billing-route";
import settingsAppearanceRoute from "./private-admin/settings/appearance-route";
import settingsNotificationsRoute from "./private-admin/settings/notifications-route";
import settingsDisplayRoute from "./private-admin/settings/display-route";

export const routeTree = rootRoute.addChildren([
  publicHomeRoute,
  privateAdminRoute.addChildren([
    homeRoute,
    productRoute,
    userRoute,
    settingsRoute.addChildren([
      settingsProfileRoute,
      settingsSecurityRoute,
      settingsBillingRoute,
      settingsAppearanceRoute,
      settingsNotificationsRoute,
      settingsDisplayRoute,
    ]),
  ]),
  authRoute.addChildren([loginRoute, registerRoute]),
  oauthConsentRoute,
]);

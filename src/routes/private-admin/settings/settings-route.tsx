import { createRoute, redirect } from "@tanstack/react-router";
import privateAdminRoute from "@/routes/private-admin/private-admin-route";
import SettingsLayout from "./settings-layout";

const settingsRoute = createRoute({
  getParentRoute: () => privateAdminRoute,
  path: "/settings",
  beforeLoad: ({ location }) => {
    if (location.pathname === "/app/settings" || location.pathname === "/app/settings/") {
      throw redirect({
        to: "/app/settings/profile",
      });
    }
  },
  component: SettingsLayout,
});

export default settingsRoute;

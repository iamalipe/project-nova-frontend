import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import settingsRoute from "./settings-route";

const settingsBillingRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "/billing",
  component: lazyRouteComponent(() => import("./billing")),
});

export default settingsBillingRoute;

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import settingsRoute from "./settings-route";

const settingsSecurityRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "/security",
  component: lazyRouteComponent(() => import("./security")),
});

export default settingsSecurityRoute;

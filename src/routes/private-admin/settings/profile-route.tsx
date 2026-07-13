import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import settingsRoute from "./settings-route";

const settingsProfileRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "/profile",
  component: lazyRouteComponent(() => import("./profile")),
});

export default settingsProfileRoute;

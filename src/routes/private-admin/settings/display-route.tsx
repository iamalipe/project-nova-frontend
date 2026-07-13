import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import settingsRoute from "./settings-route";

const settingsDisplayRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "/display",
  component: lazyRouteComponent(() => import("./display")),
});

export default settingsDisplayRoute;

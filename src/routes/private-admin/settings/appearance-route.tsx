import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import settingsRoute from "./settings-route";

const settingsAppearanceRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "/appearance",
  component: lazyRouteComponent(() => import("./appearance")),
});

export default settingsAppearanceRoute;

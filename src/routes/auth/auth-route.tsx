import { createRoute } from "@tanstack/react-router";

import AuthLayout from "@/routes/auth/auth-layout";
import { rootRoute } from "@/routes/root-route";

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_auth",
  component: AuthLayout,
});

export default authRoute;

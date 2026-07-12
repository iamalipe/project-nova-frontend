import { createRoute, redirect } from "@tanstack/react-router";

import apiQuery from "@/hooks/use-api-query";
import { redirectSearchSchema } from "@/lib/generic-validation";
import authRoute from "@/routes/auth/auth-route";
import Register from "@/routes/auth/register/register";

const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/register",
  component: Register,
  validateSearch: redirectSearchSchema,
  beforeLoad: async () => {
    const res = await apiQuery.auth.getCurrentUser();
    if (res && res.success) {
      throw redirect({
        to: "/app",
      });
    }
  },
});

export default registerRoute;

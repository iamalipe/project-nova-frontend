import { createRoute, redirect } from "@tanstack/react-router";

import apiQuery from "@/hooks/use-api-query";
import { redirectSearchSchema } from "@/lib/generic-validation";
import authRoute from "@/routes/auth/auth-route";
import Login from "@/routes/auth/login/login";

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/login",
  component: Login,
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

export default loginRoute;

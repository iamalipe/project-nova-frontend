import { createRoute, redirect } from "@tanstack/react-router";

import apiQuery from "@/hooks/use-api-query";
import authRoute from "@/routes/auth/auth-route";
import Register from "@/routes/auth/register/register";

const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/register",
  component: Register,
  beforeLoad: async () => {
    const res = await apiQuery.auth.getCurrentUser();
    if (res && res.success) {
      throw redirect({
        to: "/admin",
      });
    }
  },
});

export default registerRoute;

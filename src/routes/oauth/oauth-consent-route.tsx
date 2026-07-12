import apiQuery from "@/hooks/use-api-query";
import { oauthConsentSearchSchema } from "@/lib/generic-validation";
import OAuthConsent from "@/routes/oauth/oauth-consent";
import { rootRoute } from "@/routes/root-route";
import { createRoute, redirect } from "@tanstack/react-router";

// Sibling of `authRoute`/`privateAdminRoute`, not nested under `authRoute` —
// `authRoute`'s children (login/register) redirect *authenticated* users
// away, which is the opposite of what this consent page needs.
const oauthConsentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/oauth/consent",
  component: OAuthConsent,
  validateSearch: oauthConsentSearchSchema,
  beforeLoad: async ({ location }) => {
    const res = await apiQuery.auth.getCurrentUser();
    if (!res || !res.success) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
});

export default oauthConsentRoute;

import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/style/custom.css";
import "@/style/index.css";

import { queryClient } from "@/hooks/use-api-query";
import { routeTree } from "@/routes/root-route";

const router = createRouter({
  routeTree,
  // Inject queryClient into the router context
  context: {
    queryClient,
  },
  // Let TanStack Query handle data caching completely
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}

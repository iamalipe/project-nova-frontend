# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A React 19 + Vite SPA admin dashboard/starter-kit (auth, a "product" CRUD module as the reference feature, admin sidebar shell). It is the frontend half of a two-repo project; the sibling backend lives at `../project-nova-backend` (Hono + Prisma/PostgreSQL). They communicate over HTTP with a cookie-based session (`withCredentials: true`, no client-side token handling) and are deployed separately (`nova.abhiseck.dev` / `api.nova.abhiseck.dev`).

## Commands

```bash
npm run dev        # vite dev server
npm run build       # tsc -b && vite build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm run format      # prettier --write "**/*.{ts,tsx}"
```

There is no test suite configured in this repo (no test runner installed, no `*.test.*`/`*.spec.*` files) — don't invent test commands.

For a single-file check during development: `npx tsc --noEmit` and `npx eslint <path>` both work standalone and are faster than the full commands above when iterating on one file.

## Environment

- `.env` sets `VITE_API_URL` to the production API. `.env.development` overrides it to `http://localhost:3000` for local dev — Vite's env precedence means the `.development` file wins whenever `npm run dev` is used, so local dev expects a backend running on port 3000.
- The axios `baseURL` is `${VITE_API_URL}/v1` (see `src/api/api.ts`).

## Architecture

### Path alias
`@/*` → `src/*`, configured in both `vite.config.ts` and `tsconfig.app.json`. Tailwind's CSS entry is `src/style/index.css` (not `src/index.css` — a couple of config files, like `.prettierrc`'s `tailwindStylesheet` and `components.json`'s `tailwind.css`, need to point at the real path or tooling breaks).

### Routing (`src/routes/`, TanStack Router — hand-authored, not file-based codegen)
Each route is a `*-route.tsx` (route definition: `path`, `validateSearch`, `beforeLoad`, `loaderDeps`) paired with a same-named component file.

**Circular-import gotcha**: `root-route.tsx` must never import any child route module. TanStack Router's `createRoute()` calls `getParentRoute()` eagerly at construction time (not lazily), and every child route imports `rootRoute` (or `privateAdminRoute`/`authRoute`) back for its own `getParentRoute`. If `root-route.tsx` also imported those children, that circular import can throw `Cannot access '...' before initialization` depending on module evaluation order. The full tree is assembled separately in `route-tree.ts` (imported only by `main.tsx`) — keep `root-route.tsx` a pure leaf that only exports `rootRoute`.

Three branches off `rootRoute`: `publicHomeRoute` (`/`), `privateAdminRoute` (`/app`, auth-guarded), `authRoute` (`/login`, `/register`). `privateAdminRoute`'s `beforeLoad` calls `apiQuery.auth.getCurrentUser()` and redirects unauthenticated users to `/login` with a `redirect` search param — that param is validated with `isSafeRedirectPath` (`lib/utils.ts`) before ever being passed to `navigate()`, specifically to prevent an open-redirect; don't remove that check when touching the login/register flow.

Route-level UI state (which dialog is open, its mode/id, table pagination/sort) is zod-validated and often round-tripped through the URL via `validateAndStringify`/`validateAndParse` (`lib/generic-validation.ts`), which compress the state with `lz-string` into a single `ds` search param.

### API layer (`src/api/`)
One shared axios instance (`api.ts`). `api-utils.ts` exports `unwrapApiError`/`normalizeApiError`; every api module method wraps its axios call in `unwrapApiError(...)` instead of a local try/catch, so backend errors normalize to the same `ApiNormalResponse` shape everywhere. Each resource gets its own `<resource>-api.ts` exporting a factory `xAPI(axiosInstance) => ({...methods})`.

### Query layer (`src/hooks/api-query/` + `src/hooks/use-api-query.tsx`)
`use-api-query.tsx` exports the singleton `queryClient` **before** importing the per-resource query modules — that ordering exists specifically to avoid a circular-dependency init issue, keep it if you add a new resource. Each `<resource>-query.ts` is a factory `xQuery(queryClient) => ({...})` exposing both a hook variant (`useGetAll`, `useCreate`, ...) for components and an imperative variant (`getAll`, `create`, ...) for route loaders/non-component code, sharing the same query options and cache-invalidation logic. `product-api.ts`/`product-query.ts` is the reference implementation to copy for a new resource.

### UI components — `@base-ui/react`, not Radix
Despite shadcn-style file layout, this project uses **base-ui**, which composes via a `render` prop, not `asChild`. Correct pattern: `<Button render={<Link to="/x" />}>Text</Button>` — children go on the outer component; the `render` target gets no children of its own. When the `render` target isn't a native `<button>` (e.g. a `Link` renders an `<a>`), also pass `nativeButton={false}`, or base-ui logs a console error about missing native-button semantics. `src/components/ui/` is generated/vendor code — treat it as such.

### Data tables (`src/components/data-table/`, `src/hooks/use-data-table.tsx`, `use-pagination*`, `use-sort*`)
Server-paginated/sorted tables (`use-pagination.tsx`/`use-sort.tsx`) sync state to the URL via `navigate()`; the client-side variants (`use-pagination-client-side.tsx`/`use-sort-client-side.tsx`) slice an in-memory array instead. Both pairs share a core state hook (`usePaginationState`/`useSortState`) — extend that shared core, not the individual wrappers, when changing shared behavior. `src/routes/private-admin/product/` is the reference feature module (table, row actions, create/update/view dialogs) that other resource modules are expected to copy.

### Alert/confirm dialogs (`src/components/alert-popup/`)
`alertPopup.show()/.confirm()/.delete()` is a singleton mediator: `AlertPopupProvider` (mounted once in `root-layout.tsx`) overwrites a module-level `alertPopupApi.show` function on mount, letting any code — not just components — trigger a confirm dialog and `await` the result. The resolved value is `{ response: boolean, ...}`; always check `.response`, not the object itself (it's always truthy).

### Dates
Use `dayjs` (`lib/date-time.ts`) for date formatting/parsing. `date-fns` is a direct dependency only because `react-day-picker` needs it as a peer — don't import it directly in app code.

# AGENTS.md

# 🤖 AI Agent Engineering Guidelines (System Prompt Override)

> **CRITICAL DIRECTIVE FOR CODESPACE AGENTS:** You are acting as a Senior Frontend Architect working on **Project Nova**. You must strictly adhere to the technology stack boundaries, architectural conventions, and code constraints detailed below. Do not attempt to introduce alternative paradigms or legacy patterns.

---

## 🚫 Absolute Technology Bans & Deprecations

Do not install, import, or recommend the following tools under any circumstances:

- **NO `react-router-dom`:** All navigation, routing, layout rendering, and search parameter tracking **MUST** use `tanstack/react-router`.
- **NO Redux / React Context Boilerplate:** For UI/Client global state, use clean `zustand` slices.
- **NO Native HTML Forms or Formik/React-Hook-Form:** All input systems must leverage `@tanstack/react-form`.
- **NO Moment.js or date-fns:** All date parsing, formatting, and operations must execute exclusively via `dayjs`.
- **NO Crypto / Vanilla UUID:** For client-side key generation, use `nanoid`.

---

## 🏗️ Architectural Execution Standards

### 1. Navigation & Routing (TanStack Router)

- Implement strict structural file-based routing within the `src/routes/` folder.
- Use the `Link` component imported from `@tanstack/react-router` for all internal application links to preserve end-to-end type safety.
- Always load state via route parameters or search parameter structural validators integrated into the router.

### 2. Data Handlers & API Operations (TanStack Query + Axios)

- Isolate all data mutation and query patterns into isolated, reusable hooks inside `src/hooks/`.
- Axios calls must use a unified baseline client setup connecting directly to `api.nova.abhiseck.dev`.
- Every data payload query must feature explicit loading, error, and stale data caching conditions.

### 3. Interface Design (Shadcn UI + Base UI + Tailwind)

- Components must integrate accessible semantic HTML using **Base UI** wrappers.
- Styling layouts must be clean, highly responsive, and build directly upon Tailwind utilities.
- Incorporate `motion` components to render UI state changes, layout alterations, or dashboard metrics loading loops smoothly.

### 4. Code & Validation Discipline (TypeScript + Zod)

- Enforce absolute type safety across components. Do not bypass the parser with explicit `any` declarations.
- Synchronize backend entity properties using Zod validation schemas across both forms and incoming Axios payloads.

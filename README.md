# README.md

# Project Nova (Frontend)

Project Nova is a high-performance web dashboard built to test, visualize, and interact with a complex multi-linked global supply chain database powered by an AI-driven Model Context Protocol (MCP) environment. This dashboard acts as the retail management interface for a sustainable, premium tech brand (like Fairphone/SimplePhone), rendering real-time metrics across 10 countries, 50-100 stores, serialized asset tracking, complex warranties, and modular repair lifecycle loops.

## 🚀 Deployment Domains

- **Production Frontend:** [https://nova.abhiseck.dev](https://nova.abhiseck.dev)
- **Production API Backend:** [https://api.nova.abhiseck.dev](https://api.nova.abhiseck.dev)

---

## 🛠️ The Tech Stack

The frontend architecture relies on a collection of modern libraries selected for type safety, state control, and fluid performance.

- **Core Framework:** React 19 + Vite (Single Page Application)
- **Routing:** TanStack Router (Fully type-safe, structural file-based routing)
- **Data Fetching:** TanStack Query v5 (Server state synchronization and caching)
- **Form Architecture:** TanStack Form (High-performance, type-safe validation)
- **Validation:** Zod (Runtime type validation and schema composition)
- **State Management:** Zustand (Lightweight, atomic local UI state)
- **Design & UI System:** TailwindCSS + Shadcn UI (Utilizing **Base UI** primitives)
- **Icons:** Lucide React
- **Animations:** Motion (formerly Framer Motion)
- **HTTP Client:** Axios (Configured with global interceptors for the `api.nova.abhiseck.dev` domain)
- **Utilities:** Day.js (Lightweight date manipulation), Nanoid (Client-side cryptographic ID generation)

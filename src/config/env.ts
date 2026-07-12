if (!import.meta.env.VITE_API_URL) {
  console.error(
    "[config/env] VITE_API_URL is not set. API calls will be misrouted " +
      "(falling back to an empty base URL). Set VITE_API_URL in your .env file."
  );
}

export const API_URL = (import.meta.env.VITE_API_URL as string) || "";
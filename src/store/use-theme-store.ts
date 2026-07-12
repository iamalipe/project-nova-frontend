import { create } from "zustand";

const themeStorageKey = "app-theme";
const isBrowser = typeof window !== "undefined";

export type ThemeStore = {
  theme: "dark" | "light" | "system";
  setTheme: (theme: ThemeStore["theme"]) => void; // Updated type for setTheme
};

const getStoredTheme = (): ThemeStore["theme"] =>
  (isBrowser &&
    (localStorage.getItem(themeStorageKey) as ThemeStore["theme"])) ||
  "system";

const onThemeChange = (theme: ThemeStore["theme"]) => {
  if (!isBrowser) return;

  localStorage.setItem(themeStorageKey, theme);

  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    root.classList.add(systemTheme);
    return;
  }

  root.classList.add(theme);
};

const useThemeStore = create<ThemeStore>((set) => ({
  theme: getStoredTheme(),
  setTheme: (theme) => {
    set({ theme });
    onThemeChange(theme); // Ensure `onThemeChange` is called on theme update
  },
}));

// Initialize the theme on app load
onThemeChange(getStoredTheme());

export default useThemeStore;

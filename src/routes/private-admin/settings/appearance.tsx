import { useState, useEffect } from "react";
import { toast } from "sonner";
import useThemeStore from "@/store/use-theme-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppearanceTab() {
  const { theme, setTheme } = useThemeStore();
  const [font, setFont] = useState("inter");
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleUpdateAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    setTheme(selectedTheme);
    toast.success("Appearance preferences updated successfully");
  };

  return (
    <form onSubmit={handleUpdateAppearance} className="space-y-6">
      <div className="space-y-4">
        {/* Font Select */}
        <div className="space-y-2">
          <label className="text-sm font-semibold block" htmlFor="font">
            Font
          </label>
          <div className="relative">
            <select
              id="font"
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8 cursor-pointer"
            >
              <option value="inter">Inter (Default)</option>
              <option value="outfit">Outfit</option>
              <option value="roboto">Roboto</option>
              <option value="mono">System Mono</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <p className="text-[12px] text-muted-foreground">
            Set the font you want to use in the dashboard.
          </p>
        </div>

        {/* Theme Selection Cards */}
        <div className="space-y-2">
          <label className="text-sm font-semibold block">Theme</label>
          <p className="text-[12px] text-muted-foreground mb-4">
            Select the theme for the dashboard.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Light Card Mock */}
            <div
              onClick={() => setSelectedTheme("light")}
              className={cn(
                "group cursor-pointer rounded-lg border-2 p-3 space-y-2 hover:border-foreground/50 transition-all",
                selectedTheme === "light"
                  ? "border-primary"
                  : "border-muted"
              )}
            >
              <div className="rounded-md bg-zinc-100 p-2 space-y-2 border border-zinc-200">
                <div className="h-2 w-[80px] rounded-sm bg-zinc-300" />
                <div className="space-y-1.5">
                  <div className="h-1.5 w-[120px] rounded-sm bg-zinc-300" />
                  <div className="h-1.5 w-[100px] rounded-sm bg-zinc-300" />
                </div>
              </div>
              <span className="block text-center text-xs font-semibold mt-2 group-hover:text-foreground">
                Light
              </span>
            </div>

            {/* Dark Card Mock */}
            <div
              onClick={() => setSelectedTheme("dark")}
              className={cn(
                "group cursor-pointer rounded-lg border-2 p-3 space-y-2 hover:border-foreground/50 transition-all",
                selectedTheme === "dark"
                  ? "border-primary"
                  : "border-muted"
              )}
            >
              <div className="rounded-md bg-zinc-950 p-2 space-y-2 border border-zinc-800">
                <div className="h-2 w-[80px] rounded-sm bg-zinc-800" />
                <div className="space-y-1.5">
                  <div className="h-1.5 w-[120px] rounded-sm bg-zinc-800" />
                  <div className="h-1.5 w-[100px] rounded-sm bg-zinc-800" />
                </div>
              </div>
              <span className="block text-center text-xs font-semibold mt-2 group-hover:text-foreground">
                Dark
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit">Update preferences</Button>
    </form>
  );
}

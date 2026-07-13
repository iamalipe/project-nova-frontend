import { Link, Outlet } from "@tanstack/react-router";
import {
  User,
  Shield,
  CreditCard,
  Palette,
  Bell,
  Sliders,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const pageMenus = [
  { id: "profile", label: "Profile", url: "/app/settings/profile", icon: <User className="size-4" />, isDemo: false },
  { id: "security", label: "Security", url: "/app/settings/security", icon: <Shield className="size-4" />, isDemo: false },
  { id: "billing", label: "Billing", url: "/app/settings/billing", icon: <CreditCard className="size-4" />, isDemo: true },
  { id: "appearance", label: "Appearance", url: "/app/settings/appearance", icon: <Palette className="size-4" />, isDemo: true },
  { id: "notifications", label: "Notifications", url: "/app/settings/notifications", icon: <Bell className="size-4" />, isDemo: true },
  { id: "display", label: "Display", url: "/app/settings/display", icon: <Sliders className="size-4" />, isDemo: true },
] as const;

export default function SettingsLayout() {
  return (
    <main className="flex-1 overflow-auto p-4 md:p-10 max-w-5xl mx-auto w-full space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>

      <Separator />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Vertical Navigation Menu */}
        <aside className="w-full md:w-48 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {pageMenus.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors shrink-0"
                activeProps={{
                  className: "bg-muted text-foreground",
                }}
                inactiveProps={{
                  className: "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                }}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.isDemo && (
                  <span className="text-[9px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                    Demo
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Right Active Content Panel */}
        <div className="flex-1 max-w-2xl">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, PawPrintIcon } from "lucide-react";

import ThemeToggle from "@/components/theme-toggle/theme-toggle";
import { Button } from "@/components/ui/button";

const stack = [
  "vite + react 19",
  "tanstack router · tanstack query",
  "base-ui components · tailwind v4",
  "zod validation · react-hook-form",
  "cookie session auth, ready to go",
];

const PublicHome = () => {
  return (
    <div className="min-h-svh flex flex-col bg-background">
      <header className="flex-none h-16 flex items-center justify-between px-4 md:px-8 border-b">
        <div className="flex items-center gap-2">
          <PawPrintIcon className="w-6 h-6" />
          <span className="text-lg font-bold">React Template</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" nativeButton={false} render={<Link to="/login" />}>
            Sign in
          </Button>
          <Button nativeButton={false} render={<Link to="/register" />}>
            Get started
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 gap-10 text-center">
        <div className="flex flex-col gap-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Ship your next app without rebuilding the plumbing.
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Auth, routing, data fetching, and forms — wired up and ready.
            Fork it and start on your actual feature.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link to="/register" />}>
            Get started
            <ArrowRightIcon />
          </Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<Link to="/login" />}>
            Sign in
          </Button>
        </div>

        <div className="w-full max-w-md rounded-lg border bg-muted/40 text-left font-mono text-sm overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b bg-muted/60">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.8_0.15_95)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.7_0.15_150)]" />
          </div>
          <div className="p-4 flex flex-col gap-1.5">
            <p className="text-muted-foreground">$ stack --list</p>
            {stack.map((line) => (
              <p key={line}>
                <span className="text-[oklch(0.75_0.15_70)]">✓</span> {line}
              </p>
            ))}
            <p className="text-muted-foreground">
              $ <span className="motion-safe:animate-pulse">▍</span>
            </p>
          </div>
        </div>
      </main>

      <footer className="flex-none border-t px-4 py-6 text-center text-sm text-muted-foreground">
        React Template — fork it and make it yours.
      </footer>
    </div>
  );
};

export default PublicHome;

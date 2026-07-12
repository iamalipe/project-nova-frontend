import { Link } from "@tanstack/react-router"
import { ArrowRightIcon, PawPrintIcon } from "lucide-react"

import ThemeToggle from "@/components/theme-toggle/theme-toggle"
import { Button } from "@/components/ui/button"

const stack = [
  "vite + react 19",
  "tanstack router · tanstack query",
  "base-ui components · tailwind v4",
  "zod validation · react-hook-form",
  "cookie session auth, ready to go",
]

const PublicHome = () => {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex h-16 flex-none items-center justify-between border-b px-4 md:px-8">
        <div className="flex items-center gap-2">
          <PawPrintIcon className="h-6 w-6" />
          <span className="text-lg font-bold">React Template</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/login" />}
          >
            Sign in
          </Button>
          <Button nativeButton={false} render={<Link to="/register" />}>
            Get started
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-16 text-center md:py-24">
        <div className="flex max-w-2xl flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Ship your next app without rebuilding the plumbing.
          </h1>
          <p className="text-lg text-balance text-muted-foreground">
            Auth, routing, data fetching, and forms — wired up and ready. Fork
            it and start on your actual feature.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link to="/register" />}
          >
            Get started
            <ArrowRightIcon />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link to="/login" />}
          >
            Sign in
          </Button>
        </div>

        <div className="w-full max-w-md overflow-hidden rounded-lg border bg-muted/40 text-left font-mono text-sm">
          <div className="flex items-center gap-1.5 border-b bg-muted/60 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.8_0.15_95)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.15_150)]" />
          </div>
          <div className="flex flex-col gap-1.5 p-4">
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
  )
}

export default PublicHome

import api from "@/api/api"
import { AsyncButton } from "@/components/custom/async-button"
import ThemeToggle from "@/components/theme-toggle/theme-toggle"
import { Button } from "@/components/ui/button"
import apiQuery from "@/hooks/use-api-query"
import type { ApiNormalResponse } from "@/types/generic-type"
import { useSearch } from "@tanstack/react-router"
import { PawPrintIcon } from "lucide-react"
import { useState } from "react"

const PERMISSIONS = [
  "Full API access to list, view, create, and manage your products.",
  "Ability to establish Model Context Protocol (MCP) integrations.",
]

const OAuthConsent = () => {
  const search = useSearch({ from: "/oauth/consent" })
  const {
    client_id,
    redirect_uri,
    code_challenge,
    code_challenge_method,
    state,
  } = search

  const [error, setError] = useState<string | null>(null)

  const clientInfoQuery = apiQuery.oauth.useGetClientInfo(client_id)
  const currentUserQuery = apiQuery.auth.useGetCurrentUser()

  const clientName = clientInfoQuery.data?.data.clientName ?? "This app"
  const user = currentUserQuery.data?.data

  const userDisplayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "User"
  const avatarLetter = (
    user?.firstName?.[0] ??
    user?.email?.[0] ??
    "U"
  ).toUpperCase()

  const handleAllow = async () => {
    setError(null)
    try {
      const res = await api.oauth.consent({
        client_id,
        redirect_uri,
        code_challenge,
        code_challenge_method,
        state,
      })
      if (!res.success) {
        setError("Authorization failed, please try again.")
        return
      }
      window.location.href = res.data.redirectTo
    } catch (err) {
      const normalized = err as ApiNormalResponse
      setError(normalized?.message || "Authorization failed, please try again.")
    }
  }

  const handleDeny = () => {
    const url = new URL(redirect_uri)
    url.searchParams.set("error", "access_denied")
    url.searchParams.set("error_description", "The user denied access.")
    url.searchParams.set("state", state)
    window.location.href = url.toString()
  }

  return (
    <main className="h-full-x overflow-hidden flex items-center justify-center bg-background">
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 py-4">
        <div className="flex gap-2 items-center">
          <PawPrintIcon className="w-6 h-6" />
          <span className="text-lg font-bold">React Template</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex flex-col w-full max-w-sm mx-auto p-6 rounded-lg border bg-card">
        <div className="flex flex-col text-center gap-1">
          <span className="text-xl font-bold">App Authorization</span>
          <p className="text-sm text-muted-foreground">
            <strong>{clientName}</strong> is requesting permission to access
            your account.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-6 p-3 rounded-md border bg-muted/40">
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
            {avatarLetter}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{userDisplayName}</span>
            <span className="text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-md border">
          <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">
            Requested Permissions
          </div>
          <ul className="flex flex-col gap-2">
            {PERMISSIONS.map((permission) => (
              <li
                key={permission}
                className="flex gap-2 text-sm text-muted-foreground"
              >
                <span className="text-primary">•</span>
                <span>{permission}</span>
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <p className="text-xs text-destructive mt-4 text-center">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="outline" type="button" onClick={handleDeny}>
            Cancel
          </Button>
          <AsyncButton onClick={handleAllow} loadingText="Authorizing...">
            Allow Access
          </AsyncButton>
        </div>
      </div>
    </main>
  )
}

export default OAuthConsent

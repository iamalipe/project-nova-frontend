import * as React from "react"

// TailwindCSS breakpoint is 768px=md
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [mql] = React.useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      : null
  )

  const subscribe = React.useCallback(
    (callback: () => void) => {
      if (!mql) return () => {}
      mql.addEventListener("change", callback)
      return () => mql.removeEventListener("change", callback)
    },
    [mql]
  )

  const getSnapshot = React.useCallback(() => {
    return mql ? mql.matches : false
  }, [mql])

  const getServerSnapshot = () => false

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}


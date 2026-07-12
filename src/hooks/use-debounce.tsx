import { useCallback, useEffect, useRef } from "react"

// Define the type for the effect function
type EffectCallback = () => void | (() => void | undefined)
type DependencyList = ReadonlyArray<unknown>

export default function useDebounce(
  effect: EffectCallback,
  dependencies: DependencyList,
  delay: number,
  skipFirstRun: boolean = false
) {
  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/use-memo */
  const callback = useCallback(() => {
    effect()
  }, dependencies)
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/use-memo */
  const firstRun = useRef(true)

  useEffect(() => {
    if (skipFirstRun && firstRun.current) {
      firstRun.current = false
      return // skip on first run
    }

    const timeout = setTimeout(callback, delay)
    return () => clearTimeout(timeout)
  }, [callback, delay, skipFirstRun])
}

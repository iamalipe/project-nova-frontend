import { useRouterState } from "@tanstack/react-router"

const useIsRouteActionDisabled = () => {
  const routerState = useRouterState()

  const isDisabled = routerState.isLoading

  return isDisabled
}

export default useIsRouteActionDisabled

import { type LinkProps, useNavigate } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"

export type SortType = {
  orderBy: string
  order: "asc" | "desc"
}

// Keep this default in sync with `use-sort-client-side.tsx`.
export const DEFAULT_SORT: SortType = {
  orderBy: "",
  order: "desc",
}

/**
 * Shared state core for the sort hook pair (`useSort` / `useSortClientSide`).
 * Both variants keep the same `SortType` shape, the same default sort, and
 * the same "skip side-effects on the very first render" guard — only how
 * the resulting state is persisted/derived differs (URL navigation + server
 * refetch vs. in-memory sorting). `onSettled` runs once per state change
 * (after the first render) so each variant can plug in its own persistence
 * step without duplicating the mount-skip logic.
 */
export const useSortState = (
  initialSort: SortType | undefined,
  onChange: ((data: SortType) => void) | undefined,
  onSettled?: (data: SortType) => void,
) => {
  const [sorting, setSorting] = useState<SortType>(initialSort ?? DEFAULT_SORT)

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    onChange?.(sorting)
    onSettled?.(sorting)
  }, [sorting, onChange, onSettled])

  const onSortChange = (newSort: SortType) => {
    setSorting(newSort)
  }

  return { sorting, setSorting, onSortChange }
}

type UseSortProps = {
  initialSort?: SortType
  onChange?: (data: SortType) => void
  routeFrom: LinkProps["from"]
  navigateDisabled?: boolean
}

const useSort = (props: UseSortProps) => {
  const navigateDisabled = props.navigateDisabled ?? false

  const navigate = useNavigate({ from: props.routeFrom })

  const onSettled = (data: SortType) => {
    if (navigateDisabled) return
    navigate({
      // @ts-ignore
      search: (prev) => ({
        ...prev,
        order: data.order,
        orderBy: data.orderBy,
      }),
    })
  }

  const { sorting, setSorting, onSortChange } = useSortState(
    props.initialSort,
    props.onChange,
    onSettled,
  )

  return { state: sorting, setSorting, onSortChange }
}

export default useSort

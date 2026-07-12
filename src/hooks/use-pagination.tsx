import type { PaginationStateType } from "@/types/generic-type"
import { type LinkProps, useNavigate } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"

// Pagination is 1-indexed throughout this app (URL `page` search param,
// API `page` param, and DataTablePagination.pageIndex all start at 1 — see
// `src/lib/generic-validation.ts` and `src/hooks/use-data-table.tsx`).
// Keep this default in sync with `use-pagination-client-side.tsx`.
export const DEFAULT_PAGE_INDEX = 1
export const DEFAULT_PAGE_SIZE = 10

/**
 * Shared state core for the pagination hook pair (`usePagination` /
 * `usePaginationClientSide`). Both variants keep the same
 * `PaginationStateType` shape, the same defaults, and the same "skip
 * side-effects on the very first render" guard — only how the resulting
 * state is persisted/derived differs (URL navigation + server refetch vs.
 * in-memory slicing). `onSettled` runs once per state change (after the
 * first render) so each variant can plug in its own persistence step
 * without duplicating the mount-skip logic or risking it getting out of
 * sync between the two hooks.
 */
export const usePaginationState = (
  initialPageSize: number | undefined,
  initialPageIndex: number | undefined,
  onChange: ((data: PaginationStateType) => void) | undefined,
  onSettled?: (data: PaginationStateType) => void,
) => {
  const [pagination, setPagination] = useState<PaginationStateType>({
    pageSize: initialPageSize ?? DEFAULT_PAGE_SIZE,
    pageIndex: initialPageIndex ? initialPageIndex : DEFAULT_PAGE_INDEX,
  })

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    onChange?.(pagination)
    onSettled?.(pagination)
  }, [pagination, onChange, onSettled])

  const onPaginationChange = (pageSize: number, pageIndex: number) => {
    setPagination({ pageSize, pageIndex })
  }

  return { pagination, setPagination, onPaginationChange }
}

type UsePaginationProps = {
  initialPageSize?: number
  initialPageIndex?: number
  onChange?: (data: PaginationStateType) => void
  routeFrom: LinkProps["from"]
  navigateDisabled?: boolean
}

const usePagination = (props: UsePaginationProps) => {
  const navigateDisabled = props.navigateDisabled ?? false

  const navigate = useNavigate({ from: props.routeFrom })

  const onSettled = (data: PaginationStateType) => {
    if (navigateDisabled) return
    navigate({
      // @ts-ignore
      search: (prev) => ({
        ...prev,
        limit: data.pageSize,
        page: data.pageIndex,
      }),
    })
  }

  const { pagination, setPagination, onPaginationChange } = usePaginationState(
    props.initialPageSize,
    props.initialPageIndex,
    props.onChange,
    onSettled,
  )

  return { state: pagination, setPagination, onPaginationChange }
}

export default usePagination

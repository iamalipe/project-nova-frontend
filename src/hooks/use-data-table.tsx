import { nanoid } from "nanoid"
import { useMemo } from "react"
import type { SortType } from "./use-sort"

export type DataTableColumn<T> = {
  id?: string
  label: string
  labelRender?: (row: Required<DataTableColumn<T>>) => React.ReactNode
  key: keyof T | "select" | "action"
  isSortable?: boolean
  isHidable?: boolean
  render: (row: T) => React.ReactNode
  classNameHeader?: string
  classNameRow?: string
}

export type OnPaginationChangeProps =
  | { pageSize: number; pageIndex: number }
  | ((pagination: DataTablePagination) => {
      pageSize: number
      pageIndex: number
    })

export type OnSortingChangeProps = SortType | ((sort: SortType) => SortType)

export type DataTableRows<T> = {
  id: string
  data: T
}
export type DataTablePagination = {
  pageSize: number
  pageIndex: number
  rowCount: number
  totalPages: number
}

export type DataTableProps<T> = {
  data?: T[]
  rowCount?: number
  columnVisibility?: {
    [key: string]: boolean
  }
  columns?: DataTableColumn<T>[]
  paginationState?: {
    pageSize?: number
    pageIndex?: number
  }
  sortState?: SortType
  onPaginationChange?: (pageSize: number, pageIndex: number) => void
  onSortingChange?: (sort: SortType) => void
  onToggleVisibilityChange?: (params: { [key: string]: boolean }) => void
}

export type DataTableColumnFinal<T> = Required<DataTableColumn<T>> & {
  columnVisibility: boolean
  toggleVisibility: (visible?: boolean) => void
}
export type DataTableType<T> = {
  rows: DataTableRows<T>[]
  columns: DataTableColumnFinal<T>[]
  pagination: DataTablePagination
  sort?: SortType
  onPaginationChange: (params: OnPaginationChangeProps) => void
  getCanPreviousPage: () => boolean
  getCanNextPage: () => boolean
  onSortingChange: (param: OnSortingChangeProps) => void
  columnVisibility?: {
    [key: string]: boolean
  }
}

export const useDataTable = <T,>(props: DataTableProps<T>): DataTableType<T> => {
  // Memoized so `data`/`columns` keep a stable reference across re-renders
  // when the caller doesn't pass `data`/`columns` (or passes the same
  // array back) — otherwise `props.data || []` mints a brand new empty
  // array every render, which would defeat the id memoization below.
  const data = useMemo(() => props.data || [], [props.data])
  const columns = useMemo(() => props.columns || [], [props.columns])
  const rowCount = props.rowCount || data.length
  const paginationState = {
    pageSize: props.paginationState?.pageSize ?? rowCount,
    pageIndex: props.paginationState?.pageIndex ?? 1,
  }
  const sortState = props.sortState || { orderBy: "", order: "desc" }

  // Columns rarely supply an explicit `id`, but the fallback still needs to
  // be stable across re-renders (it's used as the column's React key and
  // drives visibility-toggle identity). Generating it inline on every call
  // would mint a new id every render and reset that identity for no reason.
  // Memoizing on the `columns` array reference means the ids stay stable
  // across re-renders caused by unrelated state changes, while still
  // regenerating if the caller ever swaps in a genuinely different columns
  // array (columns are normally defined once, outside the component).
  const fallbackColumnIds = useMemo(() => columns.map(() => nanoid()), [columns])

  const newColumns: DataTableColumnFinal<T>[] = columns.map((item, index) => {
    const findVisibility = props.columnVisibility?.[item.key as string] ?? true
    return {
      ...item,
      labelRender: item.labelRender || (() => item.label),
      isSortable: item.isSortable ?? false,
      isHidable: item.isHidable ?? true,
      classNameHeader: item.classNameHeader ?? "",
      classNameRow: item.classNameRow ?? "",
      columnVisibility: findVisibility,
      id: item.id ?? fallbackColumnIds[index],
      toggleVisibility: (visible?: boolean) => {
        if (visible === undefined) {
          props.onToggleVisibilityChange?.({
            ...props.columnVisibility,
            [item.key as string]: !findVisibility,
          })
        } else {
          props.onToggleVisibilityChange?.({
            ...props.columnVisibility,
            [item.key as string]: visible,
          })
        }
      },
    }
  })

  // Fallback ids for rows that don't carry a natural unique field. `data`
  // typically comes from an API response and gets a fresh array (and item)
  // reference on every genuine refetch, but the *same* reference across
  // re-renders caused by unrelated state changes (sibling re-render, sort
  // toggle, etc). Memoizing on the `data` reference means the fallback ids
  // stay stable across those unrelated re-renders (preserving selection /
  // visibility identity) while still regenerating on a real data refresh.
  const fallbackRowIds = useMemo(() => data.map(() => nanoid()), [data])

  const rows: DataTableRows<T>[] = data.map((item, index) => {
    const naturalId = (item as { id?: unknown; _id?: unknown })?.id ??
      (item as { id?: unknown; _id?: unknown })?._id
    return {
      id:
        typeof naturalId === "string" || typeof naturalId === "number"
          ? String(naturalId)
          : fallbackRowIds[index],
      data: item,
    }
  })

  const pagination: DataTablePagination = {
    rowCount,
    pageSize: paginationState.pageSize,
    pageIndex: paginationState.pageIndex,
    totalPages: Math.ceil(rowCount / paginationState.pageSize),
  }

  const onPaginationChange = (params: OnPaginationChangeProps) => {
    if (params instanceof Function) params = params(pagination)
    props.onPaginationChange?.(params.pageSize, params.pageIndex)
  }

  const getCanPreviousPage = () => pagination.pageIndex > 1
  const getCanNextPage = () => pagination.pageIndex < pagination.totalPages

  const onSortingChange = (params: OnSortingChangeProps) => {
    if (params instanceof Function) params = params(sortState)
    props.onSortingChange?.(params)
  }

  return {
    rows: rows,
    columns: newColumns,
    pagination,
    sort: sortState,
    onPaginationChange: onPaginationChange,
    getCanPreviousPage,
    onSortingChange,
    getCanNextPage,
    columnVisibility: props.columnVisibility,
  }
}

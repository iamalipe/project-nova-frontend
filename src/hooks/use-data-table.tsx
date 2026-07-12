import { nanoid } from "nanoid"
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
  const data = props.data || []
  const columns = props.columns || []
  const rowCount = props.rowCount || data.length
  const paginationState = {
    pageSize: props.paginationState?.pageSize ?? rowCount,
    pageIndex: props.paginationState?.pageIndex ?? 1,
  }
  const sortState = props.sortState || { orderBy: "", order: "desc" }

  const newColumns: DataTableColumnFinal<T>[] = columns.map((item) => {
    const findVisibility = props.columnVisibility?.[item.key as string] ?? true
    return {
      ...item,
      labelRender: item.labelRender || (() => item.label),
      isSortable: item.isSortable ?? false,
      isHidable: item.isHidable ?? true,
      classNameHeader: item.classNameHeader ?? "",
      classNameRow: item.classNameRow ?? "",
      columnVisibility: findVisibility,
      id: item.id ?? nanoid(),
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

  const rows: DataTableRows<T>[] = data.map((item) => {
    return {
      id: nanoid(),
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

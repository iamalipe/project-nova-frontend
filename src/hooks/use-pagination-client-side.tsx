import type { PaginationStateType } from "@/types/generic-type"
import { useMemo } from "react"
import { usePaginationState } from "./use-pagination"

type UsePaginationClientSideProps = {
  initialPageSize?: number
  initialPageIndex?: number
  onChange?: (data: PaginationStateType) => void
  data?: any[]
}

const usePaginationClientSide = (props: UsePaginationClientSideProps) => {
  const dataArray = useMemo(() => props.data || [], [props.data])

  const { pagination, setPagination, onPaginationChange } = usePaginationState(
    props.initialPageSize,
    props.initialPageIndex,
    props.onChange,
  )

  const paginatedDataArray = useMemo(() => {
    const start = (pagination.pageIndex - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return dataArray.slice(start, end)
  }, [dataArray, pagination.pageIndex, pagination.pageSize])

  return {
    state: pagination,
    setPagination,
    onPaginationChange,
    paginatedData: paginatedDataArray,
    data: dataArray,
    total: dataArray.length,
  }
}

export default usePaginationClientSide

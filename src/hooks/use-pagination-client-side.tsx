import type { PaginationStateType } from "@/types/generic-type"
import { useEffect, useMemo, useRef, useState } from "react"

type UsePaginationClientSideProps = {
  initialPageSize?: number
  initialPageIndex?: number
  onChange?: (data: PaginationStateType) => void
  data?: any[]
}

const usePaginationClientSide = (props: UsePaginationClientSideProps) => {
  const initialPageIndex = props.initialPageIndex ? props.initialPageIndex : 0
  const initialPageSize = props.initialPageSize ?? 10

  const onChange = props.onChange

  const [pagination, setPagination] = useState<PaginationStateType>({
    pageSize: initialPageSize,
    pageIndex: initialPageIndex,
  })
  const dataArray = useMemo(() => props.data || [], [props.data])

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (onChange) onChange(pagination)
  }, [pagination, onChange, dataArray])

  const onPaginationChange = (pageSize: number, pageIndex: number) => {
    setPagination({ pageSize, pageIndex })
  }

  const paginatedDataArray = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
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

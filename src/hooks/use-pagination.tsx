import type { PaginationStateType } from "@/types/generic-type"
import { type LinkProps, useNavigate } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"

type UsePaginationProps = {
  initialPageSize?: number
  initialPageIndex?: number
  onChange?: (data: PaginationStateType) => void
  routeFrom: LinkProps["from"]
  navigateDisabled?: boolean
}

const usePagination = (props: UsePaginationProps) => {
  const initialPageIndex = props.initialPageIndex ? props.initialPageIndex : 0
  const initialPageSize = props.initialPageSize ?? 10

  const onChange = props.onChange
  const navigateDisabled = props.navigateDisabled ?? false

  const navigate = useNavigate({ from: props.routeFrom })

  const [pagination, setPagination] = useState<PaginationStateType>({
    pageSize: initialPageSize,
    pageIndex: initialPageIndex,
  })

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (onChange) onChange(pagination)
    if (navigateDisabled) return
    navigate({
      // @ts-ignore
      search: (prev) => ({
        ...prev,
        limit: pagination.pageSize,
        page: pagination.pageIndex,
      }),
    })
  }, [pagination, onChange, navigate, navigateDisabled])

  const onPaginationChange = (pageSize: number, pageIndex: number) => {
    setPagination({ pageSize, pageIndex })
  }

  return { state: pagination, setPagination, onPaginationChange }
}

export default usePagination

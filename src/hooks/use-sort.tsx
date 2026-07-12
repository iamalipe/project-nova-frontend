import { type LinkProps, useNavigate } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"

export type SortType = {
  orderBy: string
  order: "asc" | "desc"
}

type UseSortProps = {
  initialSort?: SortType
  onChange?: (data: SortType) => void
  routeFrom: LinkProps["from"]
  navigateDisabled?: boolean
}

const useSort = (props: UseSortProps) => {
  const initialSort = props.initialSort ?? {
    orderBy: "",
    order: "desc",
  }

  const onChange = props.onChange
  const navigateDisabled = props.navigateDisabled ?? false

  const navigate = useNavigate({ from: props.routeFrom })

  const [sorting, setSorting] = useState<SortType>(initialSort)

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (onChange) onChange(sorting)
    if (navigateDisabled) return
    navigate({
      // @ts-ignore
      search: (prev) => ({
        ...prev,
        order: sorting.order,
        orderBy: sorting.orderBy,
      }),
    })
  }, [sorting, onChange, navigate, navigateDisabled])

  const onSortChange = (newSort: SortType) => {
    setSorting(newSort)
  }

  return { state: sorting, setSorting, onSortChange }
}

export default useSort

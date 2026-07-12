import dayjs from "dayjs"
import { useEffect, useMemo, useRef, useState } from "react"

export type SortType = {
  orderBy: string
  order: "asc" | "desc"
}

type UseSortClientSideProps = {
  initialSort?: SortType
  onChange?: (data: SortType) => void
  data?: any[]
}

const useSortClientSide = (props: UseSortClientSideProps) => {
  const initialSort = props.initialSort ?? {
    orderBy: "",
    order: "desc",
  }

  const onChange = props.onChange

  const [sorting, setSorting] = useState<SortType>(initialSort)
  const dataArray = useMemo(() => props.data || [], [props.data])
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (onChange) onChange(sorting)
  }, [sorting, onChange])

  const onSortChange = (newSort: SortType) => {
    setSorting(newSort)
  }

  const sortedDataArray = useMemo(() => {
    if (!sorting.orderBy) return dataArray

    const { orderBy, order } = sorting

    return [...dataArray].sort((a, b) => {
      const aValue = a[orderBy]
      const bValue = b[orderBy]

      // 1. Handle Missing/Null/Undefined values first
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return order === "asc" ? -1 : 1
      if (bValue == null) return order === "asc" ? 1 : -1

      // 2. Determine and Normalize Values for Comparison
      let finalA = aValue
      let finalB = bValue
      let type = typeof aValue

      // A. Day.js Date Handling
      const dateA = dayjs(aValue)
      const dateB = dayjs(bValue)

      // Check if BOTH values are valid Day.js dates
      if (dateA.isValid() && dateB.isValid()) {
        finalA = dateA.valueOf() // Get numeric timestamp
        finalB = dateB.valueOf() // Get numeric timestamp
        // eslint-disable-next-line no-useless-assignment
        type = "number" // Treat as number for comparison
      }
      // B. Case-Insensitive String Handling
      else if (type === "string" && typeof bValue === "string") {
        finalA = aValue.toLowerCase()
        finalB = bValue.toLowerCase()
      }
      // C. Numbers/Booleans/Other compare correctly as is

      // 3. Final Comparison logic
      let comparison = 0
      if (finalA < finalB) {
        comparison = -1
      } else if (finalA > finalB) {
        comparison = 1
      }

      // Apply sort order
      return order === "asc" ? comparison : comparison * -1
    })
  }, [sorting, dataArray])

  return {
    state: sorting,
    setSorting,
    onSortChange,
    sortedData: sortedDataArray,
  }
}

export default useSortClientSide

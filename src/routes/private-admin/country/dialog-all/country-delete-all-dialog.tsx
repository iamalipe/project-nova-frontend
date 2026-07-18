import type { CountryType } from "@/api/country-api"
import DataTable from "@/components/data-table/data-table"
import TableFooter from "@/components/data-table/table-footer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import apiQuery from "@/hooks/use-api-query"
import { useDataTable } from "@/hooks/use-data-table"
import usePaginationClientSide from "@/hooks/use-pagination-client-side"
import useQueryLoadingState from "@/hooks/use-query-loading-state"
import useSortClientSide from "@/hooks/use-sort-client-side"
import type { DialogStateType } from "@/routes/private-admin/private-admin-route"
import { useNavigate } from "@tanstack/react-router"
import tableColumns from "../table-columns"

export type CountryDialogAllProps = {
  state: DialogStateType
  data?: CountryType[]
}

const CountryDialogAll = ({ state }: CountryDialogAllProps) => {
  const countryQuery = apiQuery.country.useGetAll({ page: 1, limit: 100 })
  const { isLoading } = useQueryLoadingState([countryQuery])

  if (isLoading) return <DialogSkeleton />

  return <DialogMain state={state} data={countryQuery?.data?.data} />
}

export default CountryDialogAll

const DialogSkeleton = () => {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-h-[80vh] sm:max-w-[600px] animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="h-10 w-full bg-muted rounded mb-2" />
        <div className="h-20 w-full bg-muted rounded" />
      </DialogContent>
    </Dialog>
  )
}

const DialogMain = ({ data }: CountryDialogAllProps) => {
  const navigate = useNavigate()

  const onClose = () => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  const sort = useSortClientSide({
    data: data || [],
  })

  const pagination = usePaginationClientSide({
    initialPageSize: 10,
    initialPageIndex: 0,
    data: sort.sortedData,
  })

  const dataTable = useDataTable({
    data: pagination.paginatedData,
    columns: tableColumns,
    rowCount: pagination.total,
    paginationState: pagination.state,
    sortState: sort.state,
    onPaginationChange: pagination.onPaginationChange,
    onSortingChange: sort.onSortChange,
  })

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="flex flex-col sm:max-h-[80vh] sm:max-w-[1200px]">
        <DialogHeader className="flex-none">
          <DialogTitle>All Countries</DialogTitle>
          <DialogDescription>
            Audit and view all countries in the system.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col gap-2 overflow-hidden md:gap-4">
          <DataTable dataTable={dataTable} />
          <TableFooter dataTable={dataTable} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

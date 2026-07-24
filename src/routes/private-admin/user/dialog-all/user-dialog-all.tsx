import type { UserType } from "@/api/user-api"
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
import DialogSkeleton from "../../product/dialog/dialog-skeleton"

export type UserDialogProps = {
  state: DialogStateType
  data?: UserType[]
}

const UserDialogAll = ({ state }: UserDialogProps) => {
  const userQuery = apiQuery.user.useGetAll({ page: 1, limit: 100 })
  const { isLoading } = useQueryLoadingState([userQuery])

  if (isLoading) return <DialogSkeleton />

  return <DialogMain state={state} data={userQuery?.data?.data} />
}

export default UserDialogAll

const DialogMain = ({ data }: UserDialogProps) => {
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
          <DialogTitle>All Users</DialogTitle>
          <DialogDescription>
            Comprehensive directory of registered users, roles, salary, and contact details.
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

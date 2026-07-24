import type { StockTransactionType } from "@/api/stock-transaction-api";
import DataTable from "@/components/data-table/data-table";
import TableFooter from "@/components/data-table/table-footer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import apiQuery from "@/hooks/use-api-query";
import { useDataTable } from "@/hooks/use-data-table";
import usePaginationClientSide from "@/hooks/use-pagination-client-side";
import useQueryLoadingState from "@/hooks/use-query-loading-state";
import useSortClientSide from "@/hooks/use-sort-client-side";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import { useNavigate } from "@tanstack/react-router";
import DialogSkeleton from "../dialog/dialog-skeleton";
import tableColumns from "../table-columns";

export default function StockTransactionDialogAll({ state }: { state: DialogStateType }) {
  const transactionQuery = apiQuery.stockTransaction.useGetAll({ page: 0 });
  const { isLoading } = useQueryLoadingState([transactionQuery]);

  if (isLoading) return <DialogSkeleton />;

  return <DialogMain state={state} data={transactionQuery?.data?.data} />;
}

const DialogMain = ({ data }: { state: DialogStateType; data?: StockTransactionType[] }) => {
  const navigate = useNavigate({ from: "/app/stock-transaction" });

  const onClose = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    });
  };

  const sort = useSortClientSide({
    data: data || [],
  });

  const pagination = usePaginationClientSide({
    initialPageSize: 10,
    initialPageIndex: 0,
    data: sort.sortedData,
  });

  const dataTable = useDataTable({
    data: pagination.paginatedData,
    columns: tableColumns,
    rowCount: pagination.total,
    paginationState: pagination.state,
    sortState: sort.state,
    onPaginationChange: pagination.onPaginationChange,
    onSortingChange: sort.onSortChange,
  });

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="flex flex-col sm:max-h-[80vh] sm:max-w-[1200px]">
        <DialogHeader className="flex-none">
          <DialogTitle>All Stock Transactions</DialogTitle>
          <DialogDescription>Audit and view all transfer manifests in the system.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col gap-2 overflow-hidden md:gap-4">
          <DataTable dataTable={dataTable} />
          <TableFooter dataTable={dataTable} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

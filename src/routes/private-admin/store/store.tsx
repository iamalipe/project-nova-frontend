import type { ApiStoreGetAll } from "@/api/store-api";
import DataTable from "@/components/data-table/data-table";
import TableFooter from "@/components/data-table/table-footer";
import { useDataTable } from "@/hooks/use-data-table";
import usePagination from "@/hooks/use-pagination";
import useSort from "@/hooks/use-sort";
import { useTableVisibility } from "@/store/use-table-columns-visibility-store";
import type { ApiNormalResponse } from "@/types/generic-type";
import type { UseQueryResult } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import ActionControls from "./action-controls";
import { TableActionContextMenu, TableSelectAction } from "./table-action";
import tableColumns from "./table-columns";

const STORE_ROUTE_FROM = "/app/store";

type StoreProps = {
  rawQuery: UseQueryResult<ApiStoreGetAll, ApiNormalResponse | Error>;
};

const Store = ({ rawQuery }: StoreProps) => {
  const queryData = rawQuery.data;
  if (!queryData) throw Error("Something wrong");

  const tableVisibility = useTableVisibility("store");

  const pagination = usePagination({
    initialPageSize: queryData.pagination.limit,
    initialPageIndex: queryData.pagination.page,
    routeFrom: STORE_ROUTE_FROM,
  });

  const sort = useSort({
    initialSort: queryData.sort,
    routeFrom: STORE_ROUTE_FROM,
  });

  const dataTable = useDataTable({
    data: queryData.data,
    columns: tableColumns,
    rowCount: queryData.pagination.total,
    paginationState: pagination.state,
    columnVisibility: tableVisibility.state,
    onToggleVisibilityChange: tableVisibility.toggleVisibility,
    sortState: sort.state,
    onPaginationChange: pagination.onPaginationChange,
    onSortingChange: sort.onSortChange,
  });

  return (
    <>
      <main className="flex-1 overflow-hidden flex flex-col p-2 pl-0 gap-2">
        <ActionControls rawQuery={rawQuery} dataTable={dataTable} />
        <DataTable
          dataTable={dataTable}
          contextMenu={(data) => <TableActionContextMenu data={data} />}
        />
        <TableFooter dataTable={dataTable} />
        <TableSelectAction />
      </main>
      <Outlet />
    </>
  );
};

export default Store;

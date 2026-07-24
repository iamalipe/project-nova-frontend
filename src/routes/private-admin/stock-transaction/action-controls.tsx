import type { ApiStockTransactionGetAll } from "@/api/stock-transaction-api";
import { AsyncRefreshButton } from "@/components/custom/async-button";
import ColumnsViewControls from "@/components/data-table/columns-view-controls";
import SearchInput from "@/components/data-table/search-input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import apiQuery from "@/hooks/use-api-query";
import type { DataTableType } from "@/hooks/use-data-table";
import { validateAndStringify } from "@/lib/generic-validation";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { UseQueryResult } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Plus, Upload } from "lucide-react";
import { dialogStateZodSchema } from "../private-admin-route";

const STOCK_TRANSACTION_ROUTE_FROM = "/app/stock-transaction";
const STOCK_TRANSACTION_DIALOG = "StockTransaction";

export type ActionControlsProps<T> = {
  dataTable: DataTableType<T>;
  rawQuery: UseQueryResult<ApiStockTransactionGetAll, ApiNormalResponse | Error>;
};

const ActionControls = <T,>(props: ActionControlsProps<T>) => {
  const { dataTable, rawQuery } = props;
  const queryData = rawQuery.data;
  if (!queryData) throw Error("Something wrong");

  const navigate = useNavigate({ from: STOCK_TRANSACTION_ROUTE_FROM });
  const searchParam = useSearch({
    from: STOCK_TRANSACTION_ROUTE_FROM,
  });

  const { data: currentUserRes } = apiQuery.auth.useGetCurrentUser();
  const isSUPERUSER = currentUserRes?.data?.role === "SUPERUSER";

  const onRefresh = async () => {
    await rawQuery.refetch();
  };

  const onCreate = async () => {
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: STOCK_TRANSACTION_DIALOG,
      mode: "CREATE",
    });
    if (!ds) return;
    navigate({
      search: (prev: any) => ({
        ...prev,
        ds: ds,
      }),
    });
  };

  const onImport = async () => {
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: STOCK_TRANSACTION_DIALOG,
      mode: "IMPORT",
    });
    if (!ds) return;
    navigate({
      search: (prev: any) => ({
        ...prev,
        ds: ds,
      }),
    });
  };

  const onAllTransactions = async () => {
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: STOCK_TRANSACTION_DIALOG,
      mode: "VIEW-ALL",
    });
    if (!ds) return;
    navigate({
      search: (prev: any) => ({
        ...prev,
        ds: ds,
      }),
    });
  };

  const onSearchChange = async (searchValue: string) => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        search: searchValue,
      }),
    });
  };

  const tableConfig: TableConfigType = queryData.config || {
    search: true,
    searchPlaceholder: "Search transaction...",
  };

  return (
    <div className="flex flex-none justify-between">
      <div className="flex gap-2">
        <SidebarTrigger variant="outline" />
        {tableConfig.search && (
          <SearchInput
            value={searchParam.search}
            onChange={onSearchChange}
            placeholder={tableConfig.searchPlaceholder}
          />
        )}
      </div>
      <div className="flex gap-2">
        <Button title="All Transactions" variant="outline" onClick={onAllTransactions}>
          All Transactions
        </Button>
        <Button
          title="Create New"
          size="icon"
          variant="outline"
          onClick={onCreate}
        >
          <Plus />
        </Button>
        {isSUPERUSER && (
          <Button
            title="Import CSV"
            size="icon"
            variant="outline"
            onClick={onImport}
          >
            <Upload />
          </Button>
        )}
        <AsyncRefreshButton
          title="Refresh"
          variant="outline"
          onClick={onRefresh}
        />
        <ColumnsViewControls dataTable={dataTable} />
      </div>
    </div>
  );
};

export default ActionControls;

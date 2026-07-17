import type { ApiProductGetAll } from "@/api/product-api";
import { AsyncRefreshButton } from "@/components/custom/async-button";
import ColumnsViewControls from "@/components/data-table/columns-view-controls";
import SearchInput from "@/components/data-table/search-input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { DataTableType } from "@/hooks/use-data-table";
import { validateAndStringify } from "@/lib/generic-validation";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { UseQueryResult } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Plus, Upload } from "lucide-react";
import { dialogStateZodSchema } from "../private-admin-route";
import apiQuery from "@/hooks/use-api-query";
import { ProductFilterSheet } from "./product-filter-sheet";

const PRODUCT_ROUTE_FROM = "/app/product";
const PRODUCT_DIALOG = "Product";

export type ActionControlsProps<T> = {
  dataTable: DataTableType<T>;
  rawQuery: UseQueryResult<ApiProductGetAll, ApiNormalResponse | Error>;
};

const ActionControls = <T,>(props: ActionControlsProps<T>) => {
  const { dataTable, rawQuery } = props;
  const queryData = rawQuery.data;
  if (!queryData) throw Error("Something wrong");

  const navigate = useNavigate({ from: PRODUCT_ROUTE_FROM });
  const searchParam = useSearch({
    from: PRODUCT_ROUTE_FROM,
  });

  const { data: currentUserRes } = apiQuery.auth.useGetCurrentUser();
  const isSuperuser = currentUserRes?.data?.role === "superuser";

  const onRefresh = async () => {
    await rawQuery.refetch();
  };

  const onCreate = async () => {
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: PRODUCT_DIALOG,
      mode: "CREATE",
    });
    if (!ds) return;
    navigate({
      search: (prev) => ({
        ...prev,
        ds: ds,
      }),
    });
  };

  const onImport = async () => {
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: PRODUCT_DIALOG,
      mode: "IMPORT",
    });
    if (!ds) return;
    navigate({
      search: (prev) => ({
        ...prev,
        ds: ds,
      }),
    });
  };

  const onAllProducts = async () => {
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: PRODUCT_DIALOG,
      mode: "VIEW-ALL",
    });
    if (!ds) return;
    navigate({
      search: (prev) => ({
        ...prev,
        ds: ds,
      }),
    });
  };

  const onSearchChange = async (searchValue: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: searchValue,
      }),
    });
  };

  const tableConfig: TableConfigType = queryData.config || {
    search: true,
    searchPlaceholder: "Search...",
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
        <ProductFilterSheet />
      </div>
      <div className="flex gap-2">
        <Button title="All Products" variant="outline" onClick={onAllProducts}>
          All Products
        </Button>
        {isSuperuser && (
          <>
            <Button
              title="Create New"
              size="icon"
              variant="outline"
              data-testid="create-new-button"
              onClick={onCreate}
            >
              <Plus />
            </Button>
            <Button
              title="Import CSV"
              size="icon"
              variant="outline"
              onClick={onImport}
            >
              <Upload />
            </Button>
          </>
        )}
        <AsyncRefreshButton
          title="Refresh"
          variant="outline"
          onClick={onRefresh}
          data-testid="refresh-button"
        />
        <ColumnsViewControls dataTable={dataTable} />
      </div>
    </div>
  );
};

export default ActionControls;

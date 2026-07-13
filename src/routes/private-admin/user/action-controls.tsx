import type { ApiUserGetAll } from "@/api/user-api";
import { AsyncRefreshButton } from "@/components/custom/async-button";
import ColumnsViewControls from "@/components/data-table/columns-view-controls";
import SearchInput from "@/components/data-table/search-input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { DataTableType } from "@/hooks/use-data-table";
import type { ApiNormalResponse, TableConfigType } from "@/types/generic-type";
import type { UseQueryResult } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";

const USER_ROUTE_FROM = "/app/user";

export type ActionControlsProps<T> = {
  dataTable: DataTableType<T>;
  rawQuery: UseQueryResult<ApiUserGetAll, ApiNormalResponse | Error>;
};

const ActionControls = <T,>(props: ActionControlsProps<T>) => {
  const { dataTable, rawQuery } = props;
  const queryData = rawQuery.data;
  if (!queryData) throw Error("Something wrong");

  const navigate = useNavigate({ from: USER_ROUTE_FROM });
  const searchParam = useSearch({
    from: USER_ROUTE_FROM,
  });

  const onRefresh = async () => {
    await rawQuery.refetch();
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
      </div>
      <div className="flex gap-2">
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

import type { DataTableType } from "@/hooks/use-data-table";
import TableLimit from "./table-limit";
import TablePagination from "./table-pagination";

export type TableFooterProps<T> = {
  dataTable: DataTableType<T>;
};
const TableFooter = <T,>(props: TableFooterProps<T>) => {
  const { dataTable } = props;

  return (
    <div className="flex md:items-center md:flex-row flex-col justify-between px-2 py-1 flex-none">
      <div className="text-xs text-muted-foreground max-md:mb-2 max-md:justify-between flex md:flex-col">
        <span>
          Total : {dataTable.pagination.rowCount} • Page:{" "}
          {dataTable.pagination.pageIndex} of {dataTable.pagination.totalPages}
        </span>
      </div>
      <div className="flex md:items-center gap-2">
        <TableLimit dataTable={dataTable} />
        <TablePagination dataTable={dataTable} />
      </div>
    </div>
  );
};

export default TableFooter;

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataTableType } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import TableSortHeader from "./table-sort-header";

export type DataTableProps<T> = {
  dataTable: DataTableType<T>;
  contextMenu?: (data: T) => React.ReactNode;
};

const DataTable = <T,>(props: DataTableProps<T>) => {
  const { dataTable, contextMenu } = props;

  const visibleColumns = useMemo(
    () => dataTable.columns.filter((item) => item.columnVisibility),
    [dataTable.columns]
  );

  return (
    <>
      <DataTableMobile dataTable={dataTable} />
      <Table>
        <TableHeader className="z-10">
          <TableRow className="border-b-0 table-header-box-shadow">
            {visibleColumns.map((item) =>
              item.isSortable ? (
                <TableSortHeader
                  dataTable={dataTable}
                  key={item.id}
                  item={item}
                />
              ) : (
                <TableHead
                  className={cn(["min-w-10", item.classNameHeader])}
                  key={item.id}
                  data-testid={item.key}
                >
                  {item.labelRender ? item.labelRender(item) : item.label}
                </TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataTable.rows.map((item) => {
            if (contextMenu)
              return (
                <ContextMenu key={item.id as string}>
                  <ContextMenuTrigger render={<TableRow />}>
                    {visibleColumns.map((colItem) => {
                      return (
                        <TableCell
                          key={colItem.id}
                          className={cn([colItem.classNameRow])}
                          onContextMenu={(e) => {
                            if (
                              colItem.key === "action" ||
                              colItem.key === "select"
                            )
                              e.preventDefault();
                          }}
                        >
                          {colItem.render(item.data)}
                        </TableCell>
                      );
                    })}
                  </ContextMenuTrigger>
                  {contextMenu?.(item.data)}
                </ContextMenu>
              );
            return (
              <TableRow key={item.id as string}>
                {visibleColumns.map((colItem) => {
                  return (
                    <TableCell
                      key={colItem.id}
                      className={cn([colItem.classNameRow])}
                    >
                      {colItem.render(item.data)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
const DataTableMobile = <T,>(props: DataTableProps<T>) => {
  const { dataTable } = props;

  const columnVisibility = dataTable.columns.filter(
    (item) => item.columnVisibility
  );

  return (
    <>
      <div className="flex flex-col md:hidden relative w-full overflow-auto flex-1 scrollbar-thin gap-4">
        {dataTable?.rows.map((item) => (
          <div key={item.id} className="px-2 flex flex-col rounded-md border">
            {columnVisibility.map((colItem, index) => (
              <div
                key={colItem.id}
                className={cn([
                  "p-2 flex",
                  columnVisibility.length - 1 !== index && "border-b",
                ])}
              >
                <div className="w-2/5">{colItem.label}</div>
                <div className="text-sm text-muted-foreground w-3/5">
                  {colItem.render(item.data)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default DataTable;

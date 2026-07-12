import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DataTableType } from "@/hooks/use-data-table"
import { cn } from "@/lib/utils"
import { useMemo } from "react"
import TableSortHeader from "./table-sort-header"

export type DataTableProps<T> = {
  dataTable: DataTableType<T>
  contextMenu?: (data: T) => React.ReactNode
  emptyMessage?: string
}

const DataTable = <T,>(props: DataTableProps<T>) => {
  const { dataTable, contextMenu, emptyMessage } = props

  const visibleColumns = useMemo(
    () => dataTable.columns.filter((item) => item.columnVisibility),
    [dataTable.columns]
  )

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
        {dataTable.rows.length > 0 ? (
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
                                e.preventDefault()
                            }}
                          >
                            {colItem.render(item.data)}
                          </TableCell>
                        )
                      })}
                    </ContextMenuTrigger>
                    {contextMenu?.(item.data)}
                  </ContextMenu>
                )
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
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        ) : (
          <TableCaption className="mb-4">
            {emptyMessage || "No record found."}
          </TableCaption>
        )}
      </Table>
    </>
  )
}
const DataTableMobile = <T,>(props: DataTableProps<T>) => {
  const { dataTable } = props

  const columnVisibility = dataTable.columns.filter(
    (item) => item.columnVisibility
  )

  return (
    <>
      <div className="relative flex w-full flex-1 scrollbar-thin flex-col gap-4 overflow-auto md:hidden">
        {dataTable?.rows.map((item) => (
          <div key={item.id} className="flex flex-col rounded-md border px-2">
            {columnVisibility.map((colItem, index) => (
              <div
                key={colItem.id}
                className={cn([
                  "flex p-2",
                  columnVisibility.length - 1 !== index && "border-b",
                ])}
              >
                <div className="w-2/5">{colItem.label}</div>
                <div className="w-3/5 text-sm text-muted-foreground">
                  {colItem.render(item.data)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default DataTable

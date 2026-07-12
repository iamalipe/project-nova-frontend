import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableHead } from "@/components/ui/table";
import type { DataTableColumnFinal, DataTableType } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";

export type TableSortHeaderProps<T> = {
  dataTable: DataTableType<T>;
  item: DataTableColumnFinal<T>;
};

const TableSortHeader = <T,>(props: TableSortHeaderProps<T>) => {
  const { dataTable, item } = props;

  const findSort = dataTable.sort?.orderBy === item.key;

  const ordered = findSort ? dataTable.sort?.order : undefined;

  return (
    <TableHead key={item.id} data-testid={item.key}>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
              data-testid={`${item.key as string}-sort-button`}
            >
              <span>{item.label}</span>
              {ordered === "asc" ? (
                <ArrowUp />
              ) : ordered === "desc" ? (
                <ArrowDown />
              ) : (
                <ChevronsUpDown />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              // isTableHeader
              data-testid={`${item.key as string}-sort-asc`}
              className={cn({ "text-primary": ordered === "asc" })}
              onClick={() =>
                ordered === "asc"
                  ? dataTable.onSortingChange?.({
                      order: "desc",
                      orderBy: "",
                    })
                  : dataTable.onSortingChange?.({
                      orderBy: item.key as string,
                      order: "asc",
                    })
              }
            >
              <ArrowUp
                className={cn("h-3.5 w-3.5 text-muted-foreground/70", {
                  "text-primary": ordered === "asc",
                })}
              />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem
              // isTableHeader
              className={cn({ "text-primary": ordered === "desc" })}
              data-testid={`${item.key as string}-sort-desc`}
              onClick={() =>
                ordered === "desc"
                  ? dataTable.onSortingChange?.({
                      order: "desc",
                      orderBy: "",
                    })
                  : dataTable.onSortingChange?.({
                      orderBy: item.key as string,
                      order: "desc",
                    })
              }
            >
              <ArrowDown
                className={cn("h-3.5 w-3.5 text-muted-foreground/70", {
                  "text-primary": ordered === "desc",
                })}
              />
              Desc
            </DropdownMenuItem>
            {item.isHidable && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  // isTableHeader
                  onClick={() => item.toggleVisibility(false)}
                  data-testid={`${item.key as string}-hide-column`}
                >
                  <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Hide
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableHead>
  );
};

export default TableSortHeader;

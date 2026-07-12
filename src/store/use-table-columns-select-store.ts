import { useCallback, useMemo } from "react";
import { create } from "zustand";

export type RowsSelect = {
  tableKey: string;
  selected: string[];
};

export type TableRowsSelectStore = {
  tables: RowsSelect[];
  changeRowSelect: (
    tableKey: string,
    updater: string[] | ((columns: string[]) => string[])
  ) => void;
};

const useTableRowsSelectStore = create<TableRowsSelectStore>((set) => ({
  tables: [],
  changeRowSelect: (tableKey, updater) => {
    set((state) => {
      const findIndex = state.tables.findIndex((e) => e.tableKey === tableKey);
      const tables = [...state.tables];
      if (findIndex !== -1) {
        if (updater instanceof Function) {
          tables[findIndex] = {
            ...tables[findIndex],
            selected: updater(tables[findIndex].selected),
          };
        } else {
          tables[findIndex] = { ...tables[findIndex], selected: updater };
        }
      } else {
        if (updater instanceof Function) {
          const newColumns = {
            tableKey: tableKey,
            selected: updater([]),
          };
          tables.push(newColumns);
        } else {
          const newColumns = {
            tableKey: tableKey,
            selected: updater,
          };
          tables.push(newColumns);
        }
      }

      return { ...state, tables: tables };
    });
  },
}));

export const useTableRowsSelect = (
  tableKey: string,
  defaultSelected: string[] = []
) => {
  const rowsState = useTableRowsSelectStore((state) => state.tables);
  const changeRowSelect = useTableRowsSelectStore(
    (state) => state.changeRowSelect
  );

  const rows = rowsState.find((tables) => tables.tableKey === tableKey);

  // Initialize with default values if columns don't exist
  if (!rows) {
    changeRowSelect(tableKey, defaultSelected);
  }

  const toggleRowSelect = (rowId: string) => {
    changeRowSelect(tableKey, (selected) => {
      if (selected.includes(rowId)) {
        return selected.filter((id) => id !== rowId);
      }
      return [...selected, rowId];
    });
  };
  const isRowSelect = (rowId: string) => {
    return rows?.selected.includes(rowId);
  };

  const selectedRows = useMemo(() => rows?.selected || [], [rows]);

  const clearRowSelect = useCallback(() => {
    if (selectedRows.length > 0) changeRowSelect(tableKey, []);
  }, [selectedRows, changeRowSelect, tableKey]);

  return {
    selectedRows: rows?.selected || [],
    toggleRowSelect,
    isRowSelect,
    clearRowSelect,
  };
};

export default useTableRowsSelectStore;

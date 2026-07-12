import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ColumnsVisibility = {
  tableKey: string;
  columns: {
    [key: string]: boolean;
  };
};

export type TableColumnsVisibilityStore = {
  tables: ColumnsVisibility[];
  toggleTableVisibility: (
    tableKey: string,
    updater:
      | {
          [key: string]: boolean;
        }
      | ((columns: { [key: string]: boolean }) => { [key: string]: boolean })
  ) => void;
};

const useTableColumnsVisibilityStore = create(
  persist<TableColumnsVisibilityStore>(
    (set) => ({
      tables: [],
      toggleTableVisibility: (tableKey, updater) => {
        set((state) => {
          const findIndex = state.tables.findIndex(
            (e) => e.tableKey === tableKey
          );
          const tables = [...state.tables];
          if (findIndex !== -1) {
            if (updater instanceof Function) {
              tables[findIndex] = {
                ...tables[findIndex],
                columns: updater(tables[findIndex].columns),
              };
            } else {
              tables[findIndex] = { ...tables[findIndex], columns: updater };
            }
          } else {
            if (updater instanceof Function) {
              const newColumns = {
                tableKey: tableKey,
                columns: updater({}),
              };
              tables.push(newColumns);
            } else {
              const newColumns = {
                tableKey: tableKey,
                columns: updater,
              };
              tables.push(newColumns);
            }
          }

          return { ...state, tables: tables };
        });
      },
    }),
    {
      name: "columns-view",
    }
  )
);

export const useTableVisibility = (
  tableKey: string,
  defaultKeys: string[] = []
) => {
  const columnsState = useTableColumnsVisibilityStore((state) => state.tables);
  const toggleTableVisibility = useTableColumnsVisibilityStore(
    (state) => state.toggleTableVisibility
  );

  const columns = columnsState.find((tables) => tables.tableKey === tableKey);

  // Initialize with default values if columns don't exist
  if (!columns) {
    const defaultColumns = defaultKeys.reduce((acc, key) => {
      acc[key] = false; // Set all default columns to visible
      return acc;
    }, {} as { [key: string]: boolean });

    toggleTableVisibility(tableKey, defaultColumns);
  }

  const toggleVisibility = (params: { [key: string]: boolean }) => {
    toggleTableVisibility(tableKey, params);
  };

  return { state: columns?.columns, toggleVisibility: toggleVisibility };
};

export default useTableColumnsVisibilityStore;

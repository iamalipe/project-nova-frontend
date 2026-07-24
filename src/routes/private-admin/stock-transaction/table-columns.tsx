import type { StockTransactionType } from "@/api/stock-transaction-api";
import { Badge } from "@/components/ui/badge";
import type { DataTableColumn } from "@/hooks/use-data-table";
import { formatDate } from "@/lib/date-time";
import { TableAction, TableRowsSelect } from "./table-action";

const statusVariants: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  IN_TRANSIT: "bg-blue-50 text-blue-700 border-blue-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const tableColumns: DataTableColumn<StockTransactionType>[] = [
  {
    key: "select",
    label: "Select",
    labelRender: () => <TableRowsSelect type="header" />,
    isSortable: false,
    isHidable: false,
    render: (record) => <TableRowsSelect type="row" data={record} />,
    classNameHeader: "w-10",
    classNameRow: "w-10",
  },
  {
    label: "Source Location",
    key: "id",
    render: (record) =>
      record.fromStore
        ? `Store: ${record.fromStore.name}`
        : record.fromWarehouse
        ? `Warehouse: ${record.fromWarehouse.name}`
        : "Main Supply Hub",
    isSortable: false,
    classNameRow: "font-bold",
  },
  {
    label: "Items Count",
    key: "travelCost",
    render: (record) => `${record.products.length} product(s)`,
    isSortable: false,
  },
  {
    label: "Travel Cost",
    key: "travelCost",
    render: (record) => `$${record.travelCost.toLocaleString()}`,
    isSortable: true,
  },
  {
    label: "Status",
    key: "status",
    render: (record) => (
      <Badge variant="outline" className={statusVariants[record.status] || ""}>
        {record.status}
      </Badge>
    ),
    isSortable: true,
  },
  {
    label: "Transaction Date",
    key: "transactionDate",
    render: (record) => formatDate(record.transactionDate),
    isSortable: true,
  },
  {
    label: "Action",
    key: "action",
    render: (record) => <TableAction data={record} />,
    isSortable: false,
    classNameHeader: "w-10",
    classNameRow: "w-10",
  },
];

export default tableColumns;

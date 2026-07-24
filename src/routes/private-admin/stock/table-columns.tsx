import type { StockType } from "@/api/stock-api";
import { Badge } from "@/components/ui/badge";
import type { DataTableColumn } from "@/hooks/use-data-table";
import { formatDate } from "@/lib/date-time";
import { TableAction, TableRowsSelect } from "./table-action";

const tableColumns: DataTableColumn<StockType>[] = [
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
    label: "Product",
    key: "productId",
    render: (record) => record.product?.name || record.productId,
    isSortable: true,
    classNameRow: "font-bold",
  },
  {
    label: "SKU",
    key: "id",
    render: (record) => record.product?.sku || "-",
    isSortable: false,
    classNameRow: "font-mono text-xs",
  },
  {
    label: "Location Type",
    key: "storeId",
    render: (record) =>
      record.storeId ? (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Store
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Warehouse
        </Badge>
      ),
    isSortable: false,
  },
  {
    label: "Location Name",
    key: "warehouseId",
    render: (record) => record.store?.name || record.warehouse?.name || "-",
    isSortable: false,
  },
  {
    label: "Quantity",
    key: "quantity",
    render: (record) => {
      const isLow = record.minThreshold !== null && record.quantity <= record.minThreshold;
      return (
        <span className={`font-mono font-bold ${isLow ? "text-destructive" : ""}`}>
          {record.quantity} {isLow && "(Low Stock)"}
        </span>
      );
    },
    isSortable: true,
  },
  {
    label: "Min Threshold",
    key: "minThreshold",
    render: (record) => (record.minThreshold !== null ? record.minThreshold : "-"),
    isSortable: true,
  },
  {
    label: "Last Updated",
    key: "lastUpdated",
    render: (record) => formatDate(record.lastUpdated),
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

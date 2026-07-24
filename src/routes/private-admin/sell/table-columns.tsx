import type { SellType } from "@/api/sell-api";
import type { DataTableColumn } from "@/hooks/use-data-table";
import { formatDate } from "@/lib/date-time";
import { TableAction, TableRowsSelect } from "./table-action";

const tableColumns: DataTableColumn<SellType>[] = [
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
    label: "Store",
    key: "storeId",
    render: (record) => record.store?.name || record.storeId,
    isSortable: true,
  },
  {
    label: "Customer",
    key: "customerId",
    render: (record) =>
      record.customer
        ? `${record.customer.firstName} ${record.customer.lastName || ""}`
        : record.customerId,
    isSortable: true,
  },
  {
    label: "Staff Member",
    key: "staffId",
    render: (record) =>
      record.staff
        ? `${record.staff.firstName} ${record.staff.lastName || ""}`
        : record.staffId,
    isSortable: true,
  },
  {
    label: "Qty",
    key: "quantity",
    render: (record) => record.quantity,
    isSortable: true,
    classNameRow: "font-mono font-bold",
  },
  {
    label: "Final Price",
    key: "finalSellPrice",
    render: (record) => `$${record.finalSellPrice.toLocaleString()}`,
    isSortable: true,
    classNameRow: "font-mono font-bold text-emerald-600",
  },
  {
    label: "Total Amount",
    key: "id",
    render: (record) => `$${(record.finalSellPrice * record.quantity).toLocaleString()}`,
    isSortable: false,
    classNameRow: "font-mono font-bold",
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

import type { CategoryType } from "@/api/category-api";
import type { DataTableColumn } from "@/hooks/use-data-table";
import { formatDate } from "@/lib/date-time";
import { TableAction, TableRowsSelect } from "./table-action";

const tableColumns: DataTableColumn<CategoryType>[] = [
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
    label: "Name",
    key: "name",
    render: (record) => record.name,
    isSortable: true,
    classNameRow: "font-bold",
  },
  {
    label: "SKU",
    key: "sku",
    render: (record) => record.sku,
    isSortable: true,
    classNameRow: "font-mono font-bold text-primary",
  },
  {
    label: "Description",
    key: "description",
    render: (record) => record.description || "-",
    isSortable: true,
  },
  {
    label: "Created At",
    key: "createdAt",
    render: (record) => formatDate(record.createdAt),
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

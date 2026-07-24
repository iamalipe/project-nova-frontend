import type { StoreType } from "@/api/store-api";
import type { DataTableColumn } from "@/hooks/use-data-table";
import { formatDate } from "@/lib/date-time";
import { ExternalLink } from "lucide-react";
import { TableAction, TableRowsSelect } from "./table-action";

const tableColumns: DataTableColumn<StoreType>[] = [
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
    label: "Store Name",
    key: "name",
    render: (record) => record.name,
    isSortable: true,
    classNameRow: "font-bold",
  },
  {
    label: "Store Code",
    key: "storeCode",
    render: (record) => record.storeCode,
    isSortable: true,
    classNameRow: "font-mono font-semibold text-primary",
  },
  {
    label: "Address",
    key: "addressLine1",
    render: (record) => record.addressLine1,
    isSortable: true,
  },
  {
    label: "Country",
    key: "countryId",
    render: (record) => (record.country ? `${record.country.flag} ${record.country.name}` : "-"),
    isSortable: true,
  },
  {
    label: "State",
    key: "stateId",
    render: (record) => record.state?.name || "-",
    isSortable: true,
  },
  {
    label: "Zip Code",
    key: "zip",
    render: (record) => record.zip,
    isSortable: true,
  },
  {
    label: "Yearly Upkeep",
    key: "yearlyUpkeep",
    render: (record) => `$${record.yearlyUpkeep.toLocaleString()}`,
    isSortable: true,
  },
  {
    label: "Map Location",
    key: "locationMapLink",
    render: (record) =>
      record.locationMapLink ? (
        <a
          href={record.locationMapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          Open Map <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        "-"
      ),
    isSortable: false,
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

import type { StateType } from "@/api/state-api";
import type { DataTableColumn } from "@/hooks/use-data-table";
import { formatDate } from "@/lib/date-time";
import { TableAction, TableRowsSelect } from "./table-action";

const tableColumns: DataTableColumn<StateType>[] = [
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
    label: "Country",
    key: "countryId",
    render: (record) => record.country?.name || "-",
    isSortable: true,
  },
  {
    label: "Code 2",
    key: "code2",
    render: (record) => record.code2,
    isSortable: true,
    classNameRow: "font-mono",
  },
  {
    label: "Code 3",
    key: "code3",
    render: (record) => record.code3,
    isSortable: true,
    classNameRow: "font-mono",
  },
  {
    label: "Timezone",
    key: "tz",
    render: (record) => record.tz || "-",
    isSortable: true,
  },
  {
    label: "Flag",
    key: "flag",
    render: (record) => {
      if (!record.flag) return "-";
      if (record.flag.startsWith("http") || record.flag.startsWith("/")) {
        return <img src={record.flag} alt={`${record.name} flag`} className="h-5 w-7 object-cover rounded border" />;
      }
      return <span className="text-lg">{record.flag}</span>;
    },
    isSortable: false,
    classNameHeader: "w-16",
    classNameRow: "w-16",
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

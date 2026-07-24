import type { UserType } from "@/api/user-api"
import type { DataTableColumn } from "@/hooks/use-data-table"
import { formatDate } from "@/lib/date-time"
import { TableAction, TableRowsSelect } from "./table-action"

const tableColumns: DataTableColumn<UserType>[] = [
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
    label: "First Name",
    key: "firstName",
    render: (record) => record.firstName,
    isSortable: true,
    classNameRow: "font-bold",
  },
  {
    label: "Last Name",
    key: "lastName",
    render: (record) => record.lastName || "-",
    isSortable: true,
  },
  {
    label: "Email",
    key: "email",
    render: (record) => record.email,
    isSortable: true,
  },
  {
    label: "Role",
    key: "role",
    render: (record) => (
      <span
        className={`rounded px-2 py-1 text-xs font-semibold ${record.role === "SUPERUSER" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
      >
        {record.role}
      </span>
    ),
    isSortable: true,
  },
  {
    label: "Salary",
    key: "salary",
    render: (record) => (record.salary !== undefined && record.salary !== null ? `$${record.salary}` : "-"),
    isSortable: true,
  },
  {
    label: "Country",
    key: "country",
    render: (record) => (record.country ? `${record.country.flag} ${record.country.name}` : "-"),
    isSortable: false,
  },
  {
    label: "State",
    key: "state",
    render: (record) => (record.state ? record.state.name : "-"),
    isSortable: false,
  },
  {
    label: "Address",
    key: "address",
    render: (record) => record.address || "-",
    isSortable: false,
  },
  {
    label: "Zip",
    key: "zip",
    render: (record) => record.zip || "-",
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
]

export default tableColumns


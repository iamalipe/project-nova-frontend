import { BulkImportDialog, type ImportColumn } from "@/components/bulk-import/bulk-import-dialog";
import apiQuery from "@/hooks/use-api-query";
import useQueryLoadingState from "@/hooks/use-query-loading-state";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import DialogSkeleton from "../../product/dialog/dialog-skeleton";

const recordSchema = z.object({
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  role: z.enum(["GUEST", "SUPERUSER", "STORE_MANAGER", "STAFF", "CUSTOMER"]).optional(),
  salary: z.coerce.number().min(0, "Salary must be non-negative").optional(),
  countrycode2: z.string().optional(),
  statecode2: z.string().optional(),
  address: z.string().optional(),
  zip: z.string().optional(),
  password: z.string().min(6).optional(),
});

const sampleCSV = `email,firstName,lastName,role,salary,countrycode2,statecode2,address,zip,password
john.doe@example.com,John,Doe,SUPERUSER,85000,US,CA,123 Main St,90210,SecretPass123!
jane.smith@example.com,Jane,Smith,STAFF,62000,IN,MH,456 Park Ave,400001,Password123!
guest.user@example.com,Guest,,GUEST,35000,,,,`;

interface UserImportDialogProps {
  state: DialogStateType;
}

export default function UserImportDialog({ state: _state }: UserImportDialogProps) {
  const navigate = useNavigate();
  const countriesQuery = apiQuery.country.useGetAll({ page: 0 });
  const statesQuery = apiQuery.state.useGetAll({ page: 0 });

  const { isLoading } = useQueryLoadingState([countriesQuery, statesQuery]);

  const countries = countriesQuery.data?.data || [];
  const states = statesQuery.data?.data || [];

  const columns: ImportColumn[] = useMemo(() => [
    {
      key: "email",
      label: "Email",
      description: "User email address. Must be unique.",
      required: true,
      type: "string",
    },
    {
      key: "firstName",
      label: "First Name",
      description: "User first name.",
      required: true,
      type: "string",
    },
    {
      key: "lastName",
      label: "Last Name",
      description: "User last name. (Optional).",
      required: false,
      type: "string",
    },
    {
      key: "role",
      label: "Role",
      description: "Role: GUEST, SUPERUSER, STORE_MANAGER, STAFF, CUSTOMER (Defaults to GUEST).",
      required: false,
      type: "string",
      options: [
        { value: "GUEST", label: "GUEST" },
        { value: "SUPERUSER", label: "SUPERUSER" },
        { value: "STORE_MANAGER", label: "STORE_MANAGER" },
        { value: "STAFF", label: "STAFF" },
        { value: "CUSTOMER", label: "CUSTOMER" },
      ],
    },
    {
      key: "salary",
      label: "Salary",
      description: "Annual salary amount. (Optional).",
      required: false,
      type: "number",
    },
    {
      key: "countrycode2",
      label: "Country Code2",
      description: "2-letter Country Code (e.g. US, IN). (Optional).",
      required: false,
      type: "string",
      options: countries.map((c) => ({ value: c.code2, label: `${c.name} (${c.code2})` })),
    },
    {
      key: "statecode2",
      label: "State Code2",
      description: "2-letter State Code (e.g. CA, MH). (Optional).",
      required: false,
      type: "string",
    },
    {
      key: "address",
      label: "Address",
      description: "Street address text. (Optional).",
      required: false,
      type: "string",
    },
    {
      key: "zip",
      label: "Zip Code",
      description: "Postal code. (Optional).",
      required: false,
      type: "string",
    },
    {
      key: "password",
      label: "Password",
      description: "Initial password (Defaults to Password123! if omitted).",
      required: false,
      type: "string",
    },
  ], [countries]);

  if (isLoading) return <DialogSkeleton />;

  const handleClose = () => {
    navigate({
      to: "/app/user",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    });
  };

  const handleImport = async (validData: any[]) => {
    return apiQuery.user.createMany(validData);
  };

  const validateRow = (row: Record<string, string>) => {
    const result = recordSchema.safeParse(row);
    const errors: string[] = [];

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push(`${issue.path.join(".")}: ${issue.message}`);
      });
    }

    let countryId: string | undefined = undefined;
    if (row.countrycode2?.trim()) {
      const country = countries.find(
        (c) => c.code2.toUpperCase() === row.countrycode2.trim().toUpperCase()
      );
      if (country) {
        countryId = country.id;
      } else {
        errors.push(`Country Code "${row.countrycode2}" not found.`);
      }
    }

    let stateId: string | undefined = undefined;
    const inputSubCode = (row.subdivisioncode || row.statecode2)?.trim();
    if (inputSubCode) {
      const state = states.find(
        (s) => s.subdivisionCode.toUpperCase() === inputSubCode.toUpperCase()
      );
      if (state) {
        stateId = state.id;
      } else {
        errors.push(`Subdivision Code "${inputSubCode}" not found.`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      resolvedData: {
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName || undefined,
        role: (row.role?.toUpperCase() as any) || "GUEST",
        salary: row.salary ? parseFloat(row.salary) : undefined,
        countryId,
        stateId,
        address: row.address || undefined,
        zip: row.zip || undefined,
        password: row.password || undefined,
      },
    };
  };

  return (
    <BulkImportDialog
      open={true}
      onClose={handleClose}
      title="Import Users"
      description="Upload a CSV file or paste raw CSV text to import users in bulk."
      columns={columns}
      onImport={handleImport}
      validateRow={validateRow}
      sampleCSV={sampleCSV}
    />
  );
}

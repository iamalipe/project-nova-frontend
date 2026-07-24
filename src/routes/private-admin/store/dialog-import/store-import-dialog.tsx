import { BulkImportDialog, type ImportColumn } from "@/components/bulk-import/bulk-import-dialog";
import apiQuery from "@/hooks/use-api-query";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

const recordSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  storeCode: z.string().length(6, "Store code must be 6 characters"),
  addressLine1: z.string().min(1, "Address is required"),
  zip: z.string().min(1, "Zip code is required"),
  countryId: z.string().uuid("Country ID is required"),
  stateId: z.string().uuid("State ID is required"),
  yearlyUpkeep: z.coerce.number().min(0),
});

const columns: ImportColumn[] = [
  { key: "name", label: "Name", description: "Store Name", required: true, type: "string" },
  { key: "storeCode", label: "Store Code", description: "6-character unique code", required: true, type: "string" },
  { key: "addressLine1", label: "Address", description: "Street address", required: true, type: "string" },
  { key: "zip", label: "Zip Code", description: "Postal zip code", required: true, type: "string" },
  { key: "countryId", label: "Country ID", description: "UUID of Country", required: true, type: "string" },
  { key: "stateId", label: "State ID", description: "UUID of State", required: true, type: "string" },
  { key: "yearlyUpkeep", label: "Yearly Upkeep", description: "Annual maintenance cost", required: true, type: "number" },
];

const sampleCSV = `name,storeCode,addressLine1,zip,countryId,stateId,yearlyUpkeep
Main Store,STR001,123 Main St,90210,00000000-0000-0000-0000-000000000000,00000000-0000-0000-0000-000000000000,12000`;

export default function StoreImportDialog({ state: _state }: { state: DialogStateType }) {
  const navigate = useNavigate({ from: "/app/store" });

  const handleClose = () => {
    navigate({
      search: (prev) => ({ ...prev, ds: undefined }),
    });
  };

  const handleImport = async (validData: any[]) => {
    return apiQuery.store.createMany(validData);
  };

  const validateRow = (row: Record<string, string>) => {
    const result = recordSchema.safeParse(row);
    const errors: string[] = [];

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push(`${issue.path.join(".")}: ${issue.message}`);
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      resolvedData: row,
    };
  };

  return (
    <BulkImportDialog
      open={true}
      onClose={handleClose}
      title="Import Stores"
      description="Upload a CSV file or paste raw CSV text to import stores in bulk."
      columns={columns}
      onImport={handleImport}
      validateRow={validateRow}
      sampleCSV={sampleCSV}
    />
  );
}

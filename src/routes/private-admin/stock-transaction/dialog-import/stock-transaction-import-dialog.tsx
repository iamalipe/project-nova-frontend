import { BulkImportDialog, type ImportColumn } from "@/components/bulk-import/bulk-import-dialog";
import apiQuery from "@/hooks/use-api-query";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

const recordSchema = z.object({
  travelCost: z.coerce.number().min(0),
  status: z.enum(["PENDING", "IN_TRANSIT", "DELIVERED"]),
});

const columns: ImportColumn[] = [
  { key: "fromStoreId", label: "From Store ID", description: "UUID of source store", required: false, type: "string" },
  { key: "fromWarehouseId", label: "From Warehouse ID", description: "UUID of source warehouse", required: false, type: "string" },
  { key: "travelCost", label: "Travel Cost", description: "Freight or transit cost", required: true, type: "number" },
  { key: "status", label: "Status", description: "PENDING, IN_TRANSIT, or DELIVERED", required: true, type: "string" },
];

const sampleCSV = `fromStoreId,fromWarehouseId,travelCost,status
,00000000-0000-0000-0000-000000000000,150.00,PENDING`;

export default function StockTransactionImportDialog({ state: _state }: { state: DialogStateType }) {
  const navigate = useNavigate({ from: "/app/stock-transaction" });

  const handleClose = () => {
    navigate({
      search: (prev) => ({ ...prev, ds: undefined }),
    });
  };

  const handleImport = async (validData: any[]) => {
    return apiQuery.stockTransaction.createMany(validData);
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
      title="Import Stock Transactions"
      description="Upload a CSV file or paste raw CSV text to import transfer manifests in bulk."
      columns={columns}
      onImport={handleImport}
      validateRow={validateRow}
      sampleCSV={sampleCSV}
    />
  );
}

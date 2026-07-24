import { BulkImportDialog, type ImportColumn } from "@/components/bulk-import/bulk-import-dialog";
import apiQuery from "@/hooks/use-api-query";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

const recordSchema = z.object({
  productId: z.string().uuid("Product ID is required"),
  quantity: z.coerce.number().min(0),
  minThreshold: z.coerce.number().optional(),
});

const columns: ImportColumn[] = [
  { key: "productId", label: "Product ID", description: "UUID of Product", required: true, type: "string" },
  { key: "storeId", label: "Store ID", description: "UUID of Store (Optional if Warehouse)", required: false, type: "string" },
  { key: "warehouseId", label: "Warehouse ID", description: "UUID of Warehouse (Optional if Store)", required: false, type: "string" },
  { key: "quantity", label: "Quantity", description: "Current inventory count", required: true, type: "number" },
  { key: "minThreshold", label: "Min Threshold", description: "Low stock alert trigger", required: false, type: "number" },
];

const sampleCSV = `productId,storeId,warehouseId,quantity,minThreshold
00000000-0000-0000-0000-000000000000,00000000-0000-0000-0000-000000000000,,150,10`;

export default function StockImportDialog({ state: _state }: { state: DialogStateType }) {
  const navigate = useNavigate({ from: "/app/stock" });

  const handleClose = () => {
    navigate({
      search: (prev) => ({ ...prev, ds: undefined }),
    });
  };

  const handleImport = async (validData: any[]) => {
    return apiQuery.stock.createMany(validData);
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
      title="Import Stock"
      description="Upload a CSV file or paste raw CSV text to import stock records in bulk."
      columns={columns}
      onImport={handleImport}
      validateRow={validateRow}
      sampleCSV={sampleCSV}
    />
  );
}

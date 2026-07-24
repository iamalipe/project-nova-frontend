import { BulkImportDialog, type ImportColumn } from "@/components/bulk-import/bulk-import-dialog";
import apiQuery from "@/hooks/use-api-query";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

const recordSchema = z.object({
  productId: z.string().uuid("Product ID is required"),
  storeId: z.string().uuid("Store ID is required"),
  customerId: z.string().uuid("Customer ID is required"),
  staffId: z.string().uuid("Staff ID is required"),
  quantity: z.coerce.number().min(1),
  finalSellPrice: z.coerce.number().min(0),
});

const columns: ImportColumn[] = [
  { key: "productId", label: "Product ID", description: "UUID of Product", required: true, type: "string" },
  { key: "storeId", label: "Store ID", description: "UUID of Store", required: true, type: "string" },
  { key: "customerId", label: "Customer ID", description: "UUID of Customer User", required: true, type: "string" },
  { key: "staffId", label: "Staff ID", description: "UUID of Staff User", required: true, type: "string" },
  { key: "quantity", label: "Quantity", description: "Quantity sold", required: true, type: "number" },
  { key: "finalSellPrice", label: "Final Sell Price", description: "Selling unit price", required: true, type: "number" },
];

const sampleCSV = `productId,storeId,customerId,staffId,quantity,finalSellPrice
00000000-0000-0000-0000-000000000000,00000000-0000-0000-0000-000000000000,00000000-0000-0000-0000-000000000000,00000000-0000-0000-0000-000000000000,2,49.99`;

export default function SellImportDialog({ state: _state }: { state: DialogStateType }) {
  const navigate = useNavigate({ from: "/app/sell" });

  const handleClose = () => {
    navigate({
      search: (prev) => ({ ...prev, ds: undefined }),
    });
  };

  const handleImport = async (validData: any[]) => {
    return apiQuery.sell.createMany(validData);
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
      title="Import Sales Records"
      description="Upload a CSV file or paste raw CSV text to import point of sale records in bulk."
      columns={columns}
      onImport={handleImport}
      validateRow={validateRow}
      sampleCSV={sampleCSV}
    />
  );
}

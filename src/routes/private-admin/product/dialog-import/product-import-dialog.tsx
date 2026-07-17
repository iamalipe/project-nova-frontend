import { BulkImportDialog, type ImportColumn } from "@/components/bulk-import/bulk-import-dialog";
import apiQuery from "@/hooks/use-api-query";
import useQueryLoadingState from "@/hooks/use-query-loading-state";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import DialogSkeleton from "../dialog/dialog-skeleton";

const recordSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  "sub-category sku": z.string().min(4, "Subcategory SKU must be 4 characters").max(4),
  mrp: z.coerce.number().gt(0, "MRP must be greater than 0"),
  mop: z.coerce.number().gt(0, "MOP must be greater than 0"),
  url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().max(2000).optional(),
});

const sampleCSV = `sub-category sku,name,mrp,mop,url,description
ELLA,Asus ROG Strix,1899,1749,https://images.unsplash.com/photo-5,High-end gaming laptop with RTX 4080
SGTM,Pro Grip Mat,79.99,69.99,,Non-slip durable yoga mat
BVBT,Earl Grey Special,15.90,12.50,,Traditional flavored black tea`;

interface ProductImportDialogProps {
  state: DialogStateType;
}

export default function ProductImportDialog({ state: _state }: ProductImportDialogProps) {
  const navigate = useNavigate();
  const subcategoriesQuery = apiQuery.subcategory.useGetAll({ page: 0 });
  const { isLoading } = useQueryLoadingState([subcategoriesQuery]);

  if (isLoading) return <DialogSkeleton />;

  const subcategories = subcategoriesQuery.data?.data || [];

  const columns: ImportColumn[] = useMemo(() => [
    {
      key: "sub-category sku",
      label: "Sub-Category SKU",
      description: "The 4-character parent Subcategory SKU. Must exist in database.",
      required: true,
      type: "string",
      options: subcategories.map((s) => ({ value: s.sku, label: `${s.name} (${s.sku})` })),
    },
    {
      key: "name",
      label: "Name",
      description: "Name of the Product. Must be at least 2 characters.",
      required: true,
      type: "string",
    },
    {
      key: "mrp",
      label: "MRP",
      description: "Maximum Retail Price (positive decimal).",
      required: true,
      type: "number",
    },
    {
      key: "mop",
      label: "MOP",
      description: "Market Operating Price (positive decimal).",
      required: true,
      type: "number",
    },
    {
      key: "url",
      label: "URL",
      description: "Image URL for the Product. (Optional).",
      required: false,
      type: "string",
    },
    {
      key: "description",
      label: "Description",
      description: "Product description text. (Optional).",
      required: false,
      type: "string",
    },
  ], [subcategories]);

  const handleClose = () => {
    navigate({
      to: "/app/product",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    });
  };

  const handleImport = async (validData: any[]) => {
    return apiQuery.product.createMany(validData);
  };

  const validateRow = (row: Record<string, string>) => {
    const result = recordSchema.safeParse(row);
    const errors: string[] = [];

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push(`${issue.path.join(".")}: ${issue.message}`);
      });
    }

    const matchedSku = row["sub-category sku"]?.trim().toUpperCase();
    const subcategory = subcategories.find((s) => s.sku.toUpperCase() === matchedSku);

    if (!subcategory) {
      errors.push(`Subcategory SKU "${row["sub-category sku"]}" not found in database.`);
    }

    return {
      valid: errors.length === 0,
      errors,
      resolvedData: {
        name: row.name,
        subcategoryId: subcategory?.id ?? "",
        mrp: parseFloat(row.mrp) || 0,
        mop: parseFloat(row.mop) || 0,
        description: row.description || undefined,
        images: row.url || undefined,
      },
    };
  };

  return (
    <BulkImportDialog
      open={true}
      onClose={handleClose}
      title="Import Products"
      description="Upload a CSV file or paste raw CSV text to import products in bulk. Subcategory SKUs must match database records."
      columns={columns}
      onImport={handleImport}
      validateRow={validateRow}
      sampleCSV={sampleCSV}
    />
  );
}

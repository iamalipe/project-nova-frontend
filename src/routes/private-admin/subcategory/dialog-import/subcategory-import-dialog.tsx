import { BulkImportDialog, type ImportColumn } from "@/components/bulk-import/bulk-import-dialog";
import apiQuery from "@/hooks/use-api-query";
import useQueryLoadingState from "@/hooks/use-query-loading-state";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import DialogSkeleton from "../dialog/dialog-skeleton";

const recordSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  categorysku: z.string().min(2, "Category SKU must be 2 characters").max(2),
  url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().max(2000).optional(),
});

const columns: ImportColumn[] = [
  {
    key: "categorysku",
    label: "Category SKU",
    description: "The 2-character parent Category SKU. Must exist in database.",
    required: true,
    type: "string",
  },
  {
    key: "name",
    label: "Name",
    description: "Name of the Subcategory. Must be at least 2 characters.",
    required: true,
    type: "string",
  },
  {
    key: "url",
    label: "URL",
    description: "Image URL for the Subcategory. (Optional, must be a valid http/https URL if provided).",
    required: false,
    type: "string",
  },
  {
    key: "description",
    label: "Description",
    description: "A detailed description of the Subcategory. (Optional).",
    required: false,
    type: "string",
  },
];

const sampleCSV = `categorysku,name,url,description
EL,Microwaves,https://images.unsplash.com/photo-3,Countertop kitchen microwaves
SG,Yoga Mats,https://images.unsplash.com/photo-4,Eco-friendly exercise mats
BV,Black Teas,,Premium loose leaf teas`;

interface SubcategoryImportDialogProps {
  state: DialogStateType;
}

export default function SubcategoryImportDialog({ state: _state }: SubcategoryImportDialogProps) {
  const navigate = useNavigate();
  const categoriesQuery = apiQuery.category.useGetAll({ page: 0 });
  const { isLoading } = useQueryLoadingState([categoriesQuery]);

  if (isLoading) return <DialogSkeleton />;

  const categories = categoriesQuery.data?.data || [];

  const handleClose = () => {
    navigate({
      to: "/app/subcategory",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    });
  };

  const handleImport = async (validData: any[]) => {
    return apiQuery.subcategory.createMany(validData);
  };

  const validateRow = (row: Record<string, string>) => {
    const result = recordSchema.safeParse(row);
    const errors: string[] = [];

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push(`${issue.path.join(".")}: ${issue.message}`);
      });
    }

    const matchedSku = row.categorysku?.trim().toUpperCase();
    const category = categories.find((c) => c.sku.toUpperCase() === matchedSku);

    if (!category) {
      errors.push(`Category SKU "${row.categorysku}" not found in database.`);
    }

    return {
      valid: errors.length === 0,
      errors,
      resolvedData: {
        name: row.name,
        categoryId: category?.id ?? "",
        description: row.description || undefined,
        images: row.url || undefined,
      },
    };
  };

  return (
    <BulkImportDialog
      open={true}
      onClose={handleClose}
      title="Import Subcategories"
      description="Upload a CSV file or paste raw CSV text to import subcategories in bulk. Category SKUs must match database records."
      columns={columns}
      onImport={handleImport}
      validateRow={validateRow}
      sampleCSV={sampleCSV}
    />
  );
}

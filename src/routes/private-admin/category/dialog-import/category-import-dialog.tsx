import { BulkImportDialog, type ImportColumn } from "@/components/bulk-import/bulk-import-dialog";
import apiQuery from "@/hooks/use-api-query";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";

const recordSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().max(2000).optional(),
});

const columns: ImportColumn[] = [
  {
    key: "name",
    label: "Name",
    description: "Name of the Category. Must be unique and at least 2 characters long.",
    required: true,
    type: "string",
  },
  {
    key: "url",
    label: "URL",
    description: "Image URL for the Category. (Optional, must be a valid http/https URL if provided).",
    required: false,
    type: "string",
  },
  {
    key: "description",
    label: "Description",
    description: "A detailed description of the Category. (Optional).",
    required: false,
    type: "string",
  },
];

const sampleCSV = `name,url,description
Kitchen Appliances,https://images.unsplash.com/photo-1556911220-e15b29be8c8f,Electronic cooking appliances
Sports Gear,https://images.unsplash.com/photo-1517649763962-0c623066013b,Fitness and outdoor gear
Beverages,,Cold drinks and coffee blends`;

interface CategoryImportDialogProps {
  state: DialogStateType;
}

export default function CategoryImportDialog({ state: _state }: CategoryImportDialogProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({
      to: "/app/category",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    });
  };

  const handleImport = async (validData: any[]) => {
    return apiQuery.category.createMany(validData);
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
      resolvedData: {
        name: row.name,
        description: row.description || undefined,
        images: row.url || undefined,
      },
    };
  };

  return (
    <BulkImportDialog
      open={true}
      onClose={handleClose}
      title="Import Categories"
      description="Upload a CSV file or paste raw CSV text to import categories in bulk."
      columns={columns}
      onImport={handleImport}
      validateRow={validateRow}
      sampleCSV={sampleCSV}
    />
  );
}

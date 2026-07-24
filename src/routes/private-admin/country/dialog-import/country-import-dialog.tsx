import { BulkImportDialog, type ImportColumn } from "@/components/bulk-import/bulk-import-dialog";
import apiQuery from "@/hooks/use-api-query";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";

const recordSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  flag: z.string().min(1, "Flag emoji or icon is required"),
  code2: z.string().length(2, "Code2 must be 2 characters"),
  code3: z.string().length(3, "Code3 must be 3 characters"),
  tz: z.string().min(1, "Timezone is required"),
  currency3: z.string().length(3, "Currency code must be 3 characters"),
  currencySymbol: z.string().min(1, "Currency symbol is required"),
});

const columns: ImportColumn[] = [
  {
    key: "name",
    label: "Name",
    description: "Country name (e.g. United States)",
    required: true,
    type: "string",
  },
  {
    key: "flag",
    label: "Flag",
    description: "Country flag emoji or symbol (e.g. 🇺🇸)",
    required: true,
    type: "string",
  },
  {
    key: "code2",
    label: "Code 2",
    description: "2-letter ISO Country Code (e.g. US)",
    required: true,
    type: "string",
  },
  {
    key: "code3",
    label: "Code 3",
    description: "3-letter ISO Country Code (e.g. USA)",
    required: true,
    type: "string",
  },
  {
    key: "tz",
    label: "Timezone",
    description: "Primary timezone (e.g. UTC-5)",
    required: true,
    type: "string",
  },
  {
    key: "currency3",
    label: "Currency Code",
    description: "3-letter currency code (e.g. USD)",
    required: true,
    type: "string",
  },
  {
    key: "currencySymbol",
    label: "Currency Symbol",
    description: "Currency symbol (e.g. $)",
    required: true,
    type: "string",
  },
];

const sampleCSV = `name,flag,code2,code3,tz,currency3,currencySymbol
United States,🇺🇸,US,USA,UTC-5,USD,$
India,🇮🇳,IN,IND,UTC+5:30,INR,₹
Japan,🇯🇵,JP,JPN,UTC+9,JPY,¥`;

interface CountryImportDialogProps {
  state: DialogStateType;
}

export default function CountryImportDialog({ state: _state }: CountryImportDialogProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({
      to: "/app/country",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    });
  };

  const handleImport = async (validData: any[]) => {
    return apiQuery.country.createMany(validData);
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
        flag: row.flag,
        code2: row.code2?.toUpperCase(),
        code3: row.code3?.toUpperCase(),
        tz: row.tz,
        currency3: row.currency3?.toUpperCase(),
        currencySymbol: row.currencySymbol,
      },
    };
  };

  return (
    <BulkImportDialog
      open={true}
      onClose={handleClose}
      title="Import Countries"
      description="Upload a CSV file or paste raw CSV text to import countries in bulk."
      columns={columns}
      onImport={handleImport}
      validateRow={validateRow}
      sampleCSV={sampleCSV}
    />
  );
}

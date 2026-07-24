import { BulkImportDialog, type ImportColumn } from "@/components/bulk-import/bulk-import-dialog";
import apiQuery from "@/hooks/use-api-query";
import useQueryLoadingState from "@/hooks/use-query-loading-state";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import DialogSkeleton from "../../product/dialog/dialog-skeleton";

const recordSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  countrycode2: z.string().length(2, "Country Code2 must be 2 characters"),
  subdivisioncode: z.string().min(1, "Subdivision Code is required").max(10),
  tz: z.string().optional(),
  flag: z.string().optional(),
});

const sampleCSV = `countrycode2,name,subdivisioncode,tz,flag
US,California,CA,UTC-8,🇺🇸
IN,Maharashtra,MH,UTC+5:30,🇮🇳
JP,Tokyo,TK,UTC+9,🇯🇵`;

interface StateImportDialogProps {
  state: DialogStateType;
}

export default function StateImportDialog({ state: _state }: StateImportDialogProps) {
  const navigate = useNavigate();
  const countriesQuery = apiQuery.country.useGetAll({ page: 0 });
  const { isLoading } = useQueryLoadingState([countriesQuery]);

  const countries = countriesQuery.data?.data || [];

  const columns: ImportColumn[] = useMemo(() => [
    {
      key: "countrycode2",
      label: "Country Code2",
      description: "2-letter Country Code (e.g. US, IN). Must exist in database.",
      required: true,
      type: "string",
      options: countries.map((c) => ({ value: c.code2, label: `${c.name} (${c.code2})` })),
    },
    {
      key: "name",
      label: "Name",
      description: "State or province name (e.g. California)",
      required: true,
      type: "string",
    },
    {
      key: "subdivisioncode",
      label: "Subdivision Code",
      description: "ISO 3166-2 Subdivision Code (e.g. CA, NY, MH)",
      required: true,
      type: "string",
    },
    {
      key: "tz",
      label: "Timezone",
      description: "Timezone (Optional)",
      required: false,
      type: "string",
    },
    {
      key: "flag",
      label: "Flag",
      description: "State flag or emoji (Optional)",
      required: false,
      type: "string",
    },
  ], [countries]);

  if (isLoading) return <DialogSkeleton />;

  const handleClose = () => {
    navigate({
      to: "/app/state",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    });
  };

  const handleImport = async (validData: any[]) => {
    return apiQuery.state.createMany(validData);
  };

  const validateRow = (row: Record<string, string>) => {
    const result = recordSchema.safeParse(row);
    const errors: string[] = [];

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push(`${issue.path.join(".")}: ${issue.message}`);
      });
    }

    const matchedCode2 = row.countrycode2?.trim().toUpperCase();
    const country = countries.find((c) => c.code2.toUpperCase() === matchedCode2);

    if (!country) {
      errors.push(`Country Code "${row.countrycode2}" not found in database.`);
    }

    return {
      valid: errors.length === 0,
      errors,
      resolvedData: {
        name: row.name,
        countryId: country?.id ?? "",
        subdivisionCode: row.subdivisioncode?.toUpperCase(),
        tz: row.tz || null,
        flag: row.flag || null,
      },
    };
  };

  return (
    <BulkImportDialog
      open={true}
      onClose={handleClose}
      title="Import Country States"
      description="Upload a CSV file or paste raw CSV text to import states in bulk. Country codes must match database records."
      columns={columns}
      onImport={handleImport}
      validateRow={validateRow}
      sampleCSV={sampleCSV}
    />
  );
}

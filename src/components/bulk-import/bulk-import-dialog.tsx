import React, { useState, useMemo, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export interface ImportColumn {
  key: string;
  label: string;
  description: string;
  required: boolean;
  type: "string" | "number";
  options?: { value: string; label: string }[];
}

interface BulkImportDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  columns: ImportColumn[];
  onImport: (validData: any[]) => Promise<any>;
  validateRow: (row: Record<string, string>) => {
    valid: boolean;
    errors: string[];
    resolvedData?: any;
  };
  sampleCSV?: string;
}

// Robust state-machine CSV parser
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentVal = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
      row.push(currentVal.trim());
      lines.push(row);
      row = [];
      currentVal = "";
    } else {
      currentVal += char;
    }
  }

  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    lines.push(row);
  }

  return lines.filter((r) => r.length > 0 && r.some((cell) => cell !== ""));
}

export function BulkImportDialog({
  open,
  onClose,
  title,
  description,
  columns,
  onImport,
  validateRow,
  sampleCSV = "",
}: BulkImportDialogProps) {
  const [step, setStep] = useState<"INPUT" | "PREVIEW">("INPUT");
  const [csvText, setCsvText] = useState("");
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const [databaseErrors, setDatabaseErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const limit = 10;

  // Reset states
  const handleClose = () => {
    setStep("INPUT");
    setCsvText("");
    setPreviewData([]);
    setDatabaseErrors({});
    setCurrentPage(1);
    setSortConfig(null);
    onClose();
  };

  // CSV File reader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvText(text);
        toast.success(`Uploaded ${file.name} successfully.`);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read CSV file.");
    };
    reader.readAsText(file);
  };

  // Parse pasted/uploaded CSV and transition to preview
  const handleAnalyze = () => {
    if (!csvText.trim()) {
      toast.error("Please paste CSV data or upload a file first.");
      return;
    }

    try {
      const parsed = parseCSV(csvText);
      if (parsed.length < 2) {
        toast.error("CSV must contain at least a header row and one data row.");
        return;
      }

      // Read headers (case-insensitive trim)
      const headers = parsed[0].map((h) => h.toLowerCase().trim().replace(/[-_\s]/g, ""));
      
      // Check for required column mappings (use key since key is the actual CSV header name)
      const missingColumns = columns
        .filter((col) => col.required)
        .filter(
          (col) =>
            !headers.includes(col.key.toLowerCase().replace(/[-_\s]/g, ""))
        );

      if (missingColumns.length > 0) {
        toast.error(
          `Missing required CSV headers: ${missingColumns.map((c) => c.key).join(", ")}`
        );
        return;
      }

      // Map columns
      const dataRows = parsed.slice(1).map((row) => {
        const record: Record<string, string> = {};
        columns.forEach((col) => {
          // Find header index matching col key (flexible matches)
          const headerIdx = headers.findIndex(
            (h) => h === col.key.toLowerCase().replace(/[-_\s]/g, "")
          );
          record[col.key] = headerIdx !== -1 && row[headerIdx] !== undefined ? row[headerIdx] : "";
        });
        // Attach random id for unique tracking
        record._tempId = Math.random().toString(36).substring(2, 9);
        return record;
      });

      setDatabaseErrors({});
      setPreviewData(dataRows);
      setStep("PREVIEW");
      setCurrentPage(1);
    } catch (err) {
      toast.error("Failed to parse CSV data. Please check layout format.");
    }
  };

  // Cell editing callback
  const handleCellChange = (tempId: string, key: string, value: string) => {
    setPreviewData((prev) =>
      prev.map((row) => (row._tempId === tempId ? { ...row, [key]: value } : row))
    );
    // Clear any database validation error for this row when it's edited
    setDatabaseErrors((prev) => {
      const updated = { ...prev };
      delete updated[tempId];
      return updated;
    });
  };

  // Row deletion callback
  const handleRowDelete = (tempId: string) => {
    setPreviewData((prev) => prev.filter((row) => row._tempId !== tempId));
    setDatabaseErrors((prev) => {
      const updated = { ...prev };
      delete updated[tempId];
      return updated;
    });
  };

  // Sorting
  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedRows = useMemo(() => {
    const items = [...previewData];
    if (sortConfig !== null) {
      items.sort((a, b) => {
        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";

        const colDef = columns.find((c) => c.key === sortConfig.key);
        if (colDef?.type === "number") {
          const aNum = parseFloat(aVal) || 0;
          const bNum = parseFloat(bVal) || 0;
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return items;
  }, [previewData, sortConfig, columns]);

  // Reactive row validation + merge database insertion error responses
  const validatedRows = useMemo(() => {
    return sortedRows.map((row) => {
      const valResult = validateRow(row);
      const dbErr = databaseErrors[row._tempId];
      const errors = dbErr ? [...valResult.errors, dbErr] : valResult.errors;
      return {
        ...row,
        _valid: valResult.valid && !dbErr,
        _errors: errors,
        _resolved: valResult.resolvedData,
      } as any;
    });
  }, [sortedRows, validateRow, databaseErrors]);

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(validatedRows.length / limit));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return validatedRows.slice(start, start + limit);
  }, [validatedRows, currentPage]);

  const hasErrors = validatedRows.some((r) => !r._valid);
  const totalValidRowsCount = validatedRows.filter((r) => r._valid).length;

  const handleConfirmImport = async () => {
    if (hasErrors) {
      toast.error("Please fix all validation errors or delete invalid rows before importing.");
      return;
    }

    if (validatedRows.length === 0) {
      toast.error("No data rows available to import.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payloads = validatedRows.map((row) => row._resolved);
      const res = await onImport(payloads);
      
      const successCount = res.info?.success ?? res.data?.count ?? payloads.length;
      const failedCount = res.info?.failed ?? 0;
      const failedItems = res.data?.failed || [];

      if (failedCount > 0 && failedItems.length > 0) {
        // Keep ONLY the failed items in the previewData table and show their database insertion error
        const failedPreviewRows = previewData.filter((_row, idx) => {
          const resolved = validatedRows[idx]?._resolved;
          if (!resolved) return false;

          // Find if this resolved payload matches any in the failedItems returned from the API
          return failedItems.some((failed: any) => {
            return Object.keys(resolved).every((key) => {
              if (resolved[key] === null || resolved[key] === undefined) {
                return failed[key] === null || failed[key] === undefined;
              }
              if (typeof resolved[key] === "object") return true; // skip deep nesting
              return String(resolved[key]) === String(failed[key]);
            });
          });
        });

        // Set specific error message for each failed row
        const newDbErrors: Record<string, string> = {};
        failedPreviewRows.forEach((r) => {
          newDbErrors[r._tempId] = "Database constraint violation (duplicate key, unique name or code already exists).";
        });

        setDatabaseErrors(newDbErrors);
        setPreviewData(failedPreviewRows);
        setCurrentPage(1);
        toast.error(`Import complete with errors: ${successCount} imported successfully, ${failedCount} failed.`);
      } else {
        toast.success(`Successfully imported ${successCount} record(s).`);
        handleClose();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to persist records.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-[90vw] md:max-w-[1000px] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-none">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {step === "INPUT" ? (
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-2">
            {/* Column descriptions mapping info */}
            <div className="rounded-md border bg-muted/30 p-3 text-xs flex flex-col gap-2">
              <span className="font-semibold text-foreground">Column Mapping Instructions:</span>
              <span className="text-muted-foreground -mt-1">Use these exact column headers in the first row of your CSV input.</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                {columns.map((c) => (
                  <div key={c.key} className="flex flex-col border-b border-border/40 pb-1">
                    <div className="flex gap-2 items-center">
                      <span className="font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">{c.key}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">({c.label})</span>
                      {c.required ? (
                        <span className="text-[9px] bg-red-100 dark:bg-red-900/40 text-red-600 px-1 rounded font-bold">Required</span>
                      ) : (
                        <span className="text-[9px] bg-muted text-muted-foreground px-1 rounded">Optional</span>
                      )}
                    </div>
                    <span className="text-muted-foreground mt-1 text-[11px] leading-relaxed">{c.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CSV File Upload & Text Input */}
            <div className="flex flex-col gap-2 flex-1 min-h-[250px]">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Paste CSV data:</span>
                <div className="flex items-center gap-2">
                  {sampleCSV && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCsvText(sampleCSV)}
                    >
                      <FileText className="size-4 mr-2" />
                      Load Sample
                    </Button>
                  )}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="size-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>
              <Textarea
                className="flex-1 font-mono text-xs p-3 border resize-none focus-visible:ring-1 focus-visible:ring-primary min-h-[180px]"
                placeholder="header1,header2,header3&#10;value1,value2,value3"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 flex-none pt-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleAnalyze}>
                Next: Preview & Edit
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden py-2 gap-4">
            {/* Validation Overview */}
            <div className="flex flex-none items-center justify-between bg-muted/30 border rounded-md p-3 text-xs">
              <div className="flex gap-4">
                <div>
                  <span className="text-muted-foreground">Total Rows: </span>
                  <span className="font-bold">{previewData.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Valid: </span>
                  <span className="font-bold text-green-600">{totalValidRowsCount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Errors: </span>
                  <span className="font-bold text-red-600">
                    {previewData.length - totalValidRowsCount}
                  </span>
                </div>
              </div>
              {hasErrors && (
                <span className="text-red-500 font-medium animate-pulse">
                  Please fix red warning cells directly in table before importing
                </span>
              )}
            </div>

            {/* Editable Preview Table */}
            <div className="flex-1 overflow-auto border rounded-md">
              <Table className="relative">
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-12 text-center font-bold">Status</TableHead>
                    {columns.map((c) => (
                      <TableHead key={c.key}>
                        <button
                          className="flex items-center gap-1 font-bold text-xs"
                          onClick={() => requestSort(c.key)}
                        >
                          {c.label}
                          <ArrowUpDown className="size-3" />
                        </button>
                      </TableHead>
                    ))}
                    <TableHead className="w-12 text-center font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row) => (
                    <TableRow key={row._tempId} className={row._valid ? "" : "bg-red-50/20 dark:bg-red-950/10"}>
                      {/* Status */}
                      <TableCell className="text-center p-2">
                        {row._valid ? (
                          <CheckCircle2 className="size-5 text-green-600 mx-auto" />
                        ) : (
                          <div className="relative group flex items-center justify-center cursor-help">
                            <AlertCircle className="size-5 text-red-600" />
                            <div className="absolute hidden group-hover:block bottom-6 left-1/2 -translate-x-1/2 z-30 w-64 bg-red-600 text-white rounded p-2 text-[10px] shadow-lg text-left">
                              <ul className="list-disc pl-3">
                                {row._errors.map((e: string, idx: number) => (
                                  <li key={idx}>{e}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </TableCell>

                      {/* Columns inputs or Select menus */}
                      {columns.map((col) => (
                        <TableCell key={col.key} className="p-1 min-w-[140px]">
                          {col.options ? (
                            <select
                              value={row[col.key] || ""}
                              onChange={(e) =>
                                handleCellChange(row._tempId, col.key, e.target.value)
                              }
                              className="w-full text-xs bg-transparent border-0 border-b border-border/20 px-2 py-1.5 rounded focus:bg-background focus:ring-1 focus:ring-primary dark:bg-popover outline-none"
                            >
                              <option value="">Select option</option>
                              {col.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={row[col.key] || ""}
                              onChange={(e) =>
                                handleCellChange(row._tempId, col.key, e.target.value)
                              }
                              className="w-full text-xs bg-transparent border-0 border-b border-border/20 px-2 py-1 rounded focus:bg-background focus:ring-1 focus:ring-primary outline-none"
                            />
                          )}
                        </TableCell>
                      ))}

                      {/* Row Delete */}
                      <TableCell className="text-center p-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleRowDelete(row._tempId)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={columns.length + 2} className="text-center py-6 text-muted-foreground">
                        No rows remaining.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls & Confirm Button */}
            <div className="flex flex-none items-center justify-between py-1">
              {/* Back & Pagination */}
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setStep("INPUT")}>
                  Back to Paste
                </Button>
                <div className="flex items-center gap-1.5 text-xs">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Persist Actions */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  disabled={hasErrors || validatedRows.length === 0 || isSubmitting}
                  onClick={handleConfirmImport}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    `Import ${validatedRows.length} Rows`
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

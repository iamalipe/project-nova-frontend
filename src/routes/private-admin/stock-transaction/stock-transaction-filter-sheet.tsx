import type { ApiStockTransactionGetAllParams } from "@/api/stock-transaction-api";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import apiQuery from "@/hooks/use-api-query";
import { useState } from "react";

interface StockTransactionFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ApiStockTransactionGetAllParams;
  onApplyFilters: (filters: Partial<ApiStockTransactionGetAllParams>) => void;
  onResetFilters: () => void;
}

export default function StockTransactionFilterSheet({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onResetFilters,
}: StockTransactionFilterSheetProps) {
  const storesQuery = apiQuery.store.useGetAll({ page: 0 });
  const warehousesQuery = apiQuery.warehouse.useGetAll({ page: 0 });

  const [status, setStatus] = useState<string>(filters.status || "");
  const [fromStoreId, setFromStoreId] = useState<string>(filters.fromStoreId || "");
  const [fromWarehouseId, setFromWarehouseId] = useState<string>(filters.fromWarehouseId || "");

  const stores = storesQuery.data?.data || [];
  const warehouses = warehousesQuery.data?.data || [];

  const handleApply = () => {
    onApplyFilters({
      status: (status as any) || undefined,
      fromStoreId: fromStoreId || undefined,
      fromWarehouseId: fromWarehouseId || undefined,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setStatus("");
    setFromStoreId("");
    setFromWarehouseId("");
    onResetFilters();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filter Stock Transactions</SheetTitle>
          <SheetDescription>Filter transfer records by status or origin location.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 py-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Transaction Status</label>
            <NativeSelect
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full"
            >
              <NativeSelectOption value="">All Statuses</NativeSelectOption>
              <NativeSelectOption value="PENDING">PENDING</NativeSelectOption>
              <NativeSelectOption value="IN_TRANSIT">IN_TRANSIT</NativeSelectOption>
              <NativeSelectOption value="DELIVERED">DELIVERED</NativeSelectOption>
            </NativeSelect>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">From Store</label>
            <NativeSelect
              value={fromStoreId}
              onChange={(e) => {
                setFromStoreId(e.target.value);
                if (e.target.value) setFromWarehouseId("");
              }}
              className="mt-1 w-full"
            >
              <NativeSelectOption value="">All Source Stores</NativeSelectOption>
              {stores.map((s) => (
                <NativeSelectOption key={s.id} value={s.id}>
                  {s.name} ({s.storeCode})
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">From Warehouse</label>
            <NativeSelect
              value={fromWarehouseId}
              onChange={(e) => {
                setFromWarehouseId(e.target.value);
                if (e.target.value) setFromStoreId("");
              }}
              className="mt-1 w-full"
            >
              <NativeSelectOption value="">All Source Warehouses</NativeSelectOption>
              {warehouses.map((w) => (
                <NativeSelectOption key={w.id} value={w.id}>
                  {w.name} ({w.warehouseCode})
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </div>
        <SheetFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

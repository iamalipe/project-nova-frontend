import type { ApiStockGetAllParams } from "@/api/stock-api";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import apiQuery from "@/hooks/use-api-query";
import { useState } from "react";

interface StockFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ApiStockGetAllParams;
  onApplyFilters: (filters: Partial<ApiStockGetAllParams>) => void;
  onResetFilters: () => void;
}

export default function StockFilterSheet({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onResetFilters,
}: StockFilterSheetProps) {
  const storesQuery = apiQuery.store.useGetAll({ page: 0 });
  const warehousesQuery = apiQuery.warehouse.useGetAll({ page: 0 });
  const productsQuery = apiQuery.product.useGetAll({ page: 0 });

  const [productId, setProductId] = useState<string>(filters.productId || "");
  const [storeId, setStoreId] = useState<string>(filters.storeId || "");
  const [warehouseId, setWarehouseId] = useState<string>(filters.warehouseId || "");

  const stores = storesQuery.data?.data || [];
  const warehouses = warehousesQuery.data?.data || [];
  const products = productsQuery.data?.data || [];

  const handleApply = () => {
    onApplyFilters({
      productId: productId || undefined,
      storeId: storeId || undefined,
      warehouseId: warehouseId || undefined,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setProductId("");
    setStoreId("");
    setWarehouseId("");
    onResetFilters();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filter Stock Items</SheetTitle>
          <SheetDescription>Filter inventory records by product or location.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 py-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Product</label>
            <NativeSelect
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 w-full"
            >
              <NativeSelectOption value="">All Products</NativeSelectOption>
              {products.map((p) => (
                <NativeSelectOption key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Store Location</label>
            <NativeSelect
              value={storeId}
              onChange={(e) => {
                setStoreId(e.target.value);
                if (e.target.value) setWarehouseId("");
              }}
              className="mt-1 w-full"
            >
              <NativeSelectOption value="">All Stores</NativeSelectOption>
              {stores.map((s) => (
                <NativeSelectOption key={s.id} value={s.id}>
                  {s.name} ({s.storeCode})
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Warehouse Location</label>
            <NativeSelect
              value={warehouseId}
              onChange={(e) => {
                setWarehouseId(e.target.value);
                if (e.target.value) setStoreId("");
              }}
              className="mt-1 w-full"
            >
              <NativeSelectOption value="">All Warehouses</NativeSelectOption>
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

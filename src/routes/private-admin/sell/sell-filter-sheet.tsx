import type { ApiSellGetAllParams } from "@/api/sell-api";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import apiQuery from "@/hooks/use-api-query";
import { useState } from "react";

interface SellFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ApiSellGetAllParams;
  onApplyFilters: (filters: Partial<ApiSellGetAllParams>) => void;
  onResetFilters: () => void;
}

export default function SellFilterSheet({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onResetFilters,
}: SellFilterSheetProps) {
  const storesQuery = apiQuery.store.useGetAll({ page: 0 });
  const productsQuery = apiQuery.product.useGetAll({ page: 0 });
  const usersQuery = apiQuery.user.useGetAll({ page: 0 });

  const [productId, setProductId] = useState<string>(filters.productId || "");
  const [storeId, setStoreId] = useState<string>(filters.storeId || "");
  const [customerId, setCustomerId] = useState<string>(filters.customerId || "");
  const [staffId, setStaffId] = useState<string>(filters.staffId || "");

  const stores = storesQuery.data?.data || [];
  const products = productsQuery.data?.data || [];
  const users = usersQuery.data?.data || [];

  const handleApply = () => {
    onApplyFilters({
      productId: productId || undefined,
      storeId: storeId || undefined,
      customerId: customerId || undefined,
      staffId: staffId || undefined,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setProductId("");
    setStoreId("");
    setCustomerId("");
    setStaffId("");
    onResetFilters();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filter Sales</SheetTitle>
          <SheetDescription>Filter sale transactions by store, product, or users.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 py-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Store</label>
            <NativeSelect
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
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
            <label className="text-xs font-medium text-muted-foreground">Customer</label>
            <NativeSelect
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="mt-1 w-full"
            >
              <NativeSelectOption value="">All Customers</NativeSelectOption>
              {users.map((u) => (
                <NativeSelectOption key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.email})
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Staff Member</label>
            <NativeSelect
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="mt-1 w-full"
            >
              <NativeSelectOption value="">All Staff</NativeSelectOption>
              {users.map((u) => (
                <NativeSelectOption key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.role})
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

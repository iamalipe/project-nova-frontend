import type { ApiStoreGetAllParams } from "@/api/store-api";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import apiQuery from "@/hooks/use-api-query";
import { useState } from "react";

interface StoreFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ApiStoreGetAllParams;
  onApplyFilters: (filters: Partial<ApiStoreGetAllParams>) => void;
  onResetFilters: () => void;
}

export default function StoreFilterSheet({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onResetFilters,
}: StoreFilterSheetProps) {
  const countriesQuery = apiQuery.country.useGetAll({ page: 0 });
  const statesQuery = apiQuery.state.useGetAll({ page: 0 });

  const [countryId, setCountryId] = useState<string>(filters.countryId || "");
  const [stateId, setStateId] = useState<string>(filters.stateId || "");

  const countries = countriesQuery.data?.data || [];
  const states = statesQuery.data?.data || [];

  const filteredStates = countryId ? states.filter((s) => s.countryId === countryId) : states;

  const handleApply = () => {
    onApplyFilters({
      countryId: countryId || undefined,
      stateId: stateId || undefined,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setCountryId("");
    setStateId("");
    onResetFilters();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filter Stores</SheetTitle>
          <SheetDescription>Filter store records by location criteria.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 py-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Country</label>
            <NativeSelect
              value={countryId}
              onChange={(e) => {
                setCountryId(e.target.value);
                setStateId("");
              }}
              className="mt-1 w-full"
            >
              <NativeSelectOption value="">All Countries</NativeSelectOption>
              {countries.map((c) => (
                <NativeSelectOption key={c.id} value={c.id}>
                  {c.flag} {c.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">State</label>
            <NativeSelect
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              className="mt-1 w-full"
            >
              <NativeSelectOption value="">All States</NativeSelectOption>
              {filteredStates.map((s) => (
                <NativeSelectOption key={s.id} value={s.id}>
                  {s.name}
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

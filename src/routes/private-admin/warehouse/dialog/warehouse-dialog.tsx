import type { WarehouseType } from "@/api/warehouse-api";
import { AsyncButton } from "@/components/custom/async-button";
import FormController from "@/components/form/form-controller";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import apiQuery from "@/hooks/use-api-query";
import useQueryLoadingState from "@/hooks/use-query-loading-state";
import { handleFormError } from "@/lib/form";
import { cn } from "@/lib/utils";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { DicesIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogSkeleton from "./dialog-skeleton";
import DialogViewMode from "./dialog-view-mode";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  warehouseCode: z.string().length(6, "Warehouse code must be 6 characters"),
  addressLine1: z.string().min(1, "Address is required"),
  zip: z.string().min(1, "Zip code is required"),
  countryId: z.string().uuid("Please select a country"),
  stateId: z.string().uuid("Please select a state"),
  mapLocation: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  supplyStoreIds: z.array(z.string().uuid()).default([]),
  yearlyUpkeep: z.coerce.number().min(0, "Yearly upkeep must be non-negative"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function WarehouseDialog({ state }: { state: DialogStateType }) {
  const warehouseQuery = state.id ? apiQuery.warehouse.useGet(state.id) : undefined;
  const countriesQuery = apiQuery.country.useGetAll({ page: 0 });
  const statesQuery = apiQuery.state.useGetAll({ page: 0 });
  const storesQuery = apiQuery.store.useGetAll({ page: 0 });

  const { isLoading } = useQueryLoadingState(
    warehouseQuery ? [warehouseQuery, countriesQuery, statesQuery, storesQuery] : [countriesQuery, statesQuery, storesQuery]
  );

  if (isLoading) return <DialogSkeleton />;
  if (state.mode === "VIEW") return <DialogViewMode data={warehouseQuery?.data?.data} />;

  return (
    <DialogMain
      state={state}
      data={warehouseQuery?.data?.data}
      countries={countriesQuery.data?.data || []}
      states={statesQuery.data?.data || []}
      stores={storesQuery.data?.data || []}
    />
  );
}

function DialogMain({
  state,
  data,
  countries,
  states,
  stores,
}: {
  state: DialogStateType;
  data?: WarehouseType;
  countries: any[];
  states: any[];
  stores: any[];
}) {
  const navigate = useNavigate({ from: "/app/warehouse" });
  const [selectedCountryId, setSelectedCountryId] = useState<string>(data?.countryId || countries[0]?.id || "");

  const defaultValues: FormSchemaType = {
    name: data?.name ?? "",
    warehouseCode: data?.warehouseCode ?? "",
    addressLine1: data?.addressLine1 ?? "",
    zip: data?.zip ?? "",
    countryId: data?.countryId ?? (countries[0]?.id || ""),
    stateId: data?.stateId ?? "",
    mapLocation: data?.mapLocation ?? "",
    description: data?.description ?? "",
    supplyStoreIds: data?.supplyStoreIds ?? [],
    yearlyUpkeep: data?.yearlyUpkeep ?? 20000,
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormSchemaType>,
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (data?.countryId) setSelectedCountryId(data.countryId);
  }, [data]);

  const filteredStates = useMemo(() => {
    if (!selectedCountryId) return [];
    return states.filter((s) => s.countryId === selectedCountryId);
  }, [states, selectedCountryId]);

  const onCountryChange = (cId: string) => {
    setSelectedCountryId(cId);
    form.setValue("countryId", cId, { shouldValidate: true });
    form.setValue("stateId", "", { shouldValidate: true });
  };

  const generateFakeData = () => {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const countryStates = randomCountry ? states.filter((s) => s.countryId === randomCountry.id) : [];
    const randomState = countryStates.length > 0 ? countryStates[Math.floor(Math.random() * countryStates.length)] : null;
    const randomStores = stores.length > 0 ? [stores[0].id] : [];

    if (randomCountry) setSelectedCountryId(randomCountry.id);

    form.reset({
      name: `${faker.location.city()} Warehouse`,
      warehouseCode: faker.string.alphanumeric({ length: 6, casing: "upper" }),
      addressLine1: faker.location.streetAddress(),
      zip: faker.location.zipCode(),
      countryId: randomCountry?.id || "",
      stateId: randomState?.id || "",
      mapLocation: "https://www.openstreetmap.org",
      description: faker.company.catchPhrase(),
      supplyStoreIds: randomStores,
      yearlyUpkeep: Number(faker.finance.amount({ min: 10000, max: 100000, dec: 2 })),
    });
  };

  const onClose = () => {
    form.reset();
    navigate({
      search: (prev) => ({ ...prev, ds: undefined }),
    });
  };

  const onSubmit = async (values: FormSchemaType) => {
    try {
      const res = await apiQuery.warehouse.create({
        ...values,
        mapLocation: values.mapLocation || undefined,
        description: values.description || undefined,
      });
      if (!res.success) throw new Error("Creation failed.");
      toast.success("Warehouse created successfully.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };

  const onUpdate = async (values: FormSchemaType) => {
    try {
      if (!state.id) return;
      const res = await apiQuery.warehouse.update({
        id: state.id,
        data: {
          ...values,
          mapLocation: values.mapLocation || undefined,
          description: values.description || undefined,
        },
      });
      if (!res.success) throw new Error("Update failed.");
      toast.success("Warehouse updated successfully.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-h-[85vh] sm:max-w-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{state.mode === "CREATE" ? "Create Warehouse" : "Edit Warehouse"}</DialogTitle>
          <DialogDescription>Setup distribution warehouse specifications and supply chain links.</DialogDescription>
        </DialogHeader>
        {state.mode === "CREATE" && (
          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={generateFakeData}>
              <DicesIcon className="mr-2 h-4 w-4" /> Fake Data
            </Button>
          </div>
        )}
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-4">
            <FormController
              form={form}
              name="name"
              label="Warehouse Name"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  {...field}
                  placeholder="e.g. North Distribution Logistics"
                  className={cn(isError && "border-destructive")}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            <FormController
              form={form}
              name="warehouseCode"
              label="Warehouse Code (6 chars)"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  {...field}
                  maxLength={6}
                  placeholder="WH0001"
                  className={cn("font-mono", isError && "border-destructive")}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormController
              form={form}
              name="countryId"
              label="Country"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  value={field.value as string}
                  onChange={(e) => onCountryChange(e.target.value)}
                  className="w-full"
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                >
                  <NativeSelectOption value="">Select Country</NativeSelectOption>
                  {countries.map((c) => (
                    <NativeSelectOption key={c.id} value={c.id}>
                      {c.flag} {c.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            />
            <FormController
              form={form}
              name="stateId"
              label="State"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  value={field.value as string}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full"
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                >
                  <NativeSelectOption value="">
                    {!selectedCountryId ? "Select Country first" : "Select State"}
                  </NativeSelectOption>
                  {filteredStates.map((s) => (
                    <NativeSelectOption key={s.id} value={s.id}>
                      {s.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <FormController
                form={form}
                name="addressLine1"
                label="Street Address"
                render={({ field, isError, ariaDescribedby }) => (
                  <Input
                    {...field}
                    placeholder="456 Logistics Pkwy"
                    className={cn(isError && "border-destructive")}
                    aria-invalid={isError}
                    aria-describedby={ariaDescribedby}
                  />
                )}
              />
            </div>
            <FormController
              form={form}
              name="zip"
              label="Zip Code"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  {...field}
                  placeholder="90210"
                  className={cn(isError && "border-destructive")}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormController
              form={form}
              name="yearlyUpkeep"
              label="Yearly Upkeep ($)"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  placeholder="30000"
                  className={cn(isError && "border-destructive")}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            <FormController
              form={form}
              name="mapLocation"
              label="Map URL (Optional)"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  {...field}
                  placeholder="https://..."
                  className={cn(isError && "border-destructive")}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
          </div>

          <FormController
            form={form}
            name="description"
            label="Description (Optional)"
            render={({ field, isError, ariaDescribedby }) => (
              <Textarea
                {...field}
                placeholder="Capacity and operations notes..."
                className={cn(isError && "border-destructive")}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />
        </div>

        <DialogFooter className="mt-4">
          <DialogClose render={<Button variant="outline" onClick={onClose} />}>
            Cancel
          </DialogClose>
          <AsyncButton
            loading={form.formState.isSubmitting}
            onClick={form.handleSubmit(state.mode === "CREATE" ? onSubmit : onUpdate)}
            type="submit"
          >
            {state.mode === "CREATE" ? "Create Warehouse" : "Update Warehouse"}
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

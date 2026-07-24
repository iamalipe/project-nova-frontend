import type { StoreType } from "@/api/store-api";
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
  storeCode: z.string().length(6, "Store code must be 6 characters"),
  addressLine1: z.string().min(1, "Address is required"),
  zip: z.string().min(1, "Zip code is required"),
  countryId: z.string().uuid("Please select a country"),
  stateId: z.string().uuid("Please select a state"),
  locationMapLink: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  yearlyUpkeep: z.coerce.number().min(0, "Yearly upkeep must be non-negative"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function StoreDialog({ state }: { state: DialogStateType }) {
  const storeQuery = state.id ? apiQuery.store.useGet(state.id) : undefined;
  const countriesQuery = apiQuery.country.useGetAll({ page: 0 });
  const statesQuery = apiQuery.state.useGetAll({ page: 0 });

  const { isLoading } = useQueryLoadingState(
    storeQuery ? [storeQuery, countriesQuery, statesQuery] : [countriesQuery, statesQuery]
  );

  if (isLoading) return <DialogSkeleton />;
  if (state.mode === "VIEW") return <DialogViewMode data={storeQuery?.data?.data} />;

  return (
    <DialogMain
      state={state}
      data={storeQuery?.data?.data}
      countries={countriesQuery.data?.data || []}
      states={statesQuery.data?.data || []}
    />
  );
}

function DialogMain({
  state,
  data,
  countries,
  states,
}: {
  state: DialogStateType;
  data?: StoreType;
  countries: any[];
  states: any[];
}) {
  const navigate = useNavigate({ from: "/app/store" });
  const [selectedCountryId, setSelectedCountryId] = useState<string>(data?.countryId || countries[0]?.id || "");

  const defaultValues: FormSchemaType = {
    name: data?.name ?? "",
    storeCode: data?.storeCode ?? "",
    addressLine1: data?.addressLine1 ?? "",
    zip: data?.zip ?? "",
    countryId: data?.countryId ?? (countries[0]?.id || ""),
    stateId: data?.stateId ?? "",
    locationMapLink: data?.locationMapLink ?? "",
    description: data?.description ?? "",
    yearlyUpkeep: data?.yearlyUpkeep ?? 10000,
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

    if (randomCountry) setSelectedCountryId(randomCountry.id);

    form.reset({
      name: `${faker.location.city()} Store`,
      storeCode: faker.string.alphanumeric({ length: 6, casing: "upper" }),
      addressLine1: faker.location.streetAddress(),
      zip: faker.location.zipCode(),
      countryId: randomCountry?.id || "",
      stateId: randomState?.id || "",
      locationMapLink: "https://www.openstreetmap.org",
      description: faker.company.catchPhrase(),
      yearlyUpkeep: Number(faker.finance.amount({ min: 5000, max: 50000, dec: 2 })),
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
      const res = await apiQuery.store.create({
        ...values,
        locationMapLink: values.locationMapLink || undefined,
        description: values.description || undefined,
      });
      if (!res.success) throw new Error("Creation failed.");
      toast.success("Store created successfully.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };

  const onUpdate = async (values: FormSchemaType) => {
    try {
      if (!state.id) return;
      const res = await apiQuery.store.update({
        id: state.id,
        data: {
          ...values,
          locationMapLink: values.locationMapLink || undefined,
          description: values.description || undefined,
        },
      });
      if (!res.success) throw new Error("Update failed.");
      toast.success("Store updated successfully.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-h-[85vh] sm:max-w-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{state.mode === "CREATE" ? "Create Store" : "Edit Store"}</DialogTitle>
          <DialogDescription>Fill out store location details and financial params.</DialogDescription>
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
              label="Store Name"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  {...field}
                  placeholder="e.g. Downtown Flagship"
                  className={cn(isError && "border-destructive")}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            <FormController
              form={form}
              name="storeCode"
              label="Store Code (6 chars)"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  {...field}
                  maxLength={6}
                  placeholder="STR001"
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
                    placeholder="123 Main St"
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
                  placeholder="15000"
                  className={cn(isError && "border-destructive")}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            <FormController
              form={form}
              name="locationMapLink"
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
                placeholder="Internal notes or description..."
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
            {state.mode === "CREATE" ? "Create Store" : "Update Store"}
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

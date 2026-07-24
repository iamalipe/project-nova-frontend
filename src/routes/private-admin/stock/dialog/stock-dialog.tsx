import type { StockType } from "@/api/stock-api";
import { AsyncButton } from "@/components/custom/async-button";
import FormController from "@/components/form/form-controller";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import apiQuery from "@/hooks/use-api-query";
import useQueryLoadingState from "@/hooks/use-query-loading-state";
import { handleFormError } from "@/lib/form";
import { cn } from "@/lib/utils";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { DicesIcon } from "lucide-react";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogSkeleton from "./dialog-skeleton";
import DialogViewMode from "./dialog-view-mode";

const formSchema = z
  .object({
    productId: z.string().uuid("Please select a product"),
    locationType: z.enum(["STORE", "WAREHOUSE"]),
    storeId: z.string().optional().or(z.literal("")),
    warehouseId: z.string().optional().or(z.literal("")),
    quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
    minThreshold: z.coerce.number().int().min(0).optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.locationType === "STORE") return !!data.storeId;
      if (data.locationType === "WAREHOUSE") return !!data.warehouseId;
      return false;
    },
    {
      message: "Please select a valid location for the chosen location type",
      path: ["storeId"],
    }
  );

type FormSchemaType = z.infer<typeof formSchema>;

export default function StockDialog({ state }: { state: DialogStateType }) {
  const stockQuery = state.id ? apiQuery.stock.useGet(state.id) : undefined;
  const productsQuery = apiQuery.product.useGetAll({ page: 0 });
  const storesQuery = apiQuery.store.useGetAll({ page: 0 });
  const warehousesQuery = apiQuery.warehouse.useGetAll({ page: 0 });

  const { isLoading } = useQueryLoadingState(
    stockQuery
      ? [stockQuery, productsQuery, storesQuery, warehousesQuery]
      : [productsQuery, storesQuery, warehousesQuery]
  );

  if (isLoading) return <DialogSkeleton />;
  if (state.mode === "VIEW") return <DialogViewMode data={stockQuery?.data?.data} />;

  return (
    <DialogMain
      state={state}
      data={stockQuery?.data?.data}
      products={productsQuery.data?.data || []}
      stores={storesQuery.data?.data || []}
      warehouses={warehousesQuery.data?.data || []}
    />
  );
}

function DialogMain({
  state,
  data,
  products,
  stores,
  warehouses,
}: {
  state: DialogStateType;
  data?: StockType;
  products: any[];
  stores: any[];
  warehouses: any[];
}) {
  const navigate = useNavigate({ from: "/app/stock" });
  const [locType, setLocType] = useState<"STORE" | "WAREHOUSE">(
    data?.warehouseId ? "WAREHOUSE" : "STORE"
  );

  const defaultValues: FormSchemaType = {
    productId: data?.productId ?? (products[0]?.id || ""),
    locationType: data?.warehouseId ? "WAREHOUSE" : "STORE",
    storeId: data?.storeId ?? (stores[0]?.id || ""),
    warehouseId: data?.warehouseId ?? (warehouses[0]?.id || ""),
    quantity: data?.quantity ?? 100,
    minThreshold: data?.minThreshold ?? 10,
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormSchemaType>,
    defaultValues,
    mode: "onChange",
  });

  const generateFakeData = () => {
    const randomProd = products[Math.floor(Math.random() * products.length)];
    const useWarehouse = Math.random() > 0.5;
    const randomStore = stores[Math.floor(Math.random() * stores.length)];
    const randomWh = warehouses[Math.floor(Math.random() * warehouses.length)];

    setLocType(useWarehouse ? "WAREHOUSE" : "STORE");

    form.reset({
      productId: randomProd?.id || "",
      locationType: useWarehouse ? "WAREHOUSE" : "STORE",
      storeId: useWarehouse ? "" : randomStore?.id || "",
      warehouseId: useWarehouse ? randomWh?.id || "" : "",
      quantity: faker.number.int({ min: 10, max: 500 }),
      minThreshold: faker.number.int({ min: 5, max: 30 }),
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
      const payload = {
        productId: values.productId,
        storeId: values.locationType === "STORE" ? values.storeId || undefined : undefined,
        warehouseId: values.locationType === "WAREHOUSE" ? values.warehouseId || undefined : undefined,
        quantity: values.quantity,
        minThreshold: typeof values.minThreshold === "number" ? values.minThreshold : undefined,
      };
      const res = await apiQuery.stock.create(payload);
      if (!res.success) throw new Error("Creation failed.");
      toast.success("Stock created successfully.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };

  const onUpdate = async (values: FormSchemaType) => {
    try {
      if (!state.id) return;
      const payload = {
        productId: values.productId,
        storeId: values.locationType === "STORE" ? values.storeId || undefined : undefined,
        warehouseId: values.locationType === "WAREHOUSE" ? values.warehouseId || undefined : undefined,
        quantity: values.quantity,
        minThreshold: typeof values.minThreshold === "number" ? values.minThreshold : undefined,
      };
      const res = await apiQuery.stock.update({ id: state.id, data: payload });
      if (!res.success) throw new Error("Update failed.");
      toast.success("Stock updated successfully.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-h-[85vh] sm:max-w-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{state.mode === "CREATE" ? "Create Stock Record" : "Edit Stock Record"}</DialogTitle>
          <DialogDescription>Assign product inventory levels to a store or warehouse.</DialogDescription>
        </DialogHeader>
        {state.mode === "CREATE" && (
          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={generateFakeData}>
              <DicesIcon className="mr-2 h-4 w-4" /> Fake Data
            </Button>
          </div>
        )}
        <div className="grid gap-3">
          <FormController
            form={form}
            name="productId"
            label="Product"
            render={({ field, isError, ariaDescribedby }) => (
              <NativeSelect
                value={field.value as string}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full"
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              >
                <NativeSelectOption value="">Select Product</NativeSelectOption>
                {products.map((p) => (
                  <NativeSelectOption key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormController
              form={form}
              name="locationType"
              label="Assign Location To"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  value={locType}
                  onChange={(e) => {
                    const val = e.target.value as "STORE" | "WAREHOUSE";
                    setLocType(val);
                    field.onChange(val);
                  }}
                  className="w-full"
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                >
                  <NativeSelectOption value="STORE">Store</NativeSelectOption>
                  <NativeSelectOption value="WAREHOUSE">Warehouse</NativeSelectOption>
                </NativeSelect>
              )}
            />

            {locType === "STORE" ? (
              <FormController
                form={form}
                name="storeId"
                label="Store Location"
                render={({ field, isError, ariaDescribedby }) => (
                  <NativeSelect
                    value={(field.value as string) || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full"
                    aria-invalid={isError}
                    aria-describedby={ariaDescribedby}
                  >
                    <NativeSelectOption value="">Select Store</NativeSelectOption>
                    {stores.map((s) => (
                      <NativeSelectOption key={s.id} value={s.id}>
                        {s.name} ({s.storeCode})
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                )}
              />
            ) : (
              <FormController
                form={form}
                name="warehouseId"
                label="Warehouse Location"
                render={({ field, isError, ariaDescribedby }) => (
                  <NativeSelect
                    value={(field.value as string) || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full"
                    aria-invalid={isError}
                    aria-describedby={ariaDescribedby}
                  >
                    <NativeSelectOption value="">Select Warehouse</NativeSelectOption>
                    {warehouses.map((w) => (
                      <NativeSelectOption key={w.id} value={w.id}>
                        {w.name} ({w.warehouseCode})
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                )}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormController
              form={form}
              name="quantity"
              label="Quantity"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  type="number"
                  {...field}
                  placeholder="100"
                  className={cn(isError && "border-destructive")}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            <FormController
              form={form}
              name="minThreshold"
              label="Min Threshold (Optional)"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  type="number"
                  {...field}
                  placeholder="10"
                  className={cn(isError && "border-destructive")}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
          </div>
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
            {state.mode === "CREATE" ? "Create Stock" : "Update Stock"}
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

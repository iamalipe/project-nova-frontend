import type { StockTransactionType } from "@/api/stock-transaction-api";
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
import { DicesIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogSkeleton from "./dialog-skeleton";
import DialogViewMode from "./dialog-view-mode";

const formSchema = z.object({
  fromType: z.enum(["STORE", "WAREHOUSE"]),
  fromStoreId: z.string().optional().or(z.literal("")),
  fromWarehouseId: z.string().optional().or(z.literal("")),
  products: z
    .array(
      z.object({
        productId: z.string().uuid("Select product"),
        qty: z.coerce.number().int().positive("Qty must be > 0"),
      })
    )
    .min(1, "At least 1 product required"),
  travelCost: z.coerce.number().min(0, "Travel cost must be >= 0"),
  status: z.enum(["PENDING", "IN_TRANSIT", "DELIVERED"]),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function StockTransactionDialog({ state }: { state: DialogStateType }) {
  const transactionQuery = state.id ? apiQuery.stockTransaction.useGet(state.id) : undefined;
  const productsQuery = apiQuery.product.useGetAll({ page: 0 });
  const storesQuery = apiQuery.store.useGetAll({ page: 0 });
  const warehousesQuery = apiQuery.warehouse.useGetAll({ page: 0 });

  const { isLoading } = useQueryLoadingState(
    transactionQuery
      ? [transactionQuery, productsQuery, storesQuery, warehousesQuery]
      : [productsQuery, storesQuery, warehousesQuery]
  );

  if (isLoading) return <DialogSkeleton />;
  if (state.mode === "VIEW") return <DialogViewMode data={transactionQuery?.data?.data} />;

  return (
    <DialogMain
      state={state}
      data={transactionQuery?.data?.data}
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
  data?: StockTransactionType;
  products: any[];
  stores: any[];
  warehouses: any[];
}) {
  const navigate = useNavigate({ from: "/app/stock-transaction" });
  const [fromType, setFromType] = useState<"STORE" | "WAREHOUSE">(
    data?.fromWarehouseId ? "WAREHOUSE" : "STORE"
  );

  const defaultValues: FormSchemaType = {
    fromType: data?.fromWarehouseId ? "WAREHOUSE" : "STORE",
    fromStoreId: data?.fromStoreId ?? (stores[0]?.id || ""),
    fromWarehouseId: data?.fromWarehouseId ?? (warehouses[0]?.id || ""),
    products: data?.products?.length
      ? data.products
      : [{ productId: products[0]?.id || "", qty: 1 }],
    travelCost: data?.travelCost ?? 50,
    status: data?.status ?? "PENDING",
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormSchemaType>,
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const generateFakeData = () => {
    const useWarehouse = Math.random() > 0.5;
    const randomStore = stores[Math.floor(Math.random() * stores.length)];
    const randomWh = warehouses[Math.floor(Math.random() * warehouses.length)];
    const randomProd = products[Math.floor(Math.random() * products.length)];

    setFromType(useWarehouse ? "WAREHOUSE" : "STORE");

    form.reset({
      fromType: useWarehouse ? "WAREHOUSE" : "STORE",
      fromStoreId: useWarehouse ? "" : randomStore?.id || "",
      fromWarehouseId: useWarehouse ? randomWh?.id || "" : "",
      products: [{ productId: randomProd?.id || "", qty: faker.number.int({ min: 5, max: 50 }) }],
      travelCost: Number(faker.finance.amount({ min: 50, max: 500, dec: 2 })),
      status: "PENDING",
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
        fromStoreId: values.fromType === "STORE" ? values.fromStoreId || null : null,
        fromWarehouseId: values.fromType === "WAREHOUSE" ? values.fromWarehouseId || null : null,
        products: values.products,
        travelCost: values.travelCost,
        status: values.status,
      };
      const res = await apiQuery.stockTransaction.create(payload);
      if (!res.success) throw new Error("Creation failed.");
      toast.success("Transaction created successfully.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };

  const onUpdate = async (values: FormSchemaType) => {
    try {
      if (!state.id) return;
      const payload = {
        fromStoreId: values.fromType === "STORE" ? values.fromStoreId || null : null,
        fromWarehouseId: values.fromType === "WAREHOUSE" ? values.fromWarehouseId || null : null,
        products: values.products,
        travelCost: values.travelCost,
        status: values.status,
      };
      const res = await apiQuery.stockTransaction.update({ id: state.id, data: payload });
      if (!res.success) throw new Error("Update failed.");
      toast.success("Transaction updated successfully.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-h-[85vh] sm:max-w-[650px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{state.mode === "CREATE" ? "New Stock Transfer" : "Edit Stock Transfer"}</DialogTitle>
          <DialogDescription>Create internal inventory transfer manifest between hubs.</DialogDescription>
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
              name="fromType"
              label="Source Location Type"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  value={fromType}
                  onChange={(e) => {
                    const val = e.target.value as "STORE" | "WAREHOUSE";
                    setFromType(val);
                    field.onChange(val);
                  }}
                  className="w-full"
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                >
                  <NativeSelectOption value="STORE">From Store</NativeSelectOption>
                  <NativeSelectOption value="WAREHOUSE">From Warehouse</NativeSelectOption>
                </NativeSelect>
              )}
            />

            {fromType === "STORE" ? (
              <FormController
                form={form}
                name="fromStoreId"
                label="Source Store"
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
                name="fromWarehouseId"
                label="Source Warehouse"
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
              name="travelCost"
              label="Travel / Transit Cost ($)"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  type="number"
                  step="0.01"
                  value={(field.value as number) ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="150"
                  className={cn(isError && "border-destructive")}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            <FormController
              form={form}
              name="status"
              label="Status"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  value={field.value as string}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full"
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                >
                  <NativeSelectOption value="PENDING">PENDING</NativeSelectOption>
                  <NativeSelectOption value="IN_TRANSIT">IN_TRANSIT</NativeSelectOption>
                  <NativeSelectOption value="DELIVERED">DELIVERED</NativeSelectOption>
                </NativeSelect>
              )}
            />
          </div>

          <div className="border rounded p-3 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground">Product Items Manifest</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productId: products[0]?.id || "", qty: 1 })}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Product
              </Button>
            </div>
            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-end border-b pb-2">
                <div className="col-span-8">
                  <FormController
                    form={form}
                    name={`products.${idx}.productId`}
                    label={`Product #${idx + 1}`}
                    render={({ field, isError, ariaDescribedby }) => (
                      <NativeSelect
                        value={field.value as string}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full text-xs"
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
                </div>
                <div className="col-span-3">
                  <FormController
                    form={form}
                    name={`products.${idx}.qty`}
                    label="Qty"
                    render={({ field, isError, ariaDescribedby }) => (
                      <Input
                        type="number"
                        value={(field.value as number) ?? 1}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="10"
                        className={cn("text-xs", isError && "border-destructive")}
                        aria-invalid={isError}
                        aria-describedby={ariaDescribedby}
                      />
                    )}
                  />
                </div>
                <div className="col-span-1 flex justify-end pb-1">
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
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
            {state.mode === "CREATE" ? "Create Transfer" : "Update Transfer"}
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import type { SellType } from "@/api/sell-api";
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
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogSkeleton from "./dialog-skeleton";
import DialogViewMode from "./dialog-view-mode";

const formSchema = z.object({
  productId: z.string().uuid("Please select a product"),
  storeId: z.string().uuid("Please select a store"),
  customerId: z.string().uuid("Please select a customer user"),
  staffId: z.string().uuid("Please select a staff member"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  finalSellPrice: z.coerce.number().min(0, "Price must be >= 0"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function SellDialog({ state }: { state: DialogStateType }) {
  const sellQuery = state.id ? apiQuery.sell.useGet(state.id) : undefined;
  const productsQuery = apiQuery.product.useGetAll({ page: 0 });
  const storesQuery = apiQuery.store.useGetAll({ page: 0 });
  const usersQuery = apiQuery.user.useGetAll({ page: 0 });

  const { isLoading } = useQueryLoadingState(
    sellQuery
      ? [sellQuery, productsQuery, storesQuery, usersQuery]
      : [productsQuery, storesQuery, usersQuery]
  );

  if (isLoading) return <DialogSkeleton />;
  if (state.mode === "VIEW") return <DialogViewMode data={sellQuery?.data?.data} />;

  return (
    <DialogMain
      state={state}
      data={sellQuery?.data?.data}
      products={productsQuery.data?.data || []}
      stores={storesQuery.data?.data || []}
      users={usersQuery.data?.data || []}
    />
  );
}

function DialogMain({
  state,
  data,
  products,
  stores,
  users,
}: {
  state: DialogStateType;
  data?: SellType;
  products: any[];
  stores: any[];
  users: any[];
}) {
  const navigate = useNavigate({ from: "/app/sell" });

  const defaultValues: FormSchemaType = {
    productId: data?.productId ?? (products[0]?.id || ""),
    storeId: data?.storeId ?? (stores[0]?.id || ""),
    customerId: data?.customerId ?? (users[0]?.id || ""),
    staffId: data?.staffId ?? (users[0]?.id || ""),
    quantity: data?.quantity ?? 1,
    finalSellPrice: data?.finalSellPrice ?? 99.99,
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormSchemaType>,
    defaultValues,
    mode: "onChange",
  });

  const generateFakeData = () => {
    const randomProd = products[Math.floor(Math.random() * products.length)];
    const randomStore = stores[Math.floor(Math.random() * stores.length)];
    const randomCustomer = users[Math.floor(Math.random() * users.length)];
    const randomStaff = users[Math.floor(Math.random() * users.length)];

    form.reset({
      productId: randomProd?.id || "",
      storeId: randomStore?.id || "",
      customerId: randomCustomer?.id || "",
      staffId: randomStaff?.id || "",
      quantity: faker.number.int({ min: 1, max: 5 }),
      finalSellPrice: Number(faker.finance.amount({ min: 20, max: 500, dec: 2 })),
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
      const res = await apiQuery.sell.create(values);
      if (!res.success) throw new Error("Creation failed.");
      toast.success("Sale record created successfully.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };

  const onUpdate = async (values: FormSchemaType) => {
    try {
      if (!state.id) return;
      const res = await apiQuery.sell.update({ id: state.id, data: values });
      if (!res.success) throw new Error("Update failed.");
      toast.success("Sale record updated successfully.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-h-[85vh] sm:max-w-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{state.mode === "CREATE" ? "Record Point of Sale" : "Edit Sale Record"}</DialogTitle>
          <DialogDescription>Record retail sales transaction linked to customer and staff.</DialogDescription>
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
                      {p.name} (${p.mop})
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            />
            <FormController
              form={form}
              name="storeId"
              label="Store"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  value={field.value as string}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormController
              form={form}
              name="customerId"
              label="Customer User"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  value={field.value as string}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full"
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                >
                  <NativeSelectOption value="">Select Customer</NativeSelectOption>
                  {users.map((u) => (
                    <NativeSelectOption key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.email})
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            />
            <FormController
              form={form}
              name="staffId"
              label="Staff Member"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  value={field.value as string}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full"
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                >
                  <NativeSelectOption value="">Select Staff</NativeSelectOption>
                  {users.map((u) => (
                    <NativeSelectOption key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.role})
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormController
              form={form}
              name="quantity"
              label="Quantity Sold"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  type="number"
                  {...field}
                  placeholder="1"
                  className={cn(isError && "border-destructive")}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            <FormController
              form={form}
              name="finalSellPrice"
              label="Unit Sell Price ($)"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  placeholder="99.99"
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
            {state.mode === "CREATE" ? "Record Sale" : "Update Sale"}
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import type { ProductType } from "@/api/product-api";
import { AsyncButton } from "@/components/custom/async-button";
import FormController from "@/components/form/form-controller";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import apiQuery from "@/hooks/use-api-query";
import useQueryLoadingState from "@/hooks/use-query-loading-state";
import { handleFormError } from "@/lib/form";
import { cn } from "@/lib/utils";
import type { DialogStateType } from "@/routes/private-admin/private-admin-route";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DialogSkeleton from "./dialog-skeleton";
import DialogViewMode from "./dialog-view-mode";

const formSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().min(2).max(2000),
  category: z.string().min(2).max(255),
  price: z.coerce.number().gt(0),
});
type FormSchemaType = z.infer<typeof formSchema>;

export type ProductDialogProps = {
  state: DialogStateType;
  data?: ProductType;
};
const ProductDialog = ({ state }: ProductDialogProps) => {
  const productQuery = state.id ? apiQuery.product.useGet(state.id) : undefined;
  const { isLoading } = useQueryLoadingState(
    productQuery ? [productQuery] : []
  );

  if (isLoading) return <DialogSkeleton />;
  if (state.mode === "VIEW")
    return <DialogViewMode state={state} data={productQuery?.data?.data} />;
  return <DialogMain state={state} data={productQuery?.data?.data} />;
};
export default ProductDialog;

const DialogMain = ({ data, state }: ProductDialogProps) => {
  const navigate = useNavigate();

  const defaultValues: FormSchemaType = {
    name: data?.name ?? "",
    category: data?.category ?? "",
    description: data?.description ?? "",
    price: data?.price ?? 0,
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormSchemaType>,
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const onClose = () => {
    form.reset();
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    });
  };
  const onSubmit = async (values: FormSchemaType) => {
    try {
      const res = await apiQuery.product.create(values);
      if (!res.success) throw new Error("Something wrong, please  ty again.");
      toast.success("Record added.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };
  const onUpdate = async (values: FormSchemaType) => {
    try {
      if (!state.id) throw new Error("No id found");
      const res = await apiQuery.product.update({
        id: state.id,
        data: values,
      });
      if (!res.success) throw new Error("Something wrong, please  ty again.");

      toast.success("Record updated.");
      onClose();
    } catch (err: any) {
      handleFormError({ form, error: err });
    }
  };

  return (
    <>
      <Dialog
        open={true}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent className="sm:max-w-[600px] sm:max-h-[80vh] px-2 md:px-6 sm:px-4">
          <DialogHeader>
            <DialogTitle>Product</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Recusandae ipsum porro sapiente! Perferendis harum dolorem culpa
              perspiciatis incidunt labore laborum quae ratione at voluptatum.
              Nam porro delectus eos autem reiciendis?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 md:gap-4">
            {/* name */}
            <FormController
              form={form}
              name="name"
              label="Name"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="text"
                  data-testid="name-input"
                  value={field.value as string}
                  name="name"
                  placeholder="Enter name"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            {/* category */}
            <FormController
              form={form}
              name="category"
              label="Category"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="text"
                  value={field.value as string}
                  name="category"
                  data-testid="category-input"
                  placeholder="Enter category"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            {/* price */}
            <FormController
              form={form}
              name="price"
              label="Price"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="number"
                  value={field.value as string}
                  name="price"
                  data-testid="price-input"
                  placeholder="Enter price"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            {/* description */}
            <FormController
              form={form}
              name="description"
              label="Description"
              maxLength={2000}
              render={({ field, isError, ariaDescribedby }) => (
                <Textarea
                  id={field.name}
                  value={field.value as string}
                  name="description"
                  data-testid="description-input"
                  placeholder="Enter description"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" data-testid="cancel-button" />}
            >
              Cancel
            </DialogClose>
            {state.mode === "CREATE" ? (
              <AsyncButton
                data-testid="create-button"
                loading={form.formState.isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
                type="submit"
                loadingText="Creating..."
              >
                Create
              </AsyncButton>
            ) : (
              <AsyncButton
                data-testid="update-button"
                loading={form.formState.isSubmitting}
                onClick={form.handleSubmit(onUpdate)}
                type="submit"
                loadingText="Updating..."
              >
                Update
              </AsyncButton>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

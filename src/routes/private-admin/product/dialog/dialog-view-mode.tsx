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
import { validateAndStringify } from "@/lib/generic-validation";
import { useNavigate } from "@tanstack/react-router";
import { dialogStateZodSchema } from "../../private-admin-route";
import type { ProductDialogProps } from "./product-dialog";

const DialogViewMode = ({ data }: ProductDialogProps) => {
  const navigate = useNavigate();
  const onClose = () => {
    navigate({
      to: "/app/product",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    });
  };

  const onEdit = () => {
    if (!data) return;
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "Product",
      id: data.id,
      mode: "UPDATE",
    });

    if (!ds) return;
    navigate({
      to: "/app/product",
      search: (prev) => ({
        ...prev,
        ds: ds,
      }),
    });
  };

  return (
    <>
      <Dialog
        open={true}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent
          className="md:max-w-[600px] px-2 md:px-6 sm:px-4 flex flex-col sm:max-h-[90vh] overflow-hidden"
          aria-live="polite"
          aria-busy="true"
        >
          <DialogHeader className="flex-none">
            <DialogTitle>Product</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Recusandae ipsum porro sapiente! Perferendis harum dolorem culpa
              perspiciatis incidunt labore laborum quae ratione at voluptatum.
              Nam porro delectus eos autem reiciendis?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col overflow-auto flex-1 px-2">
            {data?.name && (
              <ViewField label="Name">
                <span>{data.name}</span>
              </ViewField>
            )}
            {data?.category && (
              <ViewField label="Category">
                <span>{data.category}</span>
              </ViewField>
            )}
            {data?.price && (
              <ViewField label="Price">
                <span>{data.price}</span>
              </ViewField>
            )}
            {data?.description && (
              <ViewField label="Description" block>
                {data.description}
              </ViewField>
            )}
          </div>
          <DialogFooter className="flex-none gap-2">
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            {data && <Button onClick={onEdit}>Edit</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogViewMode;

type ViewFieldProps = {
  label: string;
  children?: React.ReactNode;
  block?: boolean;
};
const ViewField = ({ label, children, block = false }: ViewFieldProps) => {
  if (block) {
    return (
      <div className="px-1 py-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-sm text-muted-foreground mt-2 px-3 py-2 bg-muted rounded-md border text-left">
          <p className="whitespace-pre-wrap">{children}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center border-b px-1 py-2 last:border-b-0">
      <p className="text-sm font-medium truncate text-muted-foreground">
        {label}
      </p>
      <div className="text-sm font-bold text-foreground text-right flex items-center justify-end gap-2 flex-shrink-0">
        {children}
      </div>
    </div>
  );
};

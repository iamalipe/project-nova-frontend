import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { validateAndStringify } from "@/lib/generic-validation"
import { useNavigate } from "@tanstack/react-router"
import { dialogStateZodSchema } from "../../private-admin-route"
import type { ProductDialogProps } from "./product-dialog"

const DialogViewMode = ({ data }: ProductDialogProps) => {
  const navigate = useNavigate()
  const onClose = () => {
    navigate({
      to: "/app/product",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  const onEdit = () => {
    if (!data) return
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "Product",
      id: data.id,
      mode: "UPDATE",
    })

    if (!ds) return
    navigate({
      to: "/app/product",
      search: (prev) => ({
        ...prev,
        ds: ds,
      }),
    })
  }

  return (
    <>
      <Dialog
        open={true}
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
      >
        <DialogContent
          className="flex flex-col overflow-hidden sm:max-h-[90vh] md:max-w-[600px]"
          aria-live="polite"
          aria-busy="true"
        >
          <DialogHeader className="flex-none">
            <DialogTitle>Product</DialogTitle>
            <DialogDescription>
              View detail information of this Product.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-1 flex-col overflow-auto px-2">
            {data?.name && (
              <ViewField label="Name">
                <span>{data.name}</span>
              </ViewField>
            )}
            {data?.sku && (
              <ViewField label="SKU">
                <span className="font-mono font-bold text-primary">{data.sku}</span>
              </ViewField>
            )}
            {data?.subcategory?.category?.name && (
              <ViewField label="Category">
                <span>{data.subcategory.category.name}</span>
              </ViewField>
            )}
            {data?.subcategory?.name && (
              <ViewField label="Subcategory">
                <span>{data.subcategory.name}</span>
              </ViewField>
            )}
            {data?.mrp && (
              <ViewField label="MRP">
                <span>${data.mrp}</span>
              </ViewField>
            )}
            {data?.mop && (
              <ViewField label="MOP">
                <span>${data.mop}</span>
              </ViewField>
            )}
            {data?.images && (
              <ViewField label="Images">
                <span className="truncate max-w-[250px]">{data.images}</span>
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
  )
}

export default DialogViewMode

type ViewFieldProps = {
  label: string
  children?: React.ReactNode
  block?: boolean
}
const ViewField = ({ label, children, block = false }: ViewFieldProps) => {
  if (block) {
    return (
      <div className="px-1 py-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="mt-2 rounded-md border bg-muted px-3 py-2 text-left text-sm text-muted-foreground">
          <p className="whitespace-pre-wrap">{children}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between border-b px-1 py-2 last:border-b-0">
      <p className="truncate text-sm font-medium text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-shrink-0 items-center justify-end gap-2 text-right text-sm font-bold text-foreground">
        {children}
      </div>
    </div>
  )
}

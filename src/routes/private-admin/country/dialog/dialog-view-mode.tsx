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
import type { CountryDialogProps } from "./country-dialog"

const DialogViewMode = ({ data }: CountryDialogProps) => {
  const navigate = useNavigate()
  const onClose = () => {
    navigate({
      to: "/app/country",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  const onEdit = () => {
    if (!data) return
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "Country",
      id: data.id,
      mode: "UPDATE",
    })

    if (!ds) return
    navigate({
      to: "/app/country",
      search: (prev) => ({
        ...prev,
        ds: ds,
      }),
    })
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="flex flex-col overflow-hidden sm:max-h-[90vh] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Country Details</DialogTitle>
          <DialogDescription>
            View details for this Country entry.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col overflow-auto px-2 gap-3 py-2">
          <ViewField label="Name" value={data?.name} />
          <ViewField label="Flag" value={data?.flag} />
          <ViewField label="ISO Code (3)" value={data?.code3} />
          <ViewField label="ISO Code (2)" value={data?.code2} />
          <ViewField label="Timezone" value={data?.tz} />
          <ViewField label="Currency Code" value={data?.currency3} />
          <ViewField label="Currency Symbol" value={data?.currencySymbol} />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          {data && <Button onClick={onEdit}>Edit</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogViewMode

const ViewField = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex justify-between border-b py-2 last:border-0">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="text-sm font-semibold">{value || "-"}</span>
  </div>
)

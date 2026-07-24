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
import type { StateDialogProps } from "./state-dialog"

const DialogViewMode = ({ data }: StateDialogProps) => {
  const navigate = useNavigate()
  const onClose = () => {
    navigate({
      to: "/app/state",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  const onEdit = () => {
    if (!data) return
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "CountryState",
      id: data.id,
      mode: "UPDATE",
    })

    if (!ds) return
    navigate({
      to: "/app/state",
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
          <DialogTitle>State Details</DialogTitle>
          <DialogDescription>
            View details for this State entry.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col overflow-auto px-2 gap-3 py-2">
          <ViewField label="Name" value={data?.name} />
          <ViewField label="Country" value={data?.country?.name} />
          <ViewField label="Subdivision Code (ISO 3166-2)" value={data?.subdivisionCode} />
          <ViewField label="Timezone" value={data?.tz} />
          <ViewField label="Flag" value={data?.flag} />
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

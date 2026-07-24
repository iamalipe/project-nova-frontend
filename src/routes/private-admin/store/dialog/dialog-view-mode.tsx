import type { StoreType } from "@/api/store-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/date-time";
import { validateAndStringify } from "@/lib/generic-validation";
import { dialogStateZodSchema } from "@/routes/private-admin/private-admin-route";
import { useNavigate } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

export default function DialogViewMode({ data }: { data?: StoreType }) {
  const navigate = useNavigate({ from: "/app/store" });

  const onClose = () => {
    navigate({
      search: (prev) => ({ ...prev, ds: undefined }),
    });
  };

  const onEdit = () => {
    if (!data) return;
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "Store",
      id: data.id,
      mode: "UPDATE",
    });
    if (ds) navigate({ search: (prev) => ({ ...prev, ds }) });
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Store Details</DialogTitle>
          <DialogDescription>Full profile and parameters of this Store.</DialogDescription>
        </DialogHeader>
        {data && (
          <div className="grid gap-3 py-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Store Name</span>
              <span className="font-bold">{data.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Store Code</span>
              <span className="font-mono font-bold text-primary">{data.storeCode}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Address</span>
              <span>{data.addressLine1}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Country</span>
              <span>{data.country ? `${data.country.flag} ${data.country.name}` : "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">State</span>
              <span>{data.state?.name || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Zip Code</span>
              <span>{data.zip}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Yearly Upkeep</span>
              <span>${data.yearlyUpkeep.toLocaleString()}</span>
            </div>
            {data.locationMapLink && (
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-muted-foreground">Map Link</span>
                <a href={data.locationMapLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                  Open Map <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {data.description && (
              <div className="border-b pb-2">
                <span className="block font-semibold text-muted-foreground mb-1">Description</span>
                <p className="text-muted-foreground whitespace-pre-wrap">{data.description}</p>
              </div>
            )}
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Created At</span>
              <span>{formatDate(data.createdAt)}</span>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" onClick={onClose} />}>
            Close
          </DialogClose>
          {data && <Button onClick={onEdit}>Edit Store</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

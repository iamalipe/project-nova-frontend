import type { SellType } from "@/api/sell-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/date-time";
import { validateAndStringify } from "@/lib/generic-validation";
import { dialogStateZodSchema } from "@/routes/private-admin/private-admin-route";
import { useNavigate } from "@tanstack/react-router";

export default function DialogViewMode({ data }: { data?: SellType }) {
  const navigate = useNavigate({ from: "/app/sell" });

  const onClose = () => {
    navigate({
      search: (prev) => ({ ...prev, ds: undefined }),
    });
  };

  const onEdit = () => {
    if (!data) return;
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "Sell",
      id: data.id,
      mode: "UPDATE",
    });
    if (ds) navigate({ search: (prev) => ({ ...prev, ds }) });
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Point of Sale Record</DialogTitle>
          <DialogDescription>Full transaction breakdown and retail parameters.</DialogDescription>
        </DialogHeader>
        {data && (
          <div className="grid gap-3 py-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Product</span>
              <span className="font-bold">{data.product?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Store Location</span>
              <span>{data.store?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Customer</span>
              <span>
                {data.customer
                  ? `${data.customer.firstName} ${data.customer.lastName || ""}`
                  : data.customerId}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Staff Member</span>
              <span>
                {data.staff
                  ? `${data.staff.firstName} ${data.staff.lastName || ""}`
                  : data.staffId}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Quantity Sold</span>
              <span className="font-mono font-bold">{data.quantity}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Unit Sell Price</span>
              <span className="font-mono font-bold text-emerald-600">
                ${data.finalSellPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Total Transaction Revenue</span>
              <span className="font-mono font-bold text-emerald-700 text-base">
                ${(data.finalSellPrice * data.quantity).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Transaction Date</span>
              <span>{formatDate(data.transactionDate)}</span>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" onClick={onClose} />}>
            Close
          </DialogClose>
          {data && <Button onClick={onEdit}>Edit Sale</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

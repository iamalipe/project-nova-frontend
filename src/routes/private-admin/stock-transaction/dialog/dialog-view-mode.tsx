import type { StockTransactionType } from "@/api/stock-transaction-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/date-time";
import { validateAndStringify } from "@/lib/generic-validation";
import { dialogStateZodSchema } from "@/routes/private-admin/private-admin-route";
import { useNavigate } from "@tanstack/react-router";

const statusVariants: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  IN_TRANSIT: "bg-blue-50 text-blue-700 border-blue-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function DialogViewMode({ data }: { data?: StockTransactionType }) {
  const navigate = useNavigate({ from: "/app/stock-transaction" });

  const onClose = () => {
    navigate({
      search: (prev) => ({ ...prev, ds: undefined }),
    });
  };

  const onEdit = () => {
    if (!data) return;
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "StockTransaction",
      id: data.id,
      mode: "UPDATE",
    });
    if (ds) navigate({ search: (prev) => ({ ...prev, ds }) });
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Stock Transfer Transaction</DialogTitle>
          <DialogDescription>Full transfer manifest and transit parameters.</DialogDescription>
        </DialogHeader>
        {data && (
          <div className="grid gap-3 py-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Source Location</span>
              <span className="font-bold">
                {data.fromStore
                  ? `Store: ${data.fromStore.name}`
                  : data.fromWarehouse
                  ? `Warehouse: ${data.fromWarehouse.name}`
                  : "Main Hub"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Status</span>
              <span>
                <Badge variant="outline" className={statusVariants[data.status] || ""}>
                  {data.status}
                </Badge>
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Travel Cost</span>
              <span className="font-mono font-bold">${data.travelCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Transaction Date</span>
              <span>{formatDate(data.transactionDate)}</span>
            </div>

            <div className="border-b pb-2">
              <span className="block font-semibold text-muted-foreground mb-2">Transferred Manifest</span>
              <div className="space-y-1 bg-muted/40 p-3 rounded text-xs font-mono">
                {data.products.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>Product ID: {item.productId.slice(0, 8)}...</span>
                    <span className="font-bold">Qty: {item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" onClick={onClose} />}>
            Close
          </DialogClose>
          {data && <Button onClick={onEdit}>Edit Status</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

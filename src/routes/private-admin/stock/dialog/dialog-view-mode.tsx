import type { StockType } from "@/api/stock-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/date-time";
import { validateAndStringify } from "@/lib/generic-validation";
import { dialogStateZodSchema } from "@/routes/private-admin/private-admin-route";
import { useNavigate } from "@tanstack/react-router";

export default function DialogViewMode({ data }: { data?: StockType }) {
  const navigate = useNavigate({ from: "/app/stock" });

  const onClose = () => {
    navigate({
      search: (prev) => ({ ...prev, ds: undefined }),
    });
  };

  const onEdit = () => {
    if (!data) return;
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "Stock",
      id: data.id,
      mode: "UPDATE",
    });
    if (ds) navigate({ search: (prev) => ({ ...prev, ds }) });
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Stock Item Details</DialogTitle>
          <DialogDescription>Full inventory levels and location assignment.</DialogDescription>
        </DialogHeader>
        {data && (
          <div className="grid gap-3 py-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Product</span>
              <span className="font-bold">{data.product?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">SKU</span>
              <span className="font-mono text-xs">{data.product?.sku}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Location Type</span>
              <span>
                {data.storeId ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Store: {data.store?.name}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    Warehouse: {data.warehouse?.name}
                  </Badge>
                )}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Quantity Available</span>
              <span className="font-mono font-bold">{data.quantity}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Min Threshold</span>
              <span>{data.minThreshold !== null ? data.minThreshold : "Not Set"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">Last Updated</span>
              <span>{formatDate(data.lastUpdated)}</span>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" onClick={onClose} />}>
            Close
          </DialogClose>
          {data && <Button onClick={onEdit}>Edit Stock</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

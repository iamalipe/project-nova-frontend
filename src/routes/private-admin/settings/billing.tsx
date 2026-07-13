import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Manage your subscription and invoices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h4 className="font-bold text-lg">Pro Plan</h4>
              <p className="text-sm text-muted-foreground">
                $29 / month (Billed monthly)
              </p>
            </div>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-semibold rounded border border-emerald-500/20">
              Active
            </span>
          </div>
          <div className="text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Invoice:</span>
              <span className="font-medium">August 15, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">$29.00</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => toast.info("Billing management is a stub in development")}>
            Manage Subscription
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

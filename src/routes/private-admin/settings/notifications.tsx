import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function NotificationsTab() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);

  const handleUpdateNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification preferences updated successfully");
  };

  return (
    <form onSubmit={handleUpdateNotifications} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-semibold block">Email Notifications</label>
            <p className="text-[12px] text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-semibold block">Push Notifications</label>
            <p className="text-[12px] text-muted-foreground">
              Receive push notifications in your browser
            </p>
          </div>
          <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-semibold block">Marketing Emails</label>
            <p className="text-[12px] text-muted-foreground">
              Receive emails about new features and updates
            </p>
          </div>
          <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-semibold block">Weekly Summary</label>
            <p className="text-[12px] text-muted-foreground">
              Get a weekly summary of your activity
            </p>
          </div>
          <Switch checked={weeklySummary} onCheckedChange={setWeeklySummary} />
        </div>
      </div>

      <Button type="submit">Update preferences</Button>
    </form>
  );
}

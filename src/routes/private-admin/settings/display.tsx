import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function DisplayTab() {
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarBadges, setSidebarBadges] = useState(true);
  const [hoverPreviews, setHoverPreviews] = useState(true);

  const handleUpdateDisplay = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Display settings updated successfully");
  };

  return (
    <form onSubmit={handleUpdateDisplay} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-semibold block">Compact Mode</label>
            <p className="text-[12px] text-muted-foreground">
              Reduce padding for high density view
            </p>
          </div>
          <Switch checked={compactMode} onCheckedChange={setCompactMode} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-semibold block">Show Sidebar Badges</label>
            <p className="text-[12px] text-muted-foreground">
              Display count badges in sidebar menu items
            </p>
          </div>
          <Switch checked={sidebarBadges} onCheckedChange={setSidebarBadges} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-semibold block">Enable Hover Previews</label>
            <p className="text-[12px] text-muted-foreground">
              Show popup details on hover
            </p>
          </div>
          <Switch checked={hoverPreviews} onCheckedChange={setHoverPreviews} />
        </div>
      </div>

      <Button type="submit">Update preferences</Button>
    </form>
  );
}

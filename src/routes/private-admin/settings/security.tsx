import { useState } from "react";
import { toast } from "sonner";
import { Laptop, Trash2 } from "lucide-react";
import apiQuery from "@/hooks/use-api-query";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AsyncButton } from "@/components/custom/async-button";
import dayjs from "dayjs";

export default function SecurityTab() {
  const changePasswordMutation = apiQuery.auth.useChangePassword();
  const { data: sessions, isLoading: sessionsLoading } = apiQuery.auth.useGetSessions();
  const deleteSessionMutation = apiQuery.auth.useDeleteSession();

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword,
        newPassword,
      });
      toast.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleRevokeSession = async (id: string) => {
    try {
      await deleteSessionMutation.mutateAsync(id);
      toast.success("Session revoked successfully");
    } catch {
      toast.error("Failed to revoke session");
    }
  };

  return (
    <div className="space-y-8">
      {/* Change Password Section */}
      <form onSubmit={handleUpdatePassword} className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Change Password</h3>
            <p className="text-sm text-muted-foreground">
              Update your account password.
            </p>
          </div>
          <Separator />
          
          <div className="space-y-2">
            <label className="text-sm font-semibold block" htmlFor="current-password">
              Current Password
            </label>
            <Input
              id="current-password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold block" htmlFor="new-password">
              New Password
            </label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold block" htmlFor="confirm-password">
              Confirm New Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <AsyncButton type="submit" loading={changePasswordMutation.isPending}>
          Update password
        </AsyncButton>
      </form>

      {/* Two-Factor Authentication (stub with DEMO badge) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Demo
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account.
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-semibold block">Authenticator App</label>
            <p className="text-[12px] text-muted-foreground">
              Use an authenticator app to generate verification codes.
            </p>
          </div>
          <Switch checked={false} disabled />
        </div>
      </div>

      {/* Active Sessions Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Active Sessions</h3>
          <p className="text-sm text-muted-foreground">
            Manage the devices that are currently logged into your account.
          </p>
        </div>
        <Separator />

        {sessionsLoading ? (
          <div className="text-sm text-muted-foreground">Loading active sessions...</div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-muted text-muted-foreground">
                    <Laptop className="size-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {session.ip || "Unknown IP"}
                    </div>
                    <div className="text-xs text-muted-foreground max-w-sm truncate">
                      {session.userAgent || "Unknown Device"}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Logged in {dayjs(session.createdAt).format("MMM DD, YYYY [at] h:mm A")}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRevokeSession(session.id)}
                  disabled={deleteSessionMutation.isPending}
                  className="text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No active sessions found.</div>
        )}
      </div>
    </div>
  );
}

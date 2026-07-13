import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import apiQuery from "@/hooks/use-api-query";
import useCurrentUser from "@/hooks/use-current-user";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AsyncButton } from "@/components/custom/async-button";

export default function ProfileTab() {
  const currentUser = useCurrentUser();
  const updateProfileMutation = apiQuery.auth.useUpdateProfile();
  const updateProfileImageMutation = apiQuery.auth.useUpdateProfileImage();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
    }
  }, [currentUser]);

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await updateProfileImageMutation.mutateAsync(formData);
      toast.success("Profile image updated successfully");
    } catch {
      toast.error("Failed to upload profile image");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        firstName,
        lastName,
      });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const fullName = `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`;
  const nameShort = `${currentUser?.firstName?.[0] || ""}${currentUser?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      <div className="space-y-4">
        {/* Avatar Image Upload Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border">
              <AvatarImage src={currentUser?.profileImage || ""} alt={fullName} />
              <AvatarFallback className="text-xl">{nameShort}</AvatarFallback>
            </Avatar>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfileImageUpload}
            accept="image/jpeg,image/png"
            className="hidden"
          />
          <AsyncButton
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            loading={updateProfileImageMutation.isPending}
          >
            <Camera className="mr-2 size-4" />
            Upload image
          </AsyncButton>
        </div>

        {/* First Name Field */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold block" htmlFor="firstName">
              First Name
            </label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold block" htmlFor="lastName">
              Last Name
            </label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Email Dropdown Select (Disabled / View-Only) */}
        <div className="space-y-2">
          <label className="text-sm font-semibold block" htmlFor="email-select">
            Email
          </label>
          <div className="relative">
            <select
              id="email-select"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8 cursor-pointer"
              defaultValue={currentUser?.email || ""}
              disabled
            >
              <option value={currentUser?.email || ""}>
                {currentUser?.email || "Select a verified email to display"}
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <p className="text-[12px] text-muted-foreground">
            Your login email address. This cannot be changed directly here.
          </p>
        </div>
      </div>

      <AsyncButton type="submit" loading={updateProfileMutation.isPending}>
        Update profile
      </AsyncButton>
    </form>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useCurrentUser from "@/hooks/use-current-user";
import dayjs from "dayjs";
import { Calendar, Camera, Mail } from "lucide-react";

export default function ProfileHeader() {
  const currentUser = useCurrentUser();
  const avatar = currentUser?.profileImage || "";
  const fullName = `${currentUser?.firstName || ""} ${
    currentUser?.lastName || ""
  }`;
  const email = currentUser?.email || "";
  const nameShort = `${currentUser?.firstName?.[0] || ""}${
    currentUser?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} alt={fullName} />
              <AvatarFallback className="text-2xl">{nameShort}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            >
              <Camera />
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{fullName}</h1>
              {/* <Badge variant="secondary">Pro Member</Badge> */}
            </div>
            {/* <p className="text-muted-foreground">Senior Product Designer</p> */}
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {email}
              </div>
              {/* <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                San Francisco, CA
              </div> */}
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Joined{" "}
                {currentUser?.createdAt
                  ? dayjs(currentUser?.createdAt).format("MMMM D, YYYY")
                  : ""}
              </div>
            </div>
          </div>
          <Button variant="default">Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}

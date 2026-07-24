import type { UserType } from "@/api/user-api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/date-time"
import type { DialogStateType } from "@/routes/private-admin/private-admin-route"
import { useNavigate } from "@tanstack/react-router"

const DialogViewMode = ({
  data,
}: {
  state: DialogStateType
  data?: UserType
}) => {
  const navigate = useNavigate()

  const onClose = () => {
    navigate({
      to: "/app/user",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Detailed view of user profile, contact information, and role.
          </DialogDescription>
        </DialogHeader>
        {data && (
          <div className="grid gap-4 py-2 text-sm">
            <div className="flex items-center gap-4">
              {data.profileImage ? (
                <img
                  src={data.profileImage}
                  alt={data.firstName}
                  className="h-16 w-16 rounded-full border object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-primary/10 text-xl font-bold text-primary">
                  {data.firstName[0]}
                  {data.lastName ? data.lastName[0] : ""}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold">
                  {data.firstName} {data.lastName || ""}
                </h3>
                <p className="text-sm text-muted-foreground">{data.email}</p>
              </div>
            </div>
            <hr />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block font-semibold text-muted-foreground">
                  Role
                </span>
                <span className="font-medium">{data.role}</span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">
                  Salary
                </span>
                <span>
                  {data.salary !== undefined && data.salary !== null
                    ? `$${data.salary}`
                    : "-"}
                </span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">
                  Country
                </span>
                <span>
                  {data.country
                    ? `${data.country.flag} ${data.country.name}`
                    : "-"}
                </span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">
                  State
                </span>
                <span>{data.state ? data.state.name : "-"}</span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">
                  Address
                </span>
                <span>{data.address || "-"}</span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">
                  Zip Code
                </span>
                <span>{data.zip || "-"}</span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">
                  Created At
                </span>
                <span>{formatDate(data.createdAt)}</span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">
                  Last Updated
                </span>
                <span>{formatDate(data.updatedAt)}</span>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" onClick={onClose} />}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogViewMode

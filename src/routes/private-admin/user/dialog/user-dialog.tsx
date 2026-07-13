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
import apiQuery from "@/hooks/use-api-query"
import useQueryLoadingState from "@/hooks/use-query-loading-state"
import { formatDate } from "@/lib/date-time"
import type { DialogStateType } from "@/routes/private-admin/private-admin-route"
import { useNavigate } from "@tanstack/react-router"
import DialogSkeleton from "../../product/dialog/dialog-skeleton"

export type UserDialogProps = {
  state: DialogStateType
  data?: UserType
}
const UserDialog = ({ state }: UserDialogProps) => {
  const userQuery = state.id ? apiQuery.user.useGet(state.id) : undefined
  const { isLoading } = useQueryLoadingState(userQuery ? [userQuery] : [])

  if (isLoading) return <DialogSkeleton />
  return <DialogMain state={state} data={userQuery?.data?.data} />
}
export default UserDialog

const DialogMain = ({ data }: UserDialogProps) => {
  const navigate = useNavigate()

  const onClose = () => {
    navigate({
      to: ".",
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Detailed view of user profile and permission role.
          </DialogDescription>
        </DialogHeader>
        {data && (
          <div className="grid gap-4 py-4">
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
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block font-semibold text-muted-foreground">
                  Role
                </span>
                <span className="capitalize">{data.role}</span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">
                  Status
                </span>
                <span>Active</span>
              </div>
              <div>
                <span className="block font-semibold text-muted-foreground">
                  Joined At
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

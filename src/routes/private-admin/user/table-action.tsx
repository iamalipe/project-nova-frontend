import type { UserType } from "@/api/user-api"
import alertPopup from "@/components/alert-popup/alert-popup"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import apiQuery from "@/hooks/use-api-query"
import { useIsMobile } from "@/hooks/use-mobile"
import { validateAndStringify } from "@/lib/generic-validation"
import { useTableRowsSelect } from "@/store/use-table-columns-select-store"
import { useNavigate } from "@tanstack/react-router"
import { Menu, XIcon } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"
import { dialogStateZodSchema } from "../private-admin-route"

const useUserRowActions = (data: UserType) => {
  const navigate = useNavigate({ from: "/app/user" })
  const { data: currentUserRes } = apiQuery.auth.useGetCurrentUser();
  const currentUser = currentUserRes?.data;
  const isSuperuser = currentUser?.role === "superuser";
  const isSelf = currentUser?.id === data.id;

  const onView = async () => {
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "User",
      id: data.id,
      mode: "VIEW",
    })
    if (!ds) return
    navigate({
      search: (prev) => ({
        ...prev,
        ds: ds,
      }),
    })
  }

  const onDelete = async () => {
    const deleteRes = await alertPopup.delete()
    if (deleteRes.response) {
      try {
        const res = await apiQuery.user.delete(data.id)
        if (res.success) {
          toast.success(res.message || "Record Deleted")
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete user")
      }
    }
  }

  return { onView, onDelete, isSuperuser, isSelf }
}

export const TableAction = ({ data }: { data: UserType }) => {
  const isMobile = useIsMobile()
  const { onView, onDelete, isSuperuser, isSelf } = useUserRowActions(data)

  const showDelete = isSuperuser && !isSelf;

  if (isMobile) {
    return (
      <div className="flex gap-2">
        <Button onClick={onView} size="sm" variant="outline">
          View
        </Button>
        {showDelete && (
          <Button onClick={onDelete} size="sm" variant="destructive">
            Delete
          </Button>
        )}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size="icon" variant="outline">
            <Menu />
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onView}>View</DropdownMenuItem>
          {showDelete && (
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const TableActionContextMenu = ({ data }: { data: UserType }) => {
  const { onView, onDelete, isSuperuser, isSelf } = useUserRowActions(data)

  const showDelete = isSuperuser && !isSelf;

  return (
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuLabel>Action</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onView}>View</ContextMenuItem>
        {showDelete && (
          <ContextMenuItem className="text-destructive" onClick={onDelete}>
            Delete
          </ContextMenuItem>
        )}
      </ContextMenuGroup>
    </ContextMenuContent>
  )
}

export const TableRowsSelect = ({
  data,
  type = "row",
}: {
  data?: UserType
  type?: "header" | "row"
}) => {
  const { isRowSelect, toggleRowSelect, selectedRows } =
    useTableRowsSelect("user")

  const { data: currentUserRes } = apiQuery.auth.useGetCurrentUser();
  const currentUser = currentUserRes?.data;
  const isSuperuser = currentUser?.role === "superuser";
  
  // Can't select self for deletion
  const isSelf = data ? currentUser?.id === data.id : false;
  const disabled = data ? isSelf || !isSuperuser : !isSuperuser;

  const checkedState: boolean | "indeterminate" | undefined =
    type === "header" && selectedRows.length > 0
      ? "indeterminate"
      : data
        ? isRowSelect(data.id)
        : false

  const indeterminate = checkedState === "indeterminate"
  const checked = indeterminate ? false : (checkedState as boolean | undefined)

  const onCheckedChange = () => {
    if (type === "row" && data && !disabled) {
      toggleRowSelect(data.id)
    }
  }

  if (disabled && type === "row") {
    return <Checkbox checked={false} disabled aria-label="Select row disabled" className="translate-y-[2px]" />
  }

  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      onCheckedChange={onCheckedChange}
      aria-label={type === "header" ? "Select All" : "Select row"}
      className="translate-y-[2px]"
    />
  )
}

export const TableSelectAction = () => {
  const { selectedRows, clearRowSelect } = useTableRowsSelect("user")

  useEffect(() => {
    return () => {
      clearRowSelect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClearSelection = () => {
    clearRowSelect()
  }

  const onDelete = async () => {
    const deleteRes = await alertPopup.delete()
    if (!deleteRes.response) return

    try {
      const res = await apiQuery.user.deleteMany(selectedRows)
      clearRowSelect()
      toast.success(res.message || `${res.data.count} record(s) deleted`)
    } catch {
      toast.error("Failed to delete selected records")
    }
  }

  if (selectedRows.length === 0) return null
  return (
    <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 gap-2 rounded-md border bg-muted p-2 text-muted-foreground shadow-xl drop-shadow-lg">
      <div className="flex items-center gap-2 pl-2">
        {selectedRows.length} Selected
        <Button
          onClick={onClearSelection}
          title="Clear selection"
          variant="outline"
          size="icon-sm"
        >
          <XIcon />
        </Button>
      </div>
      <Button
        onClick={onDelete}
        title="Delete selected"
        size="sm"
        variant="destructive"
      >
        Delete
      </Button>
    </div>
  )
}

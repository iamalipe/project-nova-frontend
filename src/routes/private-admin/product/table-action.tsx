import type { ProductType } from "@/api/product-api";
import alertPopup from "@/components/alert-popup/alert-popup";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import apiQuery from "@/hooks/use-api-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { validateAndStringify } from "@/lib/generic-validation";
import { useTableRowsSelect } from "@/store/use-table-columns-select-store";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Menu, XIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { dialogStateZodSchema } from "../private-admin-route";

export const TableAction = ({ data }: { data: ProductType }) => {
  const navigate = useNavigate({ from: "/app/product" });
  const isMobile = useIsMobile();
  const router = useRouter();
  const onView = async () => {
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "Product",
      id: data.id,
      mode: "VIEW",
    });
    if (!ds) return;
    navigate({
      search: (prev:any) => ({
        ...prev,
        ds: ds,
      }),
    });
  };
  const onUpdate = async () => {
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "Product",
      id: data.id,
      mode: "UPDATE",
    });
    if (!ds) return;
    navigate({
      search: (prev:any) => ({
        ...prev,
        ds: ds,
      }),
    });
  };

  const onDelete = async () => {
    const deleteRes = await alertPopup.delete();
    if (deleteRes) {
      const res = await apiQuery.product.delete(data.id);
      if (res.success) {
        toast.success(res.message || "Record Deleted");
        router.invalidate();
      }
    }
  };

  if (isMobile) {
    return (
      <div className="flex gap-2">
        <Button onClick={onView} size="sm" variant="outline">
          View
        </Button>
        <Button onClick={onUpdate} size="sm" variant="outline">
          Update
        </Button>
        <Button onClick={onDelete} size="sm" variant="destructive">
          Delete
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button size="icon" variant="outline">
          <Menu />
        </Button>}>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onView}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={onUpdate}>Update</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={onDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const TableActionContextMenu = ({ data }: { data: ProductType }) => {
  const navigate = useNavigate({ from: "/app/product" });
  const router = useRouter();
  const onView = async () => {
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "Product",
      id: data.id,
      mode: "VIEW",
    });
    if (!ds) return;
    navigate({
      search: (prev:any) => ({
        ...prev,
        ds: ds,
      }),
    });
  };
  const onUpdate = async () => {
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "Product",
      id: data.id,
      mode: "UPDATE",
    });
    if (!ds) return;
    navigate({
      search: (prev:any) => ({
        ...prev,
        ds: ds,
      }),
    });
  };

  const onDelete = async () => {
    const deleteRes = await alertPopup.delete();
    if (deleteRes) {
      const res = await apiQuery.product.delete(data.id);
      if (res.success) {
        toast.success(res.message || "Record Deleted");
        router.invalidate();
      }
    }
  };

  return (
    <ContextMenuContent>
      <ContextMenuLabel>Action</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={onView}>View</ContextMenuItem>
      <ContextMenuItem onClick={onUpdate}>Update</ContextMenuItem>
      <ContextMenuItem className="text-destructive" onClick={onDelete}>
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
};

export const TableRowsSelect = ({
  data,
  type = "row",
}: {
  data?: ProductType;
  type?: "header" | "row";
}) => {
  const { isRowSelect, toggleRowSelect, selectedRows } =
    useTableRowsSelect("product");

  const checked =
    type === "header" && selectedRows.length > 0
      ? "indeterminate"
      : data
        ? isRowSelect(data.id)
        : false;

  const onCheckedChange = (checked?:boolean | "indeterminate" ) => {
    console.log("checked", checked);

    if (type === "row" && data) {
      toggleRowSelect(data.id);
    }
  };

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={type === "header" ? "Select All" : "Select row"}
      className="translate-y-[2px]"
    />
  );
};

export const TableSelectAction = () => {
  const { selectedRows, clearRowSelect } = useTableRowsSelect("product");

  useEffect(() => {
    return () => {
      clearRowSelect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClearSelection = () => {
    clearRowSelect();
  };

  const onDelete = async () => {
    const deleteRes = await alertPopup.delete();
    if (deleteRes) {
      console.log("onDelete", selectedRows);
    }
  };

  if (selectedRows.length === 0) return null;
  return (
    <div className="fixed p-2 gap-2 bg-white shadow-xl drop-shadow-lg rounded-md border flex bottom-8 left-1/2 -translate-x-1/2">
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
  );
};

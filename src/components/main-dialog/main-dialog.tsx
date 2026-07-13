import { validateAndParse } from "@/lib/generic-validation";
import {
  dialogStateZodSchema,
  type DialogStateType,
} from "@/routes/private-admin/private-admin-route";
import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";

import ProductDialogAll from "@/routes/private-admin/product/dialog-all/product-dialog-all";
import ProductDialog from "@/routes/private-admin/product/dialog/product-dialog";
import UserDialog from "@/routes/private-admin/user/dialog/user-dialog";

type DialogName = NonNullable<DialogStateType["dialog"]>;

/**
 * Registry mapping a dialog name (from `dialogStateZodSchema`) to the
 * component responsible for rendering it. Adding support for a new
 * dialog is a one-line addition here instead of editing branching logic
 * in this file.
 */
const dialogRegistry: Record<
  DialogName,
  React.ComponentType<{ state: DialogStateType }>
> = {
  Product: ({ state }) => {
    if (state.mode && ["CREATE", "UPDATE", "VIEW"].includes(state.mode)) {
      return <ProductDialog state={state} />;
    }
    if (state.mode && ["VIEW-ALL"].includes(state.mode)) {
      return <ProductDialogAll state={state} />;
    }
    return null;
  },
  User: ({ state }) => {
    if (state.mode && ["VIEW"].includes(state.mode)) {
      return <UserDialog state={state} />;
    }
    return null;
  },
};

const MainDialog = () => {
  const searchParams = useSearch({
    from: "/app",
  });
  const dialogState = useMemo(() => {
    return validateAndParse(dialogStateZodSchema, searchParams.ds);
  }, [searchParams.ds]);

  if (!dialogState || !dialogState.dialog) return null;

  const DialogComponent = dialogRegistry[dialogState.dialog];
  if (!DialogComponent) return null;

  return <DialogComponent state={dialogState} />;
};

export default MainDialog;

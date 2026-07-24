import { validateAndParse } from "@/lib/generic-validation";
import {
  dialogStateZodSchema,
  type DialogStateType,
} from "@/routes/private-admin/private-admin-route";
import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";

import CategoryDialog from "@/routes/private-admin/category/dialog/category-dialog";
import CategoryDialogAll from "@/routes/private-admin/category/dialog-all/category-dialog-all";
import CategoryImportDialog from "@/routes/private-admin/category/dialog-import/category-import-dialog";
import SubcategoryDialog from "@/routes/private-admin/subcategory/dialog/subcategory-dialog";
import SubcategoryDialogAll from "@/routes/private-admin/subcategory/dialog-all/subcategory-dialog-all";
import SubcategoryImportDialog from "@/routes/private-admin/subcategory/dialog-import/subcategory-import-dialog";
import ProductDialogAll from "@/routes/private-admin/product/dialog-all/product-dialog-all";
import ProductDialog from "@/routes/private-admin/product/dialog/product-dialog";
import ProductImportDialog from "@/routes/private-admin/product/dialog-import/product-import-dialog";
import UserDialog from "@/routes/private-admin/user/dialog/user-dialog";
import UserDialogAll from "@/routes/private-admin/user/dialog-all/user-dialog-all";
import UserImportDialog from "@/routes/private-admin/user/dialog-import/user-import-dialog";
import CountryDialog from "@/routes/private-admin/country/dialog/country-dialog";
import CountryDialogAll from "@/routes/private-admin/country/dialog-all/country-delete-all-dialog";
import CountryImportDialog from "@/routes/private-admin/country/dialog-import/country-import-dialog";
import StateDialog from "@/routes/private-admin/state/dialog/state-dialog";
import StateDialogAll from "@/routes/private-admin/state/dialog-all/state-dialog-all";
import StateImportDialog from "@/routes/private-admin/state/dialog-import/state-import-dialog";

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
    if (state.mode && ["IMPORT"].includes(state.mode)) {
      return <ProductImportDialog state={state} />;
    }
    return null;
  },
  User: ({ state }) => {
    if (state.mode && ["CREATE", "UPDATE", "VIEW"].includes(state.mode)) {
      return <UserDialog state={state} />;
    }
    if (state.mode && ["VIEW-ALL"].includes(state.mode)) {
      return <UserDialogAll state={state} />;
    }
    if (state.mode && ["IMPORT"].includes(state.mode)) {
      return <UserImportDialog state={state} />;
    }
    return null;
  },
  Category: ({ state }) => {
    if (state.mode && ["CREATE", "UPDATE", "VIEW"].includes(state.mode)) {
      return <CategoryDialog state={state} />;
    }
    if (state.mode && ["VIEW-ALL"].includes(state.mode)) {
      return <CategoryDialogAll state={state} />;
    }
    if (state.mode && ["IMPORT"].includes(state.mode)) {
      return <CategoryImportDialog state={state} />;
    }
    return null;
  },
  Subcategory: ({ state }) => {
    if (state.mode && ["CREATE", "UPDATE", "VIEW"].includes(state.mode)) {
      return <SubcategoryDialog state={state} />;
    }
    if (state.mode && ["VIEW-ALL"].includes(state.mode)) {
      return <SubcategoryDialogAll state={state} />;
    }
    if (state.mode && ["IMPORT"].includes(state.mode)) {
      return <SubcategoryImportDialog state={state} />;
    }
    return null;
  },
  Country: ({ state }) => {
    if (state.mode && ["CREATE", "UPDATE", "VIEW"].includes(state.mode)) {
      return <CountryDialog state={state} />;
    }
    if (state.mode && ["VIEW-ALL"].includes(state.mode)) {
      return <CountryDialogAll state={state} />;
    }
    if (state.mode && ["IMPORT"].includes(state.mode)) {
      return <CountryImportDialog state={state} />;
    }
    return null;
  },
  CountryState: ({ state }) => {
    if (state.mode && ["CREATE", "UPDATE", "VIEW"].includes(state.mode)) {
      return <StateDialog state={state} />;
    }
    if (state.mode && ["VIEW-ALL"].includes(state.mode)) {
      return <StateDialogAll state={state} />;
    }
    if (state.mode && ["IMPORT"].includes(state.mode)) {
      return <StateImportDialog state={state} />;
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

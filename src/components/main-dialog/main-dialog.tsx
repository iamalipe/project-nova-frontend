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

import StoreDialog from "@/routes/private-admin/store/dialog/store-dialog";
import StoreDialogAll from "@/routes/private-admin/store/dialog-all/store-dialog-all";
import StoreImportDialog from "@/routes/private-admin/store/dialog-import/store-import-dialog";

import WarehouseDialog from "@/routes/private-admin/warehouse/dialog/warehouse-dialog";
import WarehouseDialogAll from "@/routes/private-admin/warehouse/dialog-all/warehouse-dialog-all";
import WarehouseImportDialog from "@/routes/private-admin/warehouse/dialog-import/warehouse-import-dialog";

import StockDialog from "@/routes/private-admin/stock/dialog/stock-dialog";
import StockDialogAll from "@/routes/private-admin/stock/dialog-all/stock-dialog-all";
import StockImportDialog from "@/routes/private-admin/stock/dialog-import/stock-import-dialog";

import StockTransactionDialog from "@/routes/private-admin/stock-transaction/dialog/stock-transaction-dialog";
import StockTransactionDialogAll from "@/routes/private-admin/stock-transaction/dialog-all/stock-transaction-dialog-all";
import StockTransactionImportDialog from "@/routes/private-admin/stock-transaction/dialog-import/stock-transaction-import-dialog";

import SellDialog from "@/routes/private-admin/sell/dialog/sell-dialog";
import SellDialogAll from "@/routes/private-admin/sell/dialog-all/sell-dialog-all";
import SellImportDialog from "@/routes/private-admin/sell/dialog-import/sell-import-dialog";

type DialogName = NonNullable<DialogStateType["dialog"]>;

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
  Store: ({ state }) => {
    if (state.mode && ["CREATE", "UPDATE", "VIEW"].includes(state.mode)) {
      return <StoreDialog state={state} />;
    }
    if (state.mode && ["VIEW-ALL"].includes(state.mode)) {
      return <StoreDialogAll state={state} />;
    }
    if (state.mode && ["IMPORT"].includes(state.mode)) {
      return <StoreImportDialog state={state} />;
    }
    return null;
  },
  Warehouse: ({ state }) => {
    if (state.mode && ["CREATE", "UPDATE", "VIEW"].includes(state.mode)) {
      return <WarehouseDialog state={state} />;
    }
    if (state.mode && ["VIEW-ALL"].includes(state.mode)) {
      return <WarehouseDialogAll state={state} />;
    }
    if (state.mode && ["IMPORT"].includes(state.mode)) {
      return <WarehouseImportDialog state={state} />;
    }
    return null;
  },
  Stock: ({ state }) => {
    if (state.mode && ["CREATE", "UPDATE", "VIEW"].includes(state.mode)) {
      return <StockDialog state={state} />;
    }
    if (state.mode && ["VIEW-ALL"].includes(state.mode)) {
      return <StockDialogAll state={state} />;
    }
    if (state.mode && ["IMPORT"].includes(state.mode)) {
      return <StockImportDialog state={state} />;
    }
    return null;
  },
  StockTransaction: ({ state }) => {
    if (state.mode && ["CREATE", "UPDATE", "VIEW"].includes(state.mode)) {
      return <StockTransactionDialog state={state} />;
    }
    if (state.mode && ["VIEW-ALL"].includes(state.mode)) {
      return <StockTransactionDialogAll state={state} />;
    }
    if (state.mode && ["IMPORT"].includes(state.mode)) {
      return <StockTransactionImportDialog state={state} />;
    }
    return null;
  },
  Sell: ({ state }) => {
    if (state.mode && ["CREATE", "UPDATE", "VIEW"].includes(state.mode)) {
      return <SellDialog state={state} />;
    }
    if (state.mode && ["VIEW-ALL"].includes(state.mode)) {
      return <SellDialogAll state={state} />;
    }
    if (state.mode && ["IMPORT"].includes(state.mode)) {
      return <SellImportDialog state={state} />;
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

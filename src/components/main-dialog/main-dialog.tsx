import { validateAndParse } from "@/lib/generic-validation";
import { dialogStateZodSchema } from "@/routes/private-admin/private-admin-route";
import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";

import ProductDialogAll from "@/routes/private-admin/product/dialog-all/product-dialog-all";
import ProductDialog from "@/routes/private-admin/product/dialog/product-dialog";

const MainDialog = () => {
  const searchParams = useSearch({
    from: "/admin",
  });
  const dialogState = useMemo(() => {
    return validateAndParse(dialogStateZodSchema, searchParams.ds);
  }, [searchParams.ds]);

  if (!dialogState) return null;

  if (
    dialogState?.dialog === "Product" &&
    dialogState.mode &&
    ["CREATE", "UPDATE", "VIEW"].includes(dialogState.mode)
  ) {
    return <ProductDialog state={dialogState} />;
  }
  if (
    dialogState?.dialog === "Product" &&
    dialogState.mode &&
    ["VIEW-ALL"].includes(dialogState.mode)
  ) {
    return <ProductDialogAll state={dialogState} />;
  }

  return null;
};

export default MainDialog;

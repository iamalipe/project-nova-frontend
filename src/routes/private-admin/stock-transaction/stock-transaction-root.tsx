import apiQuery from "@/hooks/use-api-query";
import { deleteKeysFromObject } from "@/lib/utils";
import { Outlet, useSearch } from "@tanstack/react-router";
import StockTransaction from "./stock-transaction";
import StockTransactionSkeleton from "./stock-transaction-skeleton";

const StockTransactionRoot = () => {
  const searchData = useSearch({ from: "/app/stock-transaction" });
  const sanitizedSearchData = deleteKeysFromObject(searchData, ["ds"]);
  const getAllStockTransactionQuery = apiQuery.stockTransaction.useGetAll(sanitizedSearchData);
  const isLoading = getAllStockTransactionQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <StockTransactionSkeleton />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <StockTransaction rawQuery={getAllStockTransactionQuery} />
      <Outlet />
    </>
  );
};

export default StockTransactionRoot;

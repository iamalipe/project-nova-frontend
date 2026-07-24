import apiQuery from "@/hooks/use-api-query";
import { deleteKeysFromObject } from "@/lib/utils";
import { Outlet, useSearch } from "@tanstack/react-router";
import Stock from "./stock";
import StockSkeleton from "./stock-skeleton";

const StockRoot = () => {
  const searchData = useSearch({ from: "/app/stock" });
  const sanitizedSearchData = deleteKeysFromObject(searchData, ["ds"]);
  const getAllStockQuery = apiQuery.stock.useGetAll(sanitizedSearchData);
  const isLoading = getAllStockQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <StockSkeleton />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Stock rawQuery={getAllStockQuery} />
      <Outlet />
    </>
  );
};

export default StockRoot;

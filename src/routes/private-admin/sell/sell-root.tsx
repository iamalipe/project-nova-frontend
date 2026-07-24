import apiQuery from "@/hooks/use-api-query";
import { deleteKeysFromObject } from "@/lib/utils";
import { Outlet, useSearch } from "@tanstack/react-router";
import Sell from "./sell";
import SellSkeleton from "./sell-skeleton";

const SellRoot = () => {
  const searchData = useSearch({ from: "/app/sell" });
  const sanitizedSearchData = deleteKeysFromObject(searchData, ["ds"]);
  const getAllSellQuery = apiQuery.sell.useGetAll(sanitizedSearchData);
  const isLoading = getAllSellQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <SellSkeleton />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Sell rawQuery={getAllSellQuery} />
      <Outlet />
    </>
  );
};

export default SellRoot;

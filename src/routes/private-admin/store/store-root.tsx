import apiQuery from "@/hooks/use-api-query";
import { deleteKeysFromObject } from "@/lib/utils";
import { Outlet, useSearch } from "@tanstack/react-router";
import Store from "./store";
import StoreSkeleton from "./store-skeleton";

const StoreRoot = () => {
  const searchData = useSearch({ from: "/app/store" });
  const sanitizedSearchData = deleteKeysFromObject(searchData, ["ds"]);
  const getAllStoreQuery = apiQuery.store.useGetAll(sanitizedSearchData);
  const isLoading = getAllStoreQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <StoreSkeleton />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Store rawQuery={getAllStoreQuery} />
      <Outlet />
    </>
  );
};

export default StoreRoot;

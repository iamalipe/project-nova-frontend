import apiQuery from "@/hooks/use-api-query";
import { deleteKeysFromObject } from "@/lib/utils";
import { Outlet, useSearch } from "@tanstack/react-router";
import Warehouse from "./warehouse";
import WarehouseSkeleton from "./warehouse-skeleton";

const WarehouseRoot = () => {
  const searchData = useSearch({ from: "/app/warehouse" });
  const sanitizedSearchData = deleteKeysFromObject(searchData, ["ds"]);
  const getAllWarehouseQuery = apiQuery.warehouse.useGetAll(sanitizedSearchData);
  const isLoading = getAllWarehouseQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <WarehouseSkeleton />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Warehouse rawQuery={getAllWarehouseQuery} />
      <Outlet />
    </>
  );
};

export default WarehouseRoot;

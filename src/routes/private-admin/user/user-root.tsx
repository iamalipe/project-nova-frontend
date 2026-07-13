import apiQuery from "@/hooks/use-api-query";
import { deleteKeysFromObject } from "@/lib/utils";
import { Outlet, useSearch } from "@tanstack/react-router";
import User from "./user";
import ProductSkeleton from "../product/product-skeleton";

const UserRoot = () => {
  const searchData = useSearch({ from: "/app/user" });
  const sanitizedSearchData = deleteKeysFromObject(searchData, ["ds"]);
  const getAllUserQuery = apiQuery.user.useGetAll(sanitizedSearchData);
  const isLoading = getAllUserQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <ProductSkeleton />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <User rawQuery={getAllUserQuery} />
      <Outlet />
    </>
  );
};

export default UserRoot;

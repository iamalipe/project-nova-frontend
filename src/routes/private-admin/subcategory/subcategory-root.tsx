import apiQuery from "@/hooks/use-api-query";
import { deleteKeysFromObject } from "@/lib/utils";
import { Outlet, useSearch } from "@tanstack/react-router";
import Subcategory from "./subcategory";
import SubcategorySkeleton from "./subcategory-skeleton";

const SubcategoryRoot = () => {
  const searchData = useSearch({ from: "/app/subcategory" });
  const sanitizedSearchData = deleteKeysFromObject(searchData, ["ds"]);
  const getAllSubcategoryQuery = apiQuery.subcategory.useGetAll(sanitizedSearchData);
  const isLoading = getAllSubcategoryQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <SubcategorySkeleton />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Subcategory rawQuery={getAllSubcategoryQuery} />
      <Outlet />
    </>
  );
};

export default SubcategoryRoot;

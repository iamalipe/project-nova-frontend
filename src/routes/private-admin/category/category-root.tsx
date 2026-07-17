import apiQuery from "@/hooks/use-api-query";
import { deleteKeysFromObject } from "@/lib/utils";
import { Outlet, useSearch } from "@tanstack/react-router";
import Category from "./category";
import CategorySkeleton from "./category-skeleton";

const CategoryRoot = () => {
  const searchData = useSearch({ from: "/app/category" });
  const sanitizedSearchData = deleteKeysFromObject(searchData, ["ds"]);
  const getAllCategoryQuery = apiQuery.category.useGetAll(sanitizedSearchData);
  const isLoading = getAllCategoryQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <CategorySkeleton />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Category rawQuery={getAllCategoryQuery} />
      <Outlet />
    </>
  );
};

export default CategoryRoot;

import apiQuery from "@/hooks/use-api-query";
import { deleteKeysFromObject } from "@/lib/utils";
import { Outlet, useSearch } from "@tanstack/react-router";
import Product from "./product";
import ProductSkeleton from "./product-skeleton";

const ProductRoot = () => {
  const searchData = useSearch({ from: "/app/product" });
  const sanitizedSearchData = deleteKeysFromObject(searchData, ["ds", "categoryId"]);
  const getAllProductQuery = apiQuery.product.useGetAll(sanitizedSearchData);
  const isLoading = getAllProductQuery.isLoading;

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
      <Product rawQuery={getAllProductQuery} />
      <Outlet />
    </>
  );
};

export default ProductRoot;

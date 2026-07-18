import apiQuery from "@/hooks/use-api-query";
import { deleteKeysFromObject } from "@/lib/utils";
import { Outlet, useSearch } from "@tanstack/react-router";
import Country from "./country";
import CountrySkeleton from "./country-skeleton";

const CountryRoot = () => {
  const searchData = useSearch({ from: "/app/country" });
  const sanitizedSearchData = deleteKeysFromObject(searchData, ["ds"]);
  const getAllCountryQuery = apiQuery.country.useGetAll(sanitizedSearchData);
  const isLoading = getAllCountryQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <CountrySkeleton />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Country rawQuery={getAllCountryQuery} />
      <Outlet />
    </>
  );
};

export default CountryRoot;

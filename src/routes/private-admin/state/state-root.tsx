import apiQuery from "@/hooks/use-api-query";
import { deleteKeysFromObject } from "@/lib/utils";
import { Outlet, useSearch } from "@tanstack/react-router";
import State from "./state";
import StateSkeleton from "./state-skeleton";

const StateRoot = () => {
  const searchData = useSearch({ from: "/app/state" });
  const sanitizedSearchData = deleteKeysFromObject(searchData, ["ds"]);
  const getAllStateQuery = apiQuery.state.useGetAll(sanitizedSearchData);
  const isLoading = getAllStateQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <StateSkeleton />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <State rawQuery={getAllStateQuery} />
      <Outlet />
    </>
  );
};

export default StateRoot;

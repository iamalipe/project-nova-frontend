import apiQuery from "./use-api-query";


// const currentUser = useCurrentUser()
const useCurrentUser = () => {
  const currentUserQuery = apiQuery.auth.useGetCurrentUser();

  return currentUserQuery.data?.data || null;
};

export default useCurrentUser;

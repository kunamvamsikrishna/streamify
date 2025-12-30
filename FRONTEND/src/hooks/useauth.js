import { useQuery } from "@tanstack/react-query";
import { AuthUser } from "../lib/api.js";

export default function useAuthUser() {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: AuthUser,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // If query fails or is error, treat as not loading
  const isLoading = query.isLoading && !query.isError;
  const authUser = query.isError ? null : query.data;

  return { isLoading, authUser, error: query.error };
}
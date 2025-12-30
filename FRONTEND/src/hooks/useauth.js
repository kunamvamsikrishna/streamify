import { useQuery } from "@tanstack/react-query";
import { AuthUser } from "../lib/api.js";

export default function useAuthUser() {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: AuthUser,
    retry: false,
  });

  return { isLoading: query.isLoading, authUser: query.data };
}
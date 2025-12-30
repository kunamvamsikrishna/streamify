import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api.js";

export default function useLogout() {
    const queryClient = useQueryClient();
    const { mutate: logoutMutation, isPending } = useMutation({
      mutationFn: logout,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    })
    return { logoutMutation }
}   
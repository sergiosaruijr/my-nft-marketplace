import { useNavigate } from "@tanstack/react-router";
import { useLogout } from "./useAuth";

export function useSignOut() {
  const logout = useLogout();
  const navigate = useNavigate();
  return () =>
    logout.mutate(undefined, { onSettled: () => navigate({ to: "/" }) });
}

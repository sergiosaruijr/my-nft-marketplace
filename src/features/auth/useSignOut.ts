import { useNavigate } from "@tanstack/react-router";
import { isDesktop } from "../../lib/viewport";
import { useLogout } from "./useAuth";

// desktop: volta ao catálogo (sem abrir modal); mobile: volta ao login (Verificar se faz sentido igual o useAuthGate)
export function useSignOut() {
  const logout = useLogout();
  const navigate = useNavigate();
  return () =>
    logout.mutate(undefined, {
      onSettled: () => navigate({ to: isDesktop() ? "/" : "/login" }),
    });
}

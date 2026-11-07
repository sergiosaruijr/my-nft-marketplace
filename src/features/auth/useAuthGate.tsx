import { useRouter } from "@tanstack/react-router";
import { openAuthModal } from "../../lib/authModal";
import { useSession } from "./useAuth";

export function useAuthGate() {
  const router = useRouter();
  const { data: user } = useSession();
  const isLoggedIn = !!user;
  const guard = (action: () => void) => () =>
    isLoggedIn ? action() : openAuthModal(router);
  return { isLoggedIn, guard };
}

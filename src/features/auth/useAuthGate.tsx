import { skipToken, useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { openAuthModal } from "../../lib/authModal";
import type { User } from "../../types";
import { sessionKey } from "./session";

export function useAuthGate() {
  const router = useRouter();
  const { data: user } = useQuery<User | null>({
    queryKey: sessionKey,
    queryFn: skipToken,
    enabled: false,
  });
  const isLoggedIn = !!user;

  const guard = (action: () => void) => () =>
    isLoggedIn ? action() : openAuthModal(router);

  return { isLoggedIn, guard };
}

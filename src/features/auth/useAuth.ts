import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import {
  clearGuestId,
  clearToken,
  setToken,
  useToken,
} from "../../lib/session";
import type { AuthResponse } from "../../types";
import { fetchSession, sessionKey } from "./session";

type LoginBody = { email: string; password: string };
type SignupBody = LoginBody & { username: string };

export function useSession() {
  const token = useToken();
  const q = useQuery({
    queryKey: sessionKey,
    queryFn: fetchSession,
    enabled: !!token,
    staleTime: 60_000,
    retry: false,
  });
  return { ...q, data: token ? q.data : undefined };
}

function useAuthMutation<T>(path: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: T) =>
      api.post<AuthResponse>(path, body).then((r) => r.data),
    onSuccess: ({ token, user }) => {
      setToken(token);
      clearGuestId();
      qc.resetQueries();
      qc.setQueryData(sessionKey, user);
    },
  });
}

export const useLogin = () => useAuthMutation<LoginBody>("/auth/login");
export const useSignup = () => useAuthMutation<SignupBody>("/auth/signup");

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/auth/logout").catch(() => undefined),
    onSettled: () => {
      clearToken();
      qc.resetQueries();
    },
  });
}

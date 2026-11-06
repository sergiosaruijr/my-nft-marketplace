import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import {
  clearToken,
  setToken,
  clearGuestId,
  getToken,
} from "../../lib/session";
import type { AuthResponse } from "../../types";
import { sessionKey, fetchSession } from "./session";

type LoginBody = { email: string; password: string };
type SignupBody = LoginBody & { username: string };

export const useSession = () =>
  useQuery({
    queryKey: sessionKey,
    queryFn: fetchSession,
    enabled: !!getToken(),
    staleTime: 60_000,
    retry: false,
  });

function useAuthMutation<T>(path: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: T) =>
      api.post<AuthResponse>(path, body).then((r) => r.data),
    onSuccess: ({ token, user }) => {
      qc.clear();
      setToken(token);
      clearGuestId();
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
      qc.clear();
    },
  });
}

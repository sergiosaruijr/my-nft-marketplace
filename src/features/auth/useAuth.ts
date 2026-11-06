import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { clearToken, setToken } from "../../lib/session";
import type { AuthResponse } from "../../types";
import { sessionKey } from "./session";

type LoginBody = { email: string; password: string };
type SignupBody = LoginBody & { username: string };

function useAuthMutation<T>(path: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: T) =>
      api.post<AuthResponse>(path, body).then((r) => r.data),
    onSuccess: ({ token, user }) => {
      qc.clear(); // nunca herdar cache de outro usuário
      setToken(token);
      qc.setQueryData(sessionKey, user);
    },
  });
}

// export const useLogin = () => useAuthMutation<LoginBody>("/auth/login");
// export const useSignup = () => useAuthMutation<SignupBody>("/auth/signup");

// export const useLogin = () => useAuthMutation<LoginBody>("/api/auth/login");
// //
// export const useSignup = () => useAuthMutation<SignupBody>("/api/auth/signup");

// export function useLogout() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: () => api.post("/auth/logout").catch(() => undefined),
//     onSettled: () => {
//       clearToken();
//       qc.clear();
//     },
//   });
// }

export const useLogin = () => useAuthMutation<LoginBody>("/auth/login");
export const useSignup = () => useAuthMutation<SignupBody>("/auth/signup");

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/auth/logout").catch(() => undefined),
    //                              ↑ também sem /api
    onSettled: () => {
      clearToken();
      qc.clear();
    },
  });
}

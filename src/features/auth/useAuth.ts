// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { api } from "../../lib/api";
// import { clearToken, setToken } from "../../lib/session";
// import type { AuthResponse } from "../../types";
// import { sessionKey } from "./session";

// type LoginBody = { email: string; password: string };
// type SignupBody = LoginBody & { username: string };

// function useAuthMutation<T>(path: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (body: T) =>
//       api.post<AuthResponse>(path, body).then((r) => r.data),
//     onSuccess: ({ token, user }) => {
//       qc.clear();
//       setToken(token);
//       qc.setQueryData(sessionKey, user);
//     },
//   });
// }

// export const useLogin = () => useAuthMutation<LoginBody>("/auth/login");
// export const useSignup = () => useAuthMutation<SignupBody>("/auth/signup");

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

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { api } from "../../lib/api";
// import { clearToken, setToken } from "../../lib/session";
// import type { AuthResponse } from "../../types";
// import { sessionKey } from "./session";

// type LoginBody = { email: string; password: string };
// type SignupBody = LoginBody & { username: string };

// function useAuthMutation<T>(path: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (body: T) =>
//       api.post<AuthResponse>(path, body).then((r) => r.data),
//     onSuccess: ({ token, user }) => {
//       // 1) armazenar o token imediatamente (evita que refetchs subsequentes fiquem sem auth)
//       setToken(token);

//       // 2) preencher cache de sessão para consumidores lerem sem refetch
//       qc.setQueryData(sessionKey, user);

//       // 3) invalidar queries dependentes da auth para que refaçam com o token presente
//       // Isso é preferível a qc.clear() aqui (qc.clear pode remover a sessão que acabamos de setar).
//       qc.invalidateQueries(); // refaz as queries com o token já aplicado
//     },
//   });
// }

// export const useLogin = () => useAuthMutation<LoginBody>("/auth/login");
// export const useSignup = () => useAuthMutation<SignupBody>("/auth/signup");

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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import {
  clearGuestId,
  clearToken,
  getToken,
  setToken,
} from "../../lib/session";
import type { AuthResponse } from "../../types";
import { fetchSession, sessionKey } from "./session";

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
      qc.clear(); // nunca herdar cache de outro usuário
      setToken(token);
      clearGuestId();
      qc.setQueryData(sessionKey, user); // depois do clear, para a sessão ficar
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

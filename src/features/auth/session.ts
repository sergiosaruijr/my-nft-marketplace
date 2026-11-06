import type { QueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { clearToken, getToken } from "../../lib/session";
import type { User } from "../../types";

export const sessionKey = ["session"] as const;
const fetchSession = () =>
  api.get<{ user: User }>("/auth/session").then((r) => r.data.user);

export async function getSession(qc: QueryClient): Promise<User | null> {
  if (!getToken()) return null;
  try {
    return await qc.ensureQueryData({
      queryKey: sessionKey,
      queryFn: fetchSession,
      staleTime: 60_000,
    });
  } catch {
    clearToken();
    return null;
  }
}

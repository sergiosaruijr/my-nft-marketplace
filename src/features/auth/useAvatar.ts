import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { User } from "../../types";
import { sessionKey } from "./session";

export function useUpdateAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File | null) => {
      if (!file) return api.delete<User>("/me/avatar").then((r) => r.data);
      const fd = new FormData();
      fd.append("avatar", file);
      return api.post<User>("/me/avatar", fd).then((r) => r.data);
    },
    onSuccess: (user) => qc.setQueryData(sessionKey, user),
  });
}

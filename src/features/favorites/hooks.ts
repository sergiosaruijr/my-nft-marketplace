import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { notify } from "../../components/Announcer";
import { api } from "../../lib/api";
import { getToken } from "../../lib/session";
import { useSession } from "../auth/useAuth";
import type { NFT } from "../../types";

export const favoritesKey = ["favorites"] as const;

export const useFavorites = () =>
  useQuery({
    queryKey: favoritesKey,
    queryFn: ({ signal }) =>
      api.get<NFT[]>("/favorites", { signal }).then((r) => r.data),
    enabled: !!getToken(), // visitante não tem favoritos
  });

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ nft, on }: { nft: NFT; on: boolean }) =>
      on ? api.put(`/favorites/${nft.id}`) : api.delete(`/favorites/${nft.id}`),
    // atualização otimista: a UI muda na hora
    onMutate: async ({ nft, on }) => {
      await qc.cancelQueries({ queryKey: favoritesKey });
      const prev = qc.getQueryData<NFT[]>(favoritesKey);
      qc.setQueryData<NFT[]>(favoritesKey, (old = []) =>
        on
          ? [nft, ...old.filter((n) => n.id !== nft.id)]
          : old.filter((n) => n.id !== nft.id),
      );
      return { prev };
    },
    // rollback se a API falhar
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(favoritesKey, ctx.prev);
      notify(
        "Não foi possível atualizar seus favoritos. A alteração foi desfeita.",
      );
    },
    onSettled: () => qc.invalidateQueries({ queryKey: favoritesKey }),
  });
}

export function useFavoriteToggle(nft: NFT) {
  const router = useRouter();
  const { data: user } = useSession();
  const { data: favs } = useFavorites();
  const toggle = useToggleFavorite();
  const active = !!favs?.some((n) => n.id === nft.id);
  const onClick = () => {
    if (!user)
      return router.navigate({
        to: "/login",
        search: { redirect: router.state.location.href },
      }); // visitante → login
    toggle.mutate({ nft, on: !active });
  };
  return { active, onClick };
}

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { api } from "../../lib/api";
// import { getToken } from "../../lib/session";
// import type {
//   Cart,
//   NFT,
//   Order,
//   Provider,
//   Wallet,
//   WalletInput,
// } from "../../types";

// export const cartKey = ["cart"] as const;
// export const walletsKey = ["wallets"] as const;

// // export const useCart = () =>
// //   useQuery({
// //     queryKey: cartKey,
// //     queryFn: ({ signal }) =>
// //       api.get<Cart>("/cart", { signal }).then((r) => r.data),
// //   });
// export const useCart = () =>
//   useQuery<Cart, Error>({
//     queryKey: cartKey,
//     // só buscar se houver token disponível
//     enabled: !!getToken(),
//     queryFn: ({ signal }) =>
//       api.get<Cart>("/cart", { signal }).then((r) => r.data),
//     // tratar erro para não estourar a UI
//     onError: (err) => {
//       // opcional: log mais específico
//       console.error("[useCart] fetch failed", err);
//     },
//   });

// function useCartMutation<V>(fn: (v: V) => Promise<unknown>) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: fn,
//     onSettled: () => qc.invalidateQueries({ queryKey: cartKey }),
//   });
// }
// export const useAddToCart = () =>
//   useCartMutation((v: { nftId: string; qty: number }) =>
//     api.post("/cart/items", v),
//   );
// export const useSetQty = () =>
//   useCartMutation((v: { nftId: string; qty: number }) =>
//     api.put(`/cart/items/${v.nftId}`, { qty: v.qty }),
//   );
// export const useRemoveItem = () =>
//   useCartMutation((nftId: string) => api.delete(`/cart/items/${nftId}`));
// export const useApplyCoupon = () =>
//   useCartMutation((code: string) => api.put("/cart/coupon", { code }));
// export const useRemoveCoupon = () =>
//   useCartMutation(() => api.delete("/cart/coupon"));

// export const useWallets = () =>
//   useQuery({
//     queryKey: walletsKey,
//     queryFn: ({ signal }) =>
//       api.get<Wallet[]>("/wallets", { signal }).then((r) => r.data),
//   });

// export function useSaveWallet() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ role, data }: { role: Wallet["role"]; data: WalletInput }) =>
//       api.put<Wallet>(`/wallets/${role}`, data).then((r) => r.data),
//     onSuccess: () => qc.invalidateQueries({ queryKey: walletsKey }),
//   });
// }

// export const useCreateOrder = () =>
//   useMutation({
//     mutationFn: ({
//       key,
//       ...body
//     }: {
//       key: string;
//       walletId: string;
//       provider: Provider;
//     }) =>
//       api
//         .post<Order>("/orders", body, { headers: { "Idempotency-Key": key } })
//         .then((r) => r.data),
//   });

// export const useOrder = (id: string) =>
//   useQuery({
//     queryKey: ["order", id],
//     queryFn: ({ signal }) =>
//       api.get<Order>(`/orders/${id}`, { signal }).then((r) => r.data),
//     refetchInterval: (q) => (q.state.data?.status === "pending" ? 1000 : false), // até virar Socket.IO
//   });

// export const useNft = (id?: string) =>
//   useQuery({
//     queryKey: ["nft", id],
//     queryFn: ({ signal }) =>
//       api.get<NFT>(`/nfts/${id}`, { signal }).then((r) => r.data),
//     enabled: !!id,
//     staleTime: 5 * 60_000,
//   });

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
// import { getToken } from "../../lib/session";
import type {
  Cart,
  NFT,
  Order,
  Provider,
  Wallet,
  WalletInput,
} from "../../types";

export const cartKey = ["cart"] as const;
export const walletsKey = ["wallets"] as const;
export const favorites = ["favorites"] as const;

export const useCart = () =>
  useQuery<Cart, Error>({
    queryKey: cartKey,

    queryFn: ({ signal }) =>
      api.get<Cart>("/cart", { signal }).then((r) => r.data),
  });

function useCartMutation<V, TError = unknown>(fn: (v: V) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation<unknown, TError, V>({
    mutationFn: fn,
    onSettled: () => qc.invalidateQueries({ queryKey: cartKey }),
  });
}

export const useAddToCart = () =>
  useCartMutation((v: { nftId: string; qty: number }) =>
    api.post("/cart/items", v),
  );

export const useSetQty = () =>
  useCartMutation((v: { nftId: string; qty: number }) =>
    api.put(`/cart/items/${v.nftId}`, { qty: v.qty }),
  );

export const useRemoveItem = () =>
  useCartMutation((nftId: string) => api.delete(`/cart/items/${nftId}`));

export const useApplyCoupon = () =>
  useCartMutation((code: string) => api.put("/cart/coupon", { code }));

export const useRemoveCoupon = () =>
  useCartMutation(() => api.delete("/cart/coupon"));

// wallets
export const useWallets = () =>
  useQuery<Wallet[], Error>({
    queryKey: walletsKey,
    queryFn: ({ signal }) =>
      api.get<Wallet[]>("/wallets", { signal }).then((r) => r.data),
  });

export function useSaveWallet() {
  const qc = useQueryClient();
  return useMutation<
    Wallet,
    Error,
    { role: Wallet["role"]; data: WalletInput }
  >({
    mutationFn: ({ role, data }) =>
      api.put<Wallet>(`/wallets/${role}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: walletsKey }),
  });
}

export const useCreateOrder = () =>
  useMutation<
    Order,
    Error,
    { key: string; walletId: string; provider: Provider }
  >({
    mutationFn: ({ key, ...body }) =>
      api
        .post<Order>("/orders", body, { headers: { "Idempotency-Key": key } })
        .then((r) => r.data),
  });

export const useOrder = (id: string) =>
  useQuery<Order, Error>({
    queryKey: ["order", id] as const,
    queryFn: ({ signal }) =>
      api.get<Order>(`/orders/${id}`, { signal }).then((r) => r.data),
    enabled: !!id,
    refetchInterval: (q) => (q.state.data?.status === "pending" ? 1000 : false),
  });

export const useNft = (id?: string) =>
  useQuery<NFT, Error>({
    queryKey: ["nft", id] as const,
    queryFn: ({ signal }) =>
      api.get<NFT>(`/nfts/${id}`, { signal }).then((r) => r.data),
    enabled: !!id,
    staleTime: 5 * 60_000,
  });

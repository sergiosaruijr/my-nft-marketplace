import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Cart, Order, Provider, Wallet, WalletInput } from "../../types";

export const cartKey = ["cart"] as const;
export const walletsKey = ["wallets"] as const;

export const useCart = () =>
  useQuery({
    queryKey: cartKey,
    queryFn: ({ signal }) =>
      api.get<Cart>("/cart", { signal }).then((r) => r.data),
  });

function useCartMutation<V>(fn: (v: V) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({
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

export const useWallets = () =>
  useQuery({
    queryKey: walletsKey,
    queryFn: ({ signal }) =>
      api.get<Wallet[]>("/wallets", { signal }).then((r) => r.data),
  });

export function useSaveWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ role, data }: { role: Wallet["role"]; data: WalletInput }) =>
      api.put<Wallet>(`/wallets/${role}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: walletsKey }),
  });
}

export const useCreateOrder = () =>
  useMutation({
    mutationFn: ({
      key,
      ...body
    }: {
      key: string;
      walletId: string;
      provider: Provider;
    }) =>
      api
        .post<Order>("/orders", body, { headers: { "Idempotency-Key": key } })
        .then((r) => r.data),
  });

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: ({ signal }) =>
      api.get<Order>(`/orders/${id}`, { signal }).then((r) => r.data),
    refetchInterval: (q) => (q.state.data?.status === "pending" ? 1000 : false), // até virar Socket.IO
  });

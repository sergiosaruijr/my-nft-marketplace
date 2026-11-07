import { NFTS } from "../data/nfts";
import type { DB } from "./db";

export function mergeGuestCart(
  db: DB,
  userId: string,
  guestId?: string | null,
) {
  if (!guestId) return;
  const gk = `guest:${guestId}`;
  const cart = (db.carts[userId] ??= []);
  for (const l of db.carts[gk] ?? []) {
    const nft = NFTS.find((x) => x.id === l.nftId);
    if (!nft) continue;
    const cur = cart.find((x) => x.nftId === l.nftId);
    const qty = Math.min((cur?.qty ?? 0) + l.qty, nft.available);
    if (cur) cur.qty = qty;
    else cart.push({ nftId: l.nftId, qty });
  }
  delete db.carts[gk];
  delete db.coupons[gk];
}

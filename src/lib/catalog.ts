import type { NFT } from "../types";

export type CatalogTab = "alta" | "novos";
export const PAGE_SIZE = 9;

const time = (n: NFT) => (n.createdAt ? Date.parse(n.createdAt) : 0);

export function sortNfts(nfts: readonly NFT[], tab?: CatalogTab): NFT[] {
  const list = [...nfts];
  if (tab === "alta")
    return list.sort(
      (a, b) =>
        (b.rating ?? 0) - (a.rating ?? 0) ||
        (b.reviews ?? 0) - (a.reviews ?? 0),
    );
  if (tab === "novos") return list.sort((a, b) => time(b) - time(a));
  return list;
}

export const pageCount = (total: number) =>
  Math.max(1, Math.ceil(total / PAGE_SIZE));

export const pageOf = (nfts: NFT[], page: number) =>
  nfts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

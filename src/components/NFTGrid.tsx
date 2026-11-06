import { useSearch } from "@tanstack/react-router";
import { NFTCard } from "./NFTCard";
import Pagination from "./Pagination";
import { pageCount, pageOf, sortNfts } from "../lib/catalog";
import { NFTS } from "../data/nfts";

function NFTGrid() {
  const { tab, page } = useSearch({ from: "/" });
  const sorted = sortNfts(NFTS, tab);
  const pages = pageCount(sorted.length);
  const current = Math.min(page ?? 1, pages);
  const items = pageOf(sorted, current);

  const left = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 === 1);

  return (
    <div className="pb-32">
      <div className="flex gap-4 mt-5">
        <div className="flex flex-col gap-5 flex-1">
          {left.map((nft) => (
            <NFTCard key={nft.id} nft={nft} rare={nft.rare} />
          ))}
        </div>
        <div className="flex flex-col gap-5 flex-1">
          {right.map((nft) => (
            <NFTCard key={nft.id} nft={nft} rare={nft.rare} />
          ))}
        </div>
      </div>
      <Pagination page={current} pages={pages} tab={tab} />
    </div>
  );
}

export default NFTGrid;

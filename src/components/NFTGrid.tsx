import { NFTCard } from "./NFTCard";
import { NFTS } from "../data/nfts";

function NFTGrid() {
  const left = [NFTS[0], NFTS[2]];
  const right = [NFTS[1], NFTS[3]];

  return (
    <div className="flex gap-4 mt-5 pb-32">
      {/* esquerda */}
      <div className="flex flex-col gap-5 flex-1">
        {left.map((nft, i) => (
          <NFTCard key={nft.id} nft={nft} rare={i === 1} />
        ))}
      </div>

      {/* direita */}
      <div className="flex flex-col gap-5 flex-1">
        {right.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
}

export default NFTGrid;

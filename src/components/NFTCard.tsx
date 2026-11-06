import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { NFT } from "../types";

export function NFTCard({ nft, rare }: { nft: NFT; rare?: boolean }) {
  const isRare = rare ?? nft.rare;

  return (
    <div className="flex flex-col">
      <Link
        to="/nft/$nftId"
        params={{ nftId: nft.id }}
        aria-label={`Abrir detalhe de ${nft.name}`}
        className="block"
      >
        <div className="relative rounded-[20px] bg-[#241612] pt-3 px-1 pb-1">
          {isRare && (
            <div className="absolute top-3 left-0 z-10 h-8 px-3 flex items-center bg-[#D28A4C] rounded-r-[4px]">
              <span className="text-[13px] font-bold text-[#140D0A]">RARO</span>
            </div>
          )}

          <div className="w-full aspect-square rounded-2xl bg-[#F0E6CC] overflow-hidden">
            {nft.image && (
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </Link>

      <div className="mt-2 pl-2">
        <p className="text-sm font-normal text-[#F5F1EB]">{nft.name}</p>
        <p className="text-sm font-bold text-[#D28A4C] mt-1">{nft.price} ETH</p>
      </div>

      <button
        aria-label={`Favoritar ${nft.name}`}
        className="mt-2 w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(20,13,10,0.7)]"
        onClick={(e) => {
          e.stopPropagation(); /* arrumar favoritos */
        }}
      >
        <Heart size={16} className="text-[#CFB28C]" />
      </button>
    </div>
  );
}

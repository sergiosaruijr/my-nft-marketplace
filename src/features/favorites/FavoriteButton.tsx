import type { ReactNode } from "react";
import { Heart } from "lucide-react";
import type { NFT } from "../../types";
import { useFavoriteToggle } from "./hooks";

export default function FavoriteButton({
  nft,
  className = "",
  size = 18,
  children,
}: {
  nft: NFT;
  className?: string;
  size?: number;
  children?: ReactNode;
}) {
  const { active, onClick } = useFavoriteToggle(nft);
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      aria-label={
        active ? `Remover ${nft.name} dos favoritos` : `Favoritar ${nft.name}`
      }
      className={`outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    >
      <Heart size={size} fill={active ? "currentColor" : "none"} />
      {children}
    </button>
  );
}

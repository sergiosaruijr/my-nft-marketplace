import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";

import { api } from "../lib/api";
import type { NFT } from "../types";
import { eth } from "../lib/format";
import { useAddToCart } from "../features/shop/hooks";
import { parseApiError } from "../lib/errors";

export default function NFTDetail() {
  const params = useParams({ strict: false }) as { nftId?: string };
  const nftId = params.nftId;
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);

  const add = useAddToCart(); // ✅

  const { data: nft, isLoading } = useQuery<NFT | null>({
    queryKey: ["nft", nftId],
    queryFn: async () => {
      if (!nftId) return null;
      const { data } = await api.get(`/nfts/${nftId}`);
      return data as NFT;
    },
    enabled: Boolean(nftId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-[#140D0A] text-[#F5F1EB] flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-dvh bg-[#140D0A] text-[#F5F1EB] flex items-center justify-center">
        NFT não encontrado
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#2B1912] via-[#1B100C] to-[#140D0A] text-[#F5F1EB] overflow-x-hidden">
      {/* ÁREA DA IMAGEM */}
      <div className="relative px-7 pt-[66px]">
        {/* Botão voltar */}
        <button
          aria-label="Voltar"
          onClick={() => navigate({ to: "/" })}
          className="absolute top-6 left-7 z-20 w-9 h-9 rounded-full border border-[#4A2B1C] bg-[#321D14] flex items-center justify-center"
        >
          <ChevronLeft size={21} className="text-[#CFB28C]" />
        </button>

        {/* Favorito */}
        <button
          aria-label="Favoritar"
          onClick={() => setFavorite(!favorite)}
          className="absolute top-6 right-7 z-20 w-9 h-9 rounded-full border border-[#4A2B1C] bg-[#321D14] flex items-center justify-center"
        >
          <Heart
            size={18}
            className="text-[#D28A4C]"
            fill={favorite ? "#D28A4C" : "none"}
          />
        </button>

        {/* Imagem do NFT */}
        <div className="w-full aspect-square rounded-[24px] overflow-hidden bg-[#F0E6CC]">
          {nft.image ? (
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
      </div>

      {/* PAINEL DE INFORMAÇÕES */}
      <div className="relative z-10 -mt-7 rounded-t-[28px] bg-[#241612] px-6 pt-8 pb-6">
        {/* Nome e avaliação */}
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-[#F5F1EB]">{nft.name}</h1>

          <div className="flex items-center gap-1 rounded-full border border-[#D28A4C] px-2 py-1 shrink-0">
            <Star size={13} fill="#D28A4C" className="text-[#D28A4C]" />
            <span className="text-xs text-[#F5F1EB]">{nft.rating}</span>
            <span className="text-xs text-[#CFB28C]">({nft.reviews})</span>
          </div>
        </div>

        {/* Descrição */}
        <p className="text-[14px] leading-[24px] text-[#CFB28C] mt-3">
          {nft.description ?? "Descrição indisponível."}
        </p>

        {/* Edição */}
        <div className="mt-3">
          <p className="text-sm font-bold text-[#F5F1EB]">Edição:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            <div className="rounded-full border border-[#D28A4C] text-[#D28A4C] px-2 py-1 text-xs">
              {nft.edition}
            </div>
          </div>
        </div>

        {/* ID */}
        <p className="mt-4 text-sm text-[#B99561]">
          ID do token: {nft.tokenId}
        </p>

        {/* Coleção */}
        <p className="mt-3 text-sm text-[#B99561]">Coleção: {nft.collection}</p>

        {/* Atributos */}
        <p className="mt-3 text-sm text-[#B99561]">
          Atributos: {(nft.attributes ?? []).join(", ")}
        </p>
      </div>

      {/* BARRA FIXA DE COMPRA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 rounded-t-[28px] bg-[#241612] px-6 pt-5 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.25)]">
        {/* Erro do add to cart */}
        {add.isError && (
          <p role="alert" className="mb-3 text-xs text-red-400 text-center">
            {parseApiError(add.error).message}
          </p>
        )}

        {/* Quantidade e preço */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#CFB28C]">Qtd.</span>

            <button
              aria-label="Diminuir quantidade"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-full bg-[#D28A4C] flex items-center justify-center"
            >
              <Minus size={15} className="text-[#140D0A]" />
            </button>

            <span className="text-base font-bold">{quantity}</span>

            <button
              aria-label="Aumentar quantidade"
              onClick={() => setQuantity(Math.min(nft.available, quantity + 1))}
              className="w-7 h-7 rounded-full bg-[#D28A4C] flex items-center justify-center"
            >
              <Plus size={15} className="text-[#140D0A]" />
            </button>
          </div>

          <span className="text-xl font-bold text-[#D28A4C]">
            {eth(nft.price)}
          </span>
        </div>

        {/* Botões */}
        <div className="flex items-center gap-3">
          {/* Comprar direto — vai pro pagamento */}
          <button
            type="button"
            disabled={add.isPending}
            onClick={async () => {
              try {
                await add.mutateAsync({ nftId: nft.id, qty: quantity });
                navigate({ to: "/payment" });
              } catch {
                /* erro exibido acima */
              }
            }}
            className="flex-1 h-[60px] rounded-full bg-gradient-to-r from-[#DD9A5F] to-[#C47B3E] text-[#140D0A] font-bold text-sm disabled:opacity-60"
          >
            {add.isPending ? "Adicionando…" : "Comprar NFT"}
          </button>

          {/* Adicionar ao carrinho */}
          <button
            aria-label="Adicionar ao carrinho"
            type="button"
            disabled={add.isPending}
            onClick={async () => {
              try {
                await add.mutateAsync({ nftId: nft.id, qty: quantity });
                navigate({ to: "/cart" });
              } catch {
                /* erro exibido acima */
              }
            }}
            className="w-[60px] h-[60px] rounded-full border border-[#4A2B1C] bg-[#321D14] flex items-center justify-center disabled:opacity-60"
          >
            <ShoppingCart size={21} className="text-[#D28A4C]" />
          </button>
        </div>
      </div>

      {/* Espaço para a barra fixa */}
      <div className="h-[175px]" />
    </div>
  );
}

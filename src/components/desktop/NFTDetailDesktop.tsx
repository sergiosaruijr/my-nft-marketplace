import { useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  Heart,
  Linkedin,
  Mail,
  Minus,
  Plus,
  Search,
  Star,
  Twitter,
} from "lucide-react";
import Breadcrumb from "../layout/Breadcrumb";
import NFTCarousel from "./NFTCarousel";
import ImageBox from "./ImageBox";
import { wrap } from "../layout/wrap";
import { useAddToCart, useNft } from "../../features/shop/hooks";
import { eth, tokenId } from "../../lib/format";
import { parseApiError } from "../../lib/errors";

const EDITIONS = ["1/1", "1/10", "1/50", "ABERTA"];
const roundBtn =
  "grid size-8 place-items-center rounded-full bg-primary text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary-light disabled:opacity-40";

export default function NFTDetailDesktop() {
  const { nftId } = useParams({ strict: false }) as { nftId?: string };
  const navigate = useNavigate();
  const { data: nft, isPending, isError } = useNft(nftId);
  const add = useAddToCart();
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const [tab, setTab] = useState<"details" | "reviews">("details");
  const [thumb, setThumb] = useState(0);

  if (isPending)
    return (
      <main className={wrap}>
        <div
          aria-hidden
          className="mt-16 h-[444px] w-full bg-surface-card motion-safe:animate-pulse"
        />
      </main>
    );
  if (isError || !nft)
    return (
      <main className={`${wrap} py-24 text-center`}>
        <p role="alert" className="text-[18px] text-foreground">
          NFT não encontrado.
        </p>
        <Link to="/" className="mt-4 inline-block text-primary underline">
          Voltar ao início
        </Link>
      </main>
    );

  const url = typeof window === "undefined" ? "" : window.location.href;
  const share = [
    [
      "LinkedIn",
      Linkedin,
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    ],
    [
      "E-mail",
      Mail,
      `mailto:?subject=${encodeURIComponent(nft.name)}&body=${encodeURIComponent(url)}`,
    ],
    [
      "Twitter",
      Twitter,
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(nft.name)}`,
    ],
  ] as const;

  const buy = async () => {
    try {
      await add.mutateAsync({ nftId: nft.id, qty });
      navigate({ to: "/cart" });
    } catch {
      /* erro */
    }
  };

  const tabCls = (on: boolean) =>
    `-mb-px border-b-2 px-1 pb-3 text-[18px] outline-none focus-visible:ring-2 focus-visible:ring-primary ${on ? "border-primary font-bold text-primary" : "border-transparent text-foreground"}`;

  return (
    <main className={`${wrap} pb-24`}>
      <Breadcrumb
        items={[{ label: "Início", to: "/" }, { label: "Mercado" }]}
      />

      <div className="mt-3 grid grid-cols-[100px_444px_minmax(0,1fr)] gap-x-7">
        <ul aria-label="Miniaturas" className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <li key={i}>
              <button
                type="button"
                aria-label={`Ver imagem ${i + 1}`}
                aria-current={thumb === i}
                onClick={() => setThumb(i)}
                className={`block size-[100px] overflow-hidden rounded-lg border-2 outline-none focus-visible:ring-2 focus-visible:ring-primary ${thumb === i ? "border-primary" : "border-transparent"}`}
              >
                <ImageBox src={nft.image} className="size-full" />
              </button>
            </li>
          ))}
        </ul>

        <div className="relative h-[444px] bg-surface-card p-5">
          <ImageBox
            src={nft.image}
            alt={`Arte do NFT ${nft.name}`}
            className="size-full rounded-[20px]"
          />
          <button
            type="button"
            disabled
            aria-label="Ampliar imagem (indisponível)"
            className="absolute right-6 top-6 grid size-7 place-items-center rounded-full bg-surface-card text-foreground disabled:opacity-100"
          >
            <Search size={16} />
          </button>
        </div>

        <section aria-labelledby="nft-h" className="pl-1">
          <h1
            id="nft-h"
            className="text-[28px] font-bold leading-9 text-foreground"
          >
            {nft.name}
          </h1>
          <div className="flex items-center justify-between border-b border-primary/30 pb-2">
            <p className="text-[24px] font-bold text-primary">
              {eth(nft.price)}
            </p>
            <p className="flex items-center gap-2 text-[14px] text-foreground">
              <span
                aria-label="Nota 5 de 5"
                className="flex gap-0.5 text-primary"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </span>
              19 avaliações de colecionadores
            </p>
          </div>

          <h2 className="mt-4 text-[14px] font-bold text-foreground">
            Sobre este NFT:
          </h2>
          <p className="mt-1 text-[14px] leading-6 text-text-secondary">
            {nft.description ?? "Descrição indisponível."} Um colecionável
            digital finalizado à mão da coleção Kurio Editions, verificado na
            Ethereum, com arte desbloqueável e acesso para colecionadores.
          </p>

          <h2 className="mt-3 text-[14px] font-bold text-foreground">
            Edição:
          </h2>
          <ul aria-label="Edições" className="mt-2 flex gap-2">
            {EDITIONS.map((e) => (
              <li
                key={e}
                aria-current={e === nft.edition}
                className={`rounded-full border px-2.5 py-0.5 text-[12px] ${e === nft.edition ? "border-primary text-primary" : "border-border-soft text-text-secondary"}`}
              >
                {e}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between">
            <div
              role="group"
              aria-label="Quantidade"
              className="flex items-center gap-3"
            >
              <button
                type="button"
                aria-label="Diminuir quantidade"
                disabled={qty <= 1}
                onClick={() => setQty((q) => q - 1)}
                className={roundBtn}
              >
                <Minus size={18} />
              </button>
              <span
                aria-live="polite"
                className="w-5 text-center text-[18px] text-foreground"
              >
                {qty}
              </span>
              <button
                type="button"
                aria-label="Aumentar quantidade"
                disabled={qty >= nft.available}
                onClick={() => setQty((q) => q + 1)}
                className={roundBtn}
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={buy}
                disabled={add.isPending}
                className="h-10 w-[130px] bg-primary text-[13px] font-bold uppercase text-ink outline-none hover:bg-primary-light focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-60"
              >
                {add.isPending ? "Adicionando…" : "Comprar"}
              </button>
              <button
                type="button"
                aria-pressed={fav}
                onClick={() => setFav((f) => !f)}
                className="flex h-10 items-center gap-2 border border-primary px-4 text-[14px] text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
              >
                <Heart size={18} fill={fav ? "currentColor" : "none"} />{" "}
                Favoritar
              </button>
            </div>
          </div>
          {add.isError && (
            <p
              role="alert"
              className="mt-2 text-right text-[13px] text-text-coral"
            >
              {parseApiError(add.error).message}
            </p>
          )}

          <ul className="mt-3 text-[14px] leading-8 text-text-secondary">
            <li>ID do token: {tokenId(nft.name)}</li>
            <li>Coleção: Kurio Apes</li>
            <li>Atributos: Óculos, Esmeralda, Raro</li>
          </ul>
          <div className="flex items-center gap-2 text-[14px] font-bold text-foreground">
            Compartilhar este NFT:
            {share.map(([name, Icon, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Compartilhar no ${name}`}
                className="rounded outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-[80px]">
        <div
          role="tablist"
          aria-label="Informações do NFT"
          className="flex gap-6 border-b border-primary/40"
        >
          <button
            role="tab"
            id="t-d"
            aria-selected={tab === "details"}
            aria-controls="p-d"
            onClick={() => setTab("details")}
            className={tabCls(tab === "details")}
          >
            Detalhes do NFT
          </button>
          <button
            role="tab"
            id="t-r"
            aria-selected={tab === "reviews"}
            aria-controls="p-r"
            onClick={() => setTab("reviews")}
            className={tabCls(tab === "reviews")}
          >
            Avaliações de colecionadores (19)
          </button>
        </div>
        {tab === "details" ? (
          <div
            role="tabpanel"
            id="p-d"
            aria-labelledby="t-d"
            className="mt-3 text-[14px] leading-6 text-text-secondary"
          >
            <p>
              {nft.name} é uma obra digital {nft.edition} finalizada à mão da
              coleção Kurio Editions. Cada atributo fica armazenado nos
              metadados do token e verificado na Ethereum. A obra explora
              identidade, movimento e luz em um mundo digital sem fronteiras.
            </p>
            <p className="mt-6">
              A propriedade inclui a arte em alta resolução, lançamentos
              exclusivos para colecionadores e um registro permanente de
              procedência registrada na rede. Nova Sato recebe 5% de direitos
              autorais nas vendas secundárias, apoiando novos trabalhos e
              lançamentos da comunidade.
            </p>
            {[
              [
                "Rede:",
                "Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.",
              ],
              [
                "Contrato:",
                "0x7A42...19E8 • Contrato inteligente ERC-721 verificado.",
              ],
              [
                "Direitos autorais:",
                "Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="mt-4">
                <h3 className="font-bold text-foreground">{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        ) : (
          <p
            role="tabpanel"
            id="p-r"
            aria-labelledby="t-r"
            className="mt-4 text-[14px] text-text-secondary"
          >
            As avaliações dos colecionadores aparecerão aqui.
          </p>
        )}
      </section>

      <NFTCarousel title="Mais desta coleção" exclude={nft.id} />
    </main>
  );
}

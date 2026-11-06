import { useMemo, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import Pagination from "../Pagination";
import { pageCount, pageOf, sortNfts } from "../../lib/catalog";
import Decimal from "decimal.js";
import { ChevronDown } from "lucide-react";
import ImageBox from "./ImageBox";
import Tabs from "../Tabs";
import { wrap } from "../layout/wrap";
import { NFTS } from "../../data/nfts";
import { eth } from "../../lib/format";

const COLLECTIONS = [
  ["Arte digital", 33],
  ["Fotografia", 12],
  ["Música", 65],
  ["Arte 3D", 39],
  ["Colecionáveis", 23],
  ["Generativa", 17],
  ["Jogos", 19],
  ["Assinaturas", 13],
  ["Utilidade", 18],
] as const;
const NETWORKS = [
  ["Ethereum", 119],
  ["Polygon", 78],
  ["Solana", 86],
] as const;
const PROMOS = [
  {
    title: "Lançamentos gênesis de edição limitada",
    text: "Colecione edições escassas diretamente dos criadores antes da revelação pública.",
  },
  {
    title: "Arte digital selecionada e muito mais",
    text: "Explore novos artistas, coleções verificadas e obras digitais que definem a",
  },
] as const;
const ARTICLES = [
  {
    date: "12 de setembro",
    min: 6,
    title: "Como funciona a propriedade de NFTs",
    text: "Aprenda a colecionar, negociar e verificar ativos digitais.",
  },
  {
    date: "13 de setembro",
    min: 2,
    title: "10 artistas digitais para acompanhar",
    text: "Conheça criadores que moldam a cultura digital.",
  },
  {
    date: "15 de setembro",
    min: 3,
    title: "Raridade, atributos e procedência",
    text: "Entenda raridade, procedência, direitos autorais e utilidade.",
  },
  {
    date: "15 de setembro",
    min: 2,
    title: "Como proteger sua carteira",
    text: "Proteja sua carteira, seus ativos e sua identidade.",
  },
] as const;

type Sort = "recent" | "asc" | "desc";
const heading = "text-[18px] font-bold text-foreground";

export default function HomeDesktop() {
  const { tab, page } = useSearch({ from: "/" });
  const navigate = useNavigate();
  const [sort, setSort] = useState<Sort>("recent");
  const sorted = useMemo(() => {
    const base = sortNfts(NFTS, tab);
    return sort === "recent"
      ? base
      : [...base].sort(
          (a, b) =>
            new Decimal(a.price).cmp(b.price) * (sort === "asc" ? 1 : -1),
        );
  }, [tab, sort]);
  const pages = pageCount(sorted.length);
  const current = Math.min(page ?? 1, pages);
  const list = pageOf(sorted, current);
  const featured = NFTS[1];

  return (
    <main className={`${wrap} pb-24`}>
      <section
        aria-labelledby="hero-h"
        className="mt-8 grid grid-cols-[minmax(0,1fr)_449px] gap-6"
      >
        <div className="relative pl-10 pt-[42px]">
          <p className="text-[12px] tracking-wide text-foreground">
            Bem-vindo à Kurio
          </p>
          <h1
            id="hero-h"
            className="mt-3 max-w-[520px] text-[44px] font-bold uppercase leading-[70px] text-foreground"
          >
            Seja dono do futuro da arte digital
          </h1>
          <p className="mt-2 max-w-[560px] text-[14px] leading-6 text-text-secondary">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            Colecione arte digital rara, apoie artistas e tenha uma parte da
            cultura da internet.
          </p>
          <Link
            to="/"
            hash="catalogo"
            className="mt-8 flex h-10 w-[140px] items-center justify-center bg-primary text-[14px] font-bold uppercase text-ink outline-none hover:bg-primary-light focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Explorar
          </Link>
          <div
            aria-hidden
            className="absolute bottom-[47px] left-[82%] flex -translate-x-1/2 gap-2"
          >
            {[1, 0.35, 0.35].map((o, i) => (
              <span
                key={i}
                style={{ opacity: o }}
                className="size-2 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
        <ImageBox
          src={NFTS[0].image}
          alt={`Arte do NFT ${NFTS[0].name}`}
          className="aspect-square w-full rounded-[20px]"
        />
      </section>

      <div
        id="catalogo"
        className="mt-[97px] grid scroll-mt-4 grid-cols-[310px_minmax(0,1fr)] gap-[47px]"
      >
        <aside aria-label="Filtros e destaque" className="space-y-4">
          <div className="bg-surface-card p-5">
            <h2 className={heading}>Coleções</h2>
            <ul className="mt-3">
              {COLLECTIONS.map(([n, c]) => (
                <li
                  key={n}
                  className="flex justify-between pl-3 text-[14px] leading-10 text-text-accent"
                >
                  {n}
                  <span className="font-bold text-text-secondary">({c})</span>
                </li>
              ))}
            </ul>

            <h2 className={`${heading} mt-6`}>Faixa de preço</h2>
            <div
              aria-hidden
              className="relative mx-3 mt-5 h-1 rounded bg-primary"
            >
              <span className="absolute -top-2 left-[3%] size-5 rounded-full border-[5px] border-primary bg-ink" />
              <span className="absolute -top-2 left-[74%] size-5 rounded-full border-[5px] border-primary bg-ink" />
            </div>
            <p className="mt-4 pl-3 text-[13px] text-foreground">
              Preço: 0,02 - 12,30 ETH
            </p>
            <button
              type="button"
              disabled
              className="ml-3 mt-3 h-8 bg-primary px-3 text-[14px] font-bold text-ink disabled:opacity-100"
            >
              Aplicar
            </button>

            <h2 className={`${heading} mt-6`}>Rede</h2>
            <ul className="mt-2">
              {NETWORKS.map(([n, c]) => (
                <li
                  key={n}
                  className="flex justify-between pl-3 text-[14px] leading-10 text-text-secondary"
                >
                  {n}
                  <span>({c})</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-card pt-5">
            <h2 className="px-5 text-[22px] font-bold uppercase text-text-accent">
              NFT em destaque
            </h2>
            <p className="mt-2 px-5 text-center text-[18px] font-bold uppercase text-foreground">
              Oferta limitada
            </p>
            <Link
              to="/nft/$nftId"
              params={{ nftId: featured.id }}
              aria-label={`Abrir ${featured.name}`}
              className="mt-3 block outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ImageBox
                src={featured.image}
                alt={`Arte do NFT ${featured.name}`}
                className="aspect-[310/365] w-full rounded-[20px]"
              />
            </Link>
          </div>
        </aside>

        <section aria-label="Catálogo de NFTs">
          <div className="flex items-center justify-between">
            <div className="[&>div]:mt-0">
              <Tabs />
            </div>
            <label className="relative flex items-center gap-2 text-[14px] text-foreground">
              Ordenar por:
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as Sort);
                  if (page)
                    navigate({
                      to: "/",
                      search: { tab },
                      replace: true,
                      resetScroll: false,
                    });
                }}
                className="cursor-pointer appearance-none bg-transparent pr-6 outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="recent" className="bg-ink">
                  Listados recentemente
                </option>
                <option value="asc" className="bg-ink">
                  Menor preço
                </option>
                <option value="desc" className="bg-ink">
                  Maior preço
                </option>
              </select>
              <ChevronDown
                aria-hidden
                size={16}
                className="pointer-events-none absolute right-0"
              />
            </label>
          </div>

          <ul className="mt-6 grid grid-cols-3 gap-x-[33px] gap-y-[60px]">
            {list.map((n) => (
              <li key={n.id}>
                <Link
                  to="/nft/$nftId"
                  params={{ nftId: n.id }}
                  className="block rounded outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="aspect-[259/299] bg-surface-card p-[7px] pt-[15px]">
                    <ImageBox
                      src={n.image}
                      alt={`Arte do NFT ${n.name}`}
                      className="aspect-square w-full rounded-2xl"
                    />
                  </div>
                  <p className="mt-3 text-[14px] text-foreground">{n.name}</p>
                  <p className="mt-1 text-[16px] font-bold text-primary">
                    {eth(n.price)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <Pagination page={current} pages={pages} tab={tab} anchor />
        </section>
      </div>

      <section
        aria-label="Destaques"
        className="mt-[100px] grid grid-cols-2 gap-[30px]"
      >
        {PROMOS.map((p) => (
          <article
            key={p.title}
            className="flex h-[250px] overflow-hidden bg-surface-card"
          >
            <ImageBox
              src={NFTS[0].image}
              className="h-full w-[286px] shrink-0"
            />
            <div className="flex flex-1 flex-col items-end justify-center gap-3 p-4 text-right">
              <h2 className="text-[18px] font-bold leading-6 text-foreground">
                {p.title}
              </h2>
              <p className="text-[13px] leading-6 text-text-secondary">
                {p.text}
              </p>
              <Link
                to="/"
                hash="catalogo"
                className="flex h-10 w-[140px] items-center justify-center bg-primary text-[14px] font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
              >
                Explorar →
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="journal-h" className="mt-[110px]">
        <h2
          id="journal-h"
          className="text-center text-[28px] font-bold text-foreground"
        >
          Diário da Cunhagem
        </h2>
        <p className="mt-2 text-center text-[14px] text-text-secondary">
          Histórias, guias e insights para colecionadores sobre o universo da
          propriedade digital.
        </p>
        <ul className="mt-12 grid grid-cols-4 gap-6">
          {ARTICLES.map((a, i) => (
            <li key={a.title}>
              <article className="h-full bg-surface-card">
                <ImageBox src={NFTS[i]?.image} className="h-[195px] w-full" />
                <div className="p-4">
                  <p className="text-[11px] text-text-muted">
                    {a.date} &nbsp;|&nbsp; Leitura de {a.min} min
                  </p>
                  <h3 className="mt-3 text-[16px] font-bold leading-5 text-foreground">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-5 text-text-secondary">
                    {a.text}
                  </p>
                  <p className="mt-3 text-[12px] font-bold text-primary">
                    Ler mais →
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

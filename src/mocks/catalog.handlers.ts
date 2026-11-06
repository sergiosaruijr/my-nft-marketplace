import { http, HttpResponse } from "msw";
import Decimal from "decimal.js";
import { NFTS } from "../data/nfts";
import { err, open } from "./route";
import { getScenario } from "./scenarios";

const dec = (v: string | null) => (v && /^\d+(\.\d+)?$/.test(v) ? v : null);

export const catalogHandlers = [
  http.get(
    "*/api/nfts",
    open(({ request }) => {
      const u = new URL(request.url).searchParams;
      const q = (u.get("q") ?? "").trim().toLowerCase();
      const category = u.get("category"),
        network = u.get("network");
      const min = dec(u.get("min")),
        max = dec(u.get("max"));
      const sort = u.get("sort") ?? "recent",
        tab = u.get("tab") ?? "all";
      const page = Math.max(1, Number(u.get("page")) || 1);
      const pageSize = Math.min(24, Number(u.get("pageSize")) || 9);

      let list = getScenario().empty
        ? []
        : NFTS.filter(
            (n) =>
              (!q ||
                n.name.toLowerCase().includes(q) ||
                n.category.toLowerCase().includes(q)) &&
              (!category || n.category === category) &&
              (!network || n.network === network) &&
              (!min || new Decimal(n.price).gte(min)) &&
              (!max || new Decimal(n.price).lte(max)) &&
              (tab === "all" ||
                (tab === "new"
                  ? Number(n.id) > NFTS.length - 12
                  : Number(n.id) % 3 === 0)),
          );

      list = [...list].sort(
        sort === "price_asc"
          ? (a, b) => new Decimal(a.price).cmp(b.price)
          : sort === "price_desc"
            ? (a, b) => new Decimal(b.price).cmp(a.price)
            : (a, b) => Number(b.id) - Number(a.id),
      );

      const count = (key: "category" | "network") =>
        NFTS.reduce<Record<string, number>>(
          (acc, n) => ({ ...acc, [n[key]]: (acc[n[key]] ?? 0) + 1 }),
          {},
        );
      const total = list.length;
      return HttpResponse.json({
        items: list.slice((page - 1) * pageSize, page * pageSize),
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        facets: { categories: count("category"), networks: count("network") },
      });
    }),
  ),

  http.get(
    "*/api/nfts/:id",
    open(({ params }) => {
      const nft = NFTS.find((n) => n.id === params.id);
      return nft
        ? HttpResponse.json(nft)
        : err(404, "not_found", "NFT não encontrado.");
    }),
  ),
];

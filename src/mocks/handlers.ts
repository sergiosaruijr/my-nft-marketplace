import { http, HttpResponse } from "msw";
import { NFTS } from "../data/nfts";
import { authHandlers } from "./auth.handlers";
import { shopHandlers } from "./shop.handlers";

export const handlers = [
  ...authHandlers,
  ...shopHandlers,

  // http.get(
  //   "[...authHandlers, ...shopHandlers, ...catalogHandlers]:",
  //   ({ params }) => {
  //     const id = (params as { id: string }).id;
  //     const nft = NFTS.find((n) => n.id === id);
  //     if (!nft) {
  //       return HttpResponse.json({ error: "Not found" }, { status: 404 });
  //     }
  //     return HttpResponse.json(nft, { status: 200 });
  //   },
  // ),
  http.get("/api/nfts/:id", ({ params }) => {
    const id = (params as { id: string }).id;
    const nft = NFTS.find((n) => n.id === id);
    if (!nft) {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(nft, { status: 200 });
  }),
];

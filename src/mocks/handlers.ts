// src/mocks/handlers.ts
// import { http, HttpResponse } from "msw";
// import { NFTS } from "../data/nfts";

// export const handlers = [
//   http.get("*/api/nfts/:id", ({ params }) => {
//     const id = (params as { id: string }).id;
//     const nft = NFTS.find((n) => n.id === id);
//     if (!nft) {
//       return HttpResponse.json({ error: "Not found" }, { status: 404 });
//     }
//     return HttpResponse.json(nft, { status: 200 });
//   }),
// ];

import { http, HttpResponse } from "msw";
import { NFTS } from "../data/nfts";
import { authHandlers } from "./auth.handlers"; // ← adicionar esse import
import { shopHandlers } from "./shop.handlers";

export const handlers = [
  ...authHandlers, // ← espalhar os handlers de auth aqui
  ...shopHandlers,
  // handler de NFT que já existia
  http.get("*/api/nfts/:id", ({ params }) => {
    const id = (params as { id: string }).id;
    const nft = NFTS.find((n) => n.id === id);
    if (!nft) {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(nft, { status: 200 });
  }),
];

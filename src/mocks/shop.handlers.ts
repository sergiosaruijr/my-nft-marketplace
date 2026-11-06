import { http, HttpResponse, delay } from "msw";
import Decimal from "decimal.js";
import { NFTS } from "../data/nfts";
import { getDb, saveDb, type DB, type StoredOrder } from "./db";
import type { Cart, Order, Provider, Wallet } from "../types";

type Ctx = {
  uid: string;
  db: DB;
  request: Request;
  params: Record<string, string>;
};

const authed =
  (fn: (c: Ctx) => Response | Promise<Response>) =>
  async ({
    request,
    params,
  }: {
    request: Request;
    params: Record<string, unknown>;
  }) => {
    await delay(250);
    const db = await getDb();
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const uid = token ? db.sessions[token] : undefined;
    if (!uid)
      return HttpResponse.json({ error: "session_invalid" }, { status: 401 });
    return fn({ uid, db, request, params: params as Record<string, string> });
  };

const err = (
  status: number,
  error: string,
  message: string,
  extra: object = {},
) => HttpResponse.json({ error, message, ...extra }, { status });

const COUPONS: Record<string, string> = { KURIO5: "0.50" }; // desconto fixo em ETH
const EXPIRED = ["LANCAMENTO"];

function buildCart(db: DB, uid: string): Cart {
  const items = (db.carts[uid] ?? []).flatMap((l) => {
    const nft = NFTS.find((n) => n.id === l.nftId);
    return nft
      ? [
          {
            nft,
            qty: l.qty,
            lineTotal: new Decimal(nft.price).mul(l.qty).toFixed(2),
          },
        ]
      : [];
  });
  const subtotal = items.reduce((s, l) => s.plus(l.lineTotal), new Decimal(0));
  const code = db.coupons[uid] ?? null;
  const discount =
    code && subtotal.gt(0)
      ? Decimal.min(COUPONS[code], subtotal)
      : new Decimal(0);
  const fee = items.length ? new Decimal("0.016") : new Decimal(0);
  return {
    items,
    coupon: code ? { code } : null,
    subtotal: subtotal.toFixed(2),
    discount: discount.toFixed(2),
    networkFee: fee.toFixed(3),
    total: subtotal.minus(discount).plus(fee).toFixed(3),
  };
}
const publicOrder = ({ userId: _, ...o }: StoredOrder): Order => o;

export const shopHandlers = [
  // ---------- carrinho ----------
  http.get(
    "*/api/cart",
    authed(({ uid, db }) => HttpResponse.json(buildCart(db, uid))),
  ),

  http.post(
    "*/api/cart/items",
    authed(async ({ uid, db, request }) => {
      const { nftId, qty = 1 } = (await request.json()) as {
        nftId: string;
        qty?: number;
      };
      const nft = NFTS.find((n) => n.id === nftId);
      if (!nft) return err(404, "not_found", "NFT não encontrado.");
      const cart = (db.carts[uid] ??= []);
      const line = cart.find((l) => l.nftId === nftId);
      const next = (line?.qty ?? 0) + qty;
      if (next > nft.available)
        return err(
          409,
          "stock_conflict",
          `Disponível apenas ${nft.available} unidade(s).`,
        );
      if (line) line.qty = next;
      else cart.push({ nftId, qty: next });
      saveDb();
      return HttpResponse.json(buildCart(db, uid), { status: 201 });
    }),
  ),

  http.put(
    "*/api/cart/items/:nftId",
    authed(async ({ uid, db, request, params }) => {
      const { qty } = (await request.json()) as { qty: number };
      const nft = NFTS.find((n) => n.id === params.nftId);
      const line = db.carts[uid]?.find((l) => l.nftId === params.nftId);
      if (!nft || !line)
        return err(404, "not_found", "Item não encontrado no carrinho.");
      if (!Number.isInteger(qty) || qty < 1)
        return err(422, "validation", "Quantidade inválida.");
      if (qty > nft.available)
        return err(
          409,
          "stock_conflict",
          `Disponível apenas ${nft.available} unidade(s).`,
        );
      line.qty = qty;
      saveDb();
      return HttpResponse.json(buildCart(db, uid));
    }),
  ),

  http.delete(
    "*/api/cart/items/:nftId",
    authed(({ uid, db, params }) => {
      db.carts[uid] = (db.carts[uid] ?? []).filter(
        (l) => l.nftId !== params.nftId,
      );
      saveDb();
      return HttpResponse.json(buildCart(db, uid));
    }),
  ),

  http.put(
    "*/api/cart/coupon",
    authed(async ({ uid, db, request }) => {
      const code = String(
        ((await request.json()) as { code?: string }).code ?? "",
      )
        .trim()
        .toUpperCase();
      if (EXPIRED.includes(code))
        return err(422, "coupon_expired", "Cupom expirado.");
      if (!COUPONS[code]) return err(422, "coupon_invalid", "Cupom inválido.");
      db.coupons[uid] = code;
      saveDb();
      return HttpResponse.json(buildCart(db, uid));
    }),
  ),

  http.delete(
    "*/api/cart/coupon",
    authed(({ uid, db }) => {
      db.coupons[uid] = null;
      saveDb();
      return HttpResponse.json(buildCart(db, uid));
    }),
  ),

  // ---------- carteiras ----------
  http.get(
    "*/api/wallets",
    authed(({ uid, db }) => HttpResponse.json(db.wallets[uid] ?? [])),
  ),

  http.put(
    "*/api/wallets/:role",
    authed(async ({ uid, db, request, params }) => {
      const role = params.role;
      if (role !== "principal" && role !== "secondary")
        return err(404, "not_found", "Tipo de carteira inválido.");
      const b = (await request.json()) as Partial<Wallet>;
      const fields: Record<string, string> = {};
      for (const k of [
        "displayName",
        "nickname",
        "profileName",
        "referralCode",
        "email",
        "ensName",
      ] as const)
        if (!b[k]?.trim()) fields[k] = "Campo obrigatório";
      if (!/^0x[a-fA-F0-9]{40}$/.test(b.address ?? ""))
        fields.address = "Endereço 0x inválido";
      if (!b.network) fields.network = "Selecione uma rede";
      if (!b.walletType) fields.walletType = "Selecione uma carteira";
      if (Object.keys(fields).length)
        return err(422, "validation", "Verifique os campos.", { fields });

      const list = (db.wallets[uid] ??= []);
      const i = list.findIndex((w) => w.role === role);
      const wallet = {
        ...list[i],
        ...b,
        id: list[i]?.id ?? crypto.randomUUID(),
        role,
      } as Wallet;
      if (i >= 0) list[i] = wallet;
      else list.push(wallet);
      saveDb();
      return HttpResponse.json(wallet);
    }),
  ),

  // ---------- pedidos ----------
  http.post(
    "*/api/orders",
    authed(async ({ uid, db, request }) => {
      const key = request.headers.get("Idempotency-Key");
      if (!key)
        return err(400, "missing_key", "Chave de idempotência ausente.");
      const body = (await request.json()) as {
        walletId: string;
        provider: Provider;
      };
      const hash = JSON.stringify([uid, body]);
      const prev = db.idem[key];
      if (prev) {
        if (prev.hash !== hash)
          return err(
            409,
            "idempotency_conflict",
            "Chave já usada com outro conteúdo.",
          );
        return HttpResponse.json(publicOrder(db.orders[prev.orderId])); // mesma tentativa → mesmo pedido
      }
      const wallet = db.wallets[uid]?.find((w) => w.id === body.walletId);
      if (!wallet)
        return err(422, "validation", "Selecione uma carteira válida.");
      const cart = buildCart(db, uid);
      if (!cart.items.length)
        return err(409, "empty_cart", "Seu carrinho está vazio.");

      const order: StoredOrder = {
        id: `ord_${crypto.randomUUID().slice(0, 8)}`,
        userId: uid,
        status: "pending",
        txHash:
          "0x" +
          [...crypto.getRandomValues(new Uint8Array(32))]
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""),
        createdAt: new Date().toISOString(),
        provider: body.provider,
        walletNickname: wallet.nickname,
        items: cart.items.map((l) => ({
          nftId: l.nft.id,
          name: l.nft.name,
          image: l.nft.image,
          qty: l.qty,
          lineTotal: l.lineTotal,
        })),
        subtotal: cart.subtotal,
        discount: cart.discount,
        networkFee: cart.networkFee,
        total: cart.total,
        version: 1,
      };
      db.orders[order.id] = order;
      db.idem[key] = { hash, orderId: order.id };
      saveDb();
      return HttpResponse.json(publicOrder(order), { status: 201 });
    }),
  ),

  http.get(
    "*/api/orders/:id",
    authed(({ uid, db, params }) => {
      const o = db.orders[params.id];
      if (!o || o.userId !== uid)
        return err(404, "not_found", "Pedido não encontrado.");
      if (
        o.status === "pending" &&
        Date.now() - Date.parse(o.createdAt) > 2500
      ) {
        o.status = "confirmed";
        o.version++;
        // remove do carrinho só o que foi comprado
        db.carts[uid] = (db.carts[uid] ?? [])
          .map((l) => {
            const b = o.items.find((i) => i.nftId === l.nftId);
            return b ? { ...l, qty: l.qty - b.qty } : l;
          })
          .filter((l) => l.qty > 0);
        db.coupons[uid] = null;
        saveDb();
      }
      return HttpResponse.json(publicOrder(o));
    }),
  ),
];

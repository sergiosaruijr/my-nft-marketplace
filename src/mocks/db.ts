import type { Order, User, Wallet } from "../types";

export type StoredUser = User & { passwordHash: string };
export type StoredOrder = Order & { userId: string };
export type DB = {
  users: StoredUser[];
  sessions: Record<string, string>;
  carts: Record<string, { nftId: string; qty: number }[]>;
  coupons: Record<string, string | null>;
  wallets: Record<string, Wallet[]>;
  orders: Record<string, StoredOrder>;
  idem: Record<string, { hash: string; orderId: string }>;
  favorites: Record<string, string[]>;
};
const KEY = "kurio.mock.db";
let cache: DB | null = null;

export async function sha256(s: string) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(s),
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function seed(): Promise<DB> {
  const passwordHash = await sha256("kurio1234");
  const base = {
    email: "ana@kurio.com",
    referralCode: "KURIO2026",
    profileName: "ana",
  };
  return {
    users: [
      { id: "u1", username: "ana", email: "ana@kurio.com", passwordHash },
      { id: "u2", username: "bruno", email: "bruno@kurio.com", passwordHash },
    ],
    sessions: {},

    carts: {
      u1: [
        { nftId: "1", qty: 1 },
        { nftId: "5", qty: 1 },
        { nftId: "6", qty: 2 },
        { nftId: "7", qty: 2 },
      ],
    },
    coupons: {},
    wallets: {
      u1: [
        {
          ...base,
          id: "w1",
          role: "principal",
          displayName: "Ana Colecionadora",
          nickname: "Principal",
          network: "ethereum",
          address: "0xA91F3c5d9B7e2A4f6C8d0E1b3A5c7E9f1b2dE82C",
          walletType: "metamask",
          ensName: "ana",
          ensSuffix: ".eth",
        },
        {
          ...base,
          id: "w2",
          role: "secondary",
          displayName: "Ana Reserva",
          nickname: "Reserva",
          network: "polygon",
          address: "0x7be4C1a9D3f5E7b9A1c3D5f7B9e1A3c5D7f9B1e3",
          altAddress: "nova.kurio.eth",
          walletType: "coinbase",
          ensName: "nova",
          ensSuffix: ".kurio.eth",
        },
      ],
    },
    orders: {},
    idem: {},
    favorites: { u1: ["2"] },
  };
}

export async function getDb() {
  if (cache) return cache;
  const raw = localStorage.getItem(KEY);
  const base = await seed();
  cache = raw ? ({ ...base, ...JSON.parse(raw) } as DB) : base; // bancos antigos ganham os campos novos
  return cache;
}
export const saveDb = () =>
  cache && localStorage.setItem(KEY, JSON.stringify(cache));
export async function resetDb() {
  cache = await seed();
  saveDb();
}

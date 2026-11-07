import type { Order, User, Wallet } from "../types";

export type StoredUser = User & { passwordHash: string };
export type StoredOrder = Order & { userId: string };
export type DB = {
  users: StoredUser[];
  carts: Record<string, { nftId: string; qty: number }[]>;
  coupons: Record<string, string | null>;
  wallets: Record<string, Wallet[]>;
  favorites: Record<string, string[]>;
  orders: Record<string, StoredOrder>;
  idem: Record<string, { hash: string; orderId: string }>;
};

const KEY = "kurio.mock.db";
const SESSIONS = "kurio.mock.sessions";
let cache: DB | null = null;
let loading: Promise<DB> | null = null;

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
    carts: {
      u1: [
        { nftId: "1", qty: 1 },
        { nftId: "5", qty: 1 },
        { nftId: "6", qty: 2 },
        { nftId: "7", qty: 2 },
      ],
    },
    coupons: {},
    favorites: { u1: ["2"] },
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
  };
}

async function load(): Promise<DB> {
  const raw = localStorage.getItem(KEY);
  const base = await seed();
  cache = raw ? ({ ...base, ...JSON.parse(raw) } as DB) : base;
  return cache;
}

export const getDb = () => (loading ??= load());
export const saveDb = () =>
  cache && localStorage.setItem(KEY, JSON.stringify(cache));

export async function resetDb() {
  cache = await seed();
  loading = Promise.resolve(cache);
  localStorage.removeItem(SESSIONS);
  saveDb();
}

const readSessions = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS) ?? "{}");
  } catch {
    return {};
  }
};
export function createSession(userId: string) {
  const token = crypto.randomUUID();
  localStorage.setItem(
    SESSIONS,
    JSON.stringify({ ...readSessions(), [token]: userId }),
  );
  return token;
}
export const userIdFromToken = (token?: string | null) =>
  token ? readSessions()[token] : undefined;
export function destroySession(token?: string | null) {
  if (!token) return;
  const s = readSessions();
  delete s[token];
  localStorage.setItem(SESSIONS, JSON.stringify(s));
}

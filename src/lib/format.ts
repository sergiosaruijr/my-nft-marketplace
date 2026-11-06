import Decimal from "decimal.js";
import type { Network, Provider } from "../types";

export const ethNum = (v: string, digits = 2) => new Decimal(v).toFixed(digits);
export const eth = (v: string, digits = 2) => `${ethNum(v, digits)} ETH`;
export const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
export const tokenId = (name: string) =>
  `#${(name.match(/#(\d+)/)?.[1] ?? "0").padStart(4, "0")}`;
const M = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
export const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} ${M[d.getMonth()]}, ${d.getFullYear()}`;
};
export const providerLabel: Record<Provider, string> = {
  walletconnect: "WalletConnect",
  metamask: "MetaMask",
  coinbase: "Coinbase Wallet",
};
export const networkLabel: Record<Network, string> = {
  ethereum: "Ethereum",
  polygon: "Polygon",
};

export type NFT = {
  id: string;
  name: string;
  price: string;
  available: number;
  image?: string | null;
  rare?: boolean;
  description?: string;
  edition?: string;
  tokenId?: string;
  collection?: string;
  attributes?: string[];
  rating?: number;
  reviews?: number;
  createdAt?: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
};
export type AuthResponse = { token: string; user: User };
export type ApiError = {
  error: string;
  message?: string;
  fields?: Record<string, string>;
};

export type CartLine = { nft: NFT; qty: number; lineTotal: string };
export type Cart = {
  items: CartLine[];
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
  coupon: { code: string } | null;
};
export type Network = "ethereum" | "polygon";
export type Provider = "walletconnect" | "metamask" | "coinbase";
export type Wallet = {
  id: string;
  role: "principal" | "secondary";
  displayName: string;
  nickname: string;
  network: Network;
  profileName: string;
  address: string;
  altAddress?: string;
  walletType: Provider;
  referralCode: string;
  email: string;
  ensName: string;
  ensSuffix: ".eth" | ".kurio.eth";
};
export type WalletInput = Omit<Wallet, "id" | "role">;
export type OrderItem = {
  nftId: string;
  name: string;
  image?: string | null;
  qty: number;
  lineTotal: string;
};
export type Order = {
  id: string;
  status: "pending" | "confirmed" | "rejected";
  txHash: string;
  createdAt: string;
  provider: Provider;
  walletNickname: string;
  items: OrderItem[];
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
  version: number;
};

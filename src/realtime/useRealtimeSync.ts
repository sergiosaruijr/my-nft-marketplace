// src/realtime/useRealtimeSync.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cartKey } from "../features/shop/hooks";
import { useSession } from "../features/auth/useAuth";
import { connectSocket, disconnectSocket } from "./socket";

type Evt = {
  eventId: string;
  version: number;
  nftId?: string;
  orderId?: string;
};

export function useRealtimeSync() {
  const qc = useQueryClient();
  const { data: user } = useSession();

  useEffect(() => {
    const socket = connectSocket();
    const seen = new Set<string>(); // descarta duplicatas
    const latest = new Map<string, number>(); // descarta eventos antigos (versão menor)
    const accept = (key: string, e: Evt) => {
      if (seen.has(e.eventId) || e.version <= (latest.get(key) ?? 0))
        return false;
      seen.add(e.eventId);
      latest.set(key, e.version);
      return true;
    };

    socket.on("nft.updated", (e: Evt) => {
      if (!accept(`nft:${e.nftId}`, e)) return;
      qc.invalidateQueries({ queryKey: ["nft", e.nftId] });
      qc.invalidateQueries({ queryKey: ["nfts"] });
      qc.invalidateQueries({ queryKey: cartKey }); // o carrinho refaz o resumo
    });
    socket.on("order.updated", (e: Evt) => {
      if (accept(`order:${e.orderId}`, e))
        qc.invalidateQueries({ queryKey: ["order", e.orderId] });
    });
    socket.io.on("reconnect", () => qc.invalidateQueries()); // reconcilia tudo com o REST

    return disconnectSocket; // libera os listeners
  }, [qc, user?.id]); // trocou de usuário → nova conexão
}

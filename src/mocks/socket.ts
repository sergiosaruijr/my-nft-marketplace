import { ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";

const link = ws.link("wss://realtime.kurio.test/socket.io/");
const clients = new Set<ReturnType<typeof toSocketIo>>();

export function emit(event: string, payload: object) {
  clients.forEach((io) => io.client.emit(event, payload));
}

export const socketHandlers = [
  link.addEventListener("connection", (connection) => {
    const io = toSocketIo(connection);
    clients.add(io);
    connection.client.addEventListener("close", () => clients.delete(io));
  }),
];

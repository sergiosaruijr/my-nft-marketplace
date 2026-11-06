import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(): Socket {
  disconnectSocket();
  socket = io("wss://realtime.kurio.test", {
    path: "/socket.io/",
    transports: ["websocket"],
  });
  return socket;
}

export function disconnectSocket() {
  socket?.removeAllListeners();
  socket?.disconnect();
  socket = null;
}

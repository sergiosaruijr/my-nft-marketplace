import axios from "axios";
import { getGuestId, getToken, SESSION_EXPIRED } from "./session";

export const api = axios.create({ baseURL: "/api", timeout: 10_000 });

api.interceptors.request.use((cfg) => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  else cfg.headers["X-Guest-Id"] = getGuestId(); // visitante (inclusive no login, para mesclar o carrinho)
  return cfg;
});

api.interceptors.response.use(undefined, (err) => {
  const url: string = err.config?.url ?? "";
  if (err.response?.status === 401 && getToken() && !url.startsWith("/auth/"))
    window.dispatchEvent(new Event(SESSION_EXPIRED));
  return Promise.reject(err);
});

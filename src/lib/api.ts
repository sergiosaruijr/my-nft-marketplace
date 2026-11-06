// import axios from "axios";

// export const api = axios.create({
//   baseURL: "/api", // MSW atende /api/... em dev
//   timeout: 10_000,
// });

import axios from "axios";
import { getToken, SESSION_EXPIRED } from "./session";

export const api = axios.create({ baseURL: "/api", timeout: 10_000 });

api.interceptors.request.use((cfg) => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(undefined, (err) => {
  // 401 com token fora do login = sessão expirada
  if (
    err.response?.status === 401 &&
    getToken() &&
    !err.config?.url?.startsWith("/auth/login")
  ) {
    window.dispatchEvent(new Event(SESSION_EXPIRED));
  }
  return Promise.reject(err);
});

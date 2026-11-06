const KEY = "kurio.token";
export const SESSION_EXPIRED = "kurio:session-expired";

export const getToken = () => localStorage.getItem(KEY);
export const setToken = (t: string) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);

export const safeRedirect = (p?: string) =>
  p && p.startsWith("/") && !p.startsWith("//") ? p : "/";

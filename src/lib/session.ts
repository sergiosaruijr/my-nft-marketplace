const KEY = "kurio.token";
export const SESSION_EXPIRED = "kurio:session-expired";

export const getToken = () => localStorage.getItem(KEY);
export const setToken = (t: string) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);

export const safeRedirect = (p?: string) =>
  p && p.startsWith("/") && !p.startsWith("//") ? p : "/";

const GUEST = "kurio.guest";
export const getGuestId = () => {
  let id = localStorage.getItem(GUEST);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(GUEST, id);
  }
  return id;
};
export const clearGuestId = () => localStorage.removeItem(GUEST);

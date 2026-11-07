import { useSyncExternalStore } from "react";

const KEY = "kurio.token";
const GUEST = "kurio.guest";
export const SESSION_EXPIRED = "kurio:session-expired";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
window.addEventListener("storage", emit); // outras abas

export const getToken = () => localStorage.getItem(KEY);
export const setToken = (t: string) => {
  localStorage.setItem(KEY, t);
  emit();
};
export const clearToken = () => {
  localStorage.removeItem(KEY);
  emit();
};

export const useToken = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getToken,
    () => null,
  );

export const getGuestId = () => {
  let id = localStorage.getItem(GUEST);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(GUEST, id);
  }
  return id;
};
export const clearGuestId = () => localStorage.removeItem(GUEST);

export const safeRedirect = (p?: string) =>
  p && p.startsWith("/") && !p.startsWith("//") ? p : "/";

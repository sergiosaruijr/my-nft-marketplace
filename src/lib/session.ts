// const KEY = "kurio.token";
// export const SESSION_EXPIRED = "kurio:session-expired";

// export const getToken = () => localStorage.getItem(KEY);
// export const setToken = (t: string) => localStorage.setItem(KEY, t);
// export const clearToken = () => localStorage.removeItem(KEY);

const TOKEN_KEY = "kurio:token";

export const setToken = (t: string) => {
  localStorage.setItem(TOKEN_KEY, t);
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const SESSION_EXPIRED = "kurio:session_expired";

export const safeRedirect = (p?: string) =>
  p && p.startsWith("/") && !p.startsWith("//") ? p : "/";

export const getGuestId = () => {
  let id = localStorage.getItem(TOKEN_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(TOKEN_KEY, id);
  }
  return id;
};
export const clearGuestId = () => localStorage.removeItem(TOKEN_KEY);

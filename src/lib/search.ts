import type { CatalogTab } from "./catalog";

export type AuthMode = "login" | "signup";
export type AuthSearch = { auth?: AuthMode; redirect?: string };
export type HomeSearch = AuthSearch & { tab?: CatalogTab; page?: number };

export const validateAuthSearch = (s: Record<string, unknown>): AuthSearch => ({
  auth: s.auth === "login" || s.auth === "signup" ? s.auth : undefined,
  redirect: typeof s.redirect === "string" ? s.redirect : undefined,
});

export const validateHomeSearch = (s: Record<string, unknown>): HomeSearch => {
  const page = Number(s.page);
  return {
    ...validateAuthSearch(s),
    tab: s.tab === "alta" || s.tab === "novos" ? s.tab : undefined,
    page: Number.isInteger(page) && page > 1 ? page : undefined,
  };
};

import type { AnyRouter } from "@tanstack/react-router";

type Mode = "login" | "signup";
const href = (u: URL) => u.pathname + u.search + u.hash;

// abre o modal na página atual; depois do login, volta para ela (Verificar se faz sentido essa logica)
export function openAuthModal(router: AnyRouter, mode: Mode = "login") {
  const here = new URL(window.location.href);
  here.searchParams.delete("auth");
  here.searchParams.delete("redirect");

  const next = new URL(here);
  next.searchParams.set("auth", mode);
  next.searchParams.set("redirect", href(here));
  router.history.push(href(next));
}

export function switchAuthMode(router: AnyRouter, mode: Mode) {
  const u = new URL(window.location.href);
  u.searchParams.set("auth", mode);
  router.history.replace(href(u));
}

export function closeAuthModal(router: AnyRouter) {
  const u = new URL(window.location.href);
  u.searchParams.delete("auth");
  u.searchParams.delete("redirect");
  router.history.replace(href(u));
}

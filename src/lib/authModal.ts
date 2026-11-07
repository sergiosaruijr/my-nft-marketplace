import type { AnyRouter } from "@tanstack/react-router";
import { isDesktop } from "./viewport";

type Mode = "login" | "signup";
const href = (u: URL) => u.pathname + u.search + u.hash;

export function openAuthModal(router: AnyRouter, mode: Mode = "login") {
  const here = new URL(window.location.href);
  here.searchParams.delete("auth");
  here.searchParams.delete("redirect");

  if (!isDesktop()) {
    const page = mode === "signup" ? "/signup" : "/login";
    router.history.push(`${page}?redirect=${encodeURIComponent(href(here))}`);
    return;
  }

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

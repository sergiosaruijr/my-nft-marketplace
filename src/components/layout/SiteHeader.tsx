import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "../../features/shop/hooks";
import HeaderAccount from "../HeaderAccount";
import { wrap } from "./wrap";

const NAV = ["Início", "Mercado", "Criadores", "Aprenda"] as const;
const link =
  "relative flex h-full items-center text-[16px] tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-primary";
const on =
  "font-bold text-primary after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-primary";

export default function SiteHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { data: cart } = useCart();
  //   const count = cart?.items?.reduce((n, l) => n + l.qty, 0) ?? 0;
  const count = (cart?.items ?? []).reduce<number>(
    (acc, item) => acc + (item?.qty ?? 0),
    0,
  );

  return (
    <header className="hidden lg:block">
      <div className={wrap}>
        <div className="grid h-[69px] grid-cols-[1fr_auto_1fr] items-center border-b border-primary/30 pt-3.5">
          <Link
            to="/"
            className="w-fit text-[14px] font-bold tracking-[0.1em] text-foreground"
          >
            KURIO
          </Link>

          <nav
            aria-label="Principal"
            className="flex h-full items-center gap-10 text-foreground"
          >
            <Link to="/" className={`${link} ${path === "/" ? on : ""}`}>
              Início
            </Link>
            <Link
              to="/"
              hash="catalogo"
              className={`${link} ${path !== "/" ? on : ""}`}
            >
              Mercado
            </Link>
            {NAV.slice(2).map((l) => (
              <span
                key={l}
                aria-disabled="true"
                title="Indisponível nesta demonstração"
                className={`${link} cursor-not-allowed`}
              >
                {l}
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-6 justify-self-end">
            <Link
              to="/"
              hash="catalogo"
              aria-label="Buscar"
              className="text-foreground"
            >
              <Search size={24} />
            </Link>
            <Link
              to="/cart"
              //   aria-label={`Carrinho, ${count} item(ns)`}
              aria-label={`Carrinho, ${count} item${count === 1 ? "" : "s"}`}
              className="relative text-foreground"
            >
              <ShoppingCart size={24} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-ink">
                  {count}
                </span>
              )}
            </Link>
            <HeaderAccount />
          </div>
        </div>
      </div>
    </header>
  );
}

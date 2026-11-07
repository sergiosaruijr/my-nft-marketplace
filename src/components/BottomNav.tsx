import { Link } from "@tanstack/react-router";
import { Heart, Home, Scan, ShoppingCart, User } from "lucide-react";

const base =
  "grid size-11 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary";
const tone = (on: boolean) => (on ? "text-primary" : "text-secondary");

export default function BottomNav() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 flex h-24"
    >
      {/* esquerda */}
      <div className="flex flex-1 items-center justify-around rounded-tl-[36px] bg-ink-soft pr-2">
        <Link
          to="/"
          aria-label="Início"
          activeOptions={{ exact: true }}
          className={base}
        >
          {({ isActive }) => (
            <Home size={22} fill="currentColor" className={tone(isActive)} />
          )}
        </Link>
        <Link to={"/favorites" as any} aria-label="Favoritos" className={base}>
          {({ isActive }) => (
            <Heart size={22} fill="currentColor" className={tone(isActive)} />
          )}
        </Link>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 104 96"
        preserveAspectRatio="none"
        className="h-24 w-[104px] shrink-0 fill-ink-soft"
      >
        <path d="M0 0C16 0 20 40 52 40s36-40 52-40V96H0Z" />
      </svg>

      {/* direita */}
      <div className="flex flex-1 items-center justify-around rounded-tr-[36px] bg-ink-soft pl-2">
        <Link to="/cart" aria-label="Carrinho" className={base}>
          {({ isActive }) => (
            <ShoppingCart size={22} className={tone(isActive)} />
          )}
        </Link>
        <Link to="/profile" aria-label="Perfil" className={base}>
          {({ isActive }) => (
            <User size={22} fill="currentColor" className={tone(isActive)} />
          )}
        </Link>
      </div>

      <button
        type="button"
        disabled
        aria-label="Escanear (indisponível)"
        className="absolute -top-8 left-1/2 flex size-16 -translate-x-1/2 items-center justify-center rounded-full border-[6px] border-ink bg-gradient-to-br from-primary-light to-primary-dark shadow-[0_8px_20px_rgba(0,0,0,0.4)] disabled:opacity-100"
      >
        <Scan size={24} strokeWidth={2} className="text-ink" />
      </button>
    </nav>
  );
}

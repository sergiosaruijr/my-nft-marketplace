import { Link } from "@tanstack/react-router";
import { Heart, Home, Scan, ShoppingCart, User } from "lucide-react";

const base = "grid size-11 place-items-center";

function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex h-24 justify-center">
      {/* esquerdo */}
      <div className="flex h-full w-[175px] items-center justify-around rounded-tl-[36px] bg-surface-card">
        <Link
          to="/"
          aria-label="Home"
          activeOptions={{ exact: true }}
          className={base}
        >
          {({ isActive }) => (
            <Home
              size={22}
              fill="currentColor"
              className={isActive ? "text-primary" : "text-secondary"}
            />
          )}
        </Link>
        {/* <button aria-label="Favoritos" className={base}>
          <Heart size={22} fill="currentColor" className="text-secondary" />
        </button> */}
        <Link to={"/favorites" as any} aria-label="Favoritos" className={base}>
          {({ isActive }) => (
            <Heart
              size={22}
              fill="currentColor"
              className={isActive ? "text-primary" : "text-secondary"}
            />
          )}
        </Link>
      </div>

      {/* centro */}
      <div className="w-24 shrink-0" />

      {/* direito */}
      <div className="flex h-full w-[175px] items-center justify-around rounded-tr-[36px] bg-surface-card">
        <Link to="/cart" aria-label="Carrinho" className={base}>
          {({ isActive }) => (
            <ShoppingCart
              size={22}
              className={isActive ? "text-primary" : "text-secondary"}
            />
          )}
        </Link>
        <Link to="/profile" aria-label="Perfil" className={base}>
          {({ isActive }) => (
            <User
              size={22}
              fill="currentColor"
              className={isActive ? "text-primary" : "text-secondary"}
            />
          )}
        </Link>
      </div>

      <div
        className="absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-[6px] border-ink bg-gradient-to-br from-[#DD9A5F] to-[#C47B3E]"
        style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}
      >
        <Scan size={24} strokeWidth={2} className="text-ink" />
      </div>
    </div>
  );
}

export default BottomNav;

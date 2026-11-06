import { Heart, ShoppingCart, User, Home, Scan } from "lucide-react";

function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center h-24">
      {/* esquerdo */}
      <div className="flex items-center justify-around w-[175px] h-full bg-surface-card rounded-tl-[36px]">
        <button aria-label="Home">
          <Home size={22} className="text-primary" fill="#D28A4C" />
        </button>
        <button aria-label="Favoritos">
          <Heart size={22} className="text-secondary" fill="#CFB28C" />
        </button>
      </div>

      {/* centro */}
      <div className="w-24 shrink-0" />

      {/* direito */}
      <div className="flex items-center justify-around w-[175px] h-full bg-surface-card rounded-tr-[36px]">
        <button aria-label="Carrinho">
          <ShoppingCart size={22} className="text-secondary" />
        </button>
        <button aria-label="Perfil">
          <User size={22} className="text-secondary" fill="#CFB28C" />
        </button>
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 -top-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#DD9A5F] to-[#C47B3E] border-[6px] border-ink flex items-center justify-center"
        style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}
      >
        <Scan size={24} strokeWidth={2} className="text-ink" />
      </div>
    </div>
  );
}

export default BottomNav;

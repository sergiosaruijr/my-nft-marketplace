import { Link } from "@tanstack/react-router";
import {
  Download,
  Heart,
  LifeBuoy,
  LogOut,
  MapPin,
  ShoppingCart,
  Tag,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSignOut } from "../../features/auth/useSignOut";

const item =
  "flex w-full items-center gap-3 border-l-4 border-transparent px-3 py-3 text-[14px] text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary";
const active = "border-primary bg-black/20 font-bold";

const soon: { label: string; Icon: LucideIcon }[] = [
  { label: "Atividade", Icon: ShoppingCart },
  { label: "Lista de interesse", Icon: Heart },
  { label: "Ofertas", Icon: Tag },
  { label: "Arquivos baixados", Icon: Download },
  { label: "Suporte", Icon: LifeBuoy },
];

export default function ProfileSidebar() {
  const signOut = useSignOut();

  return (
    <nav aria-label="Meu perfil" className="bg-surface-card pt-4">
      <h2 className="px-3 pb-2 font-bold text-foreground">Meu perfil</h2>
      <ul>
        <li>
          <Link
            to="/profile"
            className={item}
            activeProps={{ className: active }}
          >
            <User size={18} /> Dados do perfil
          </Link>
        </li>
        <li>
          <Link to={"/wallets" as any} activeProps={{ className: active }}>
            <MapPin size={18} /> Carteiras
          </Link>
        </li>
        {soon.map(({ label, Icon }) => (
          <li key={label}>
            <span
              aria-disabled="true"
              title="Em breve"
              className={`${item} cursor-not-allowed opacity-60`}
            >
              <Icon size={18} /> {label}
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={signOut}
        className={`${item} mt-1 border-t border-t-primary/20 font-bold`}
      >
        <LogOut size={18} /> Sair
      </button>
    </nav>
  );
}

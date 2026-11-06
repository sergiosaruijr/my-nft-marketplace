// import { skipToken, useQuery } from "@tanstack/react-query";
// import { Link } from "@tanstack/react-router";
// import { sessionKey } from "../features/auth/session";
// import type { User } from "../types";
// import { UserIcon } from "lucide-react";

// export default function HeaderAccount() {
//   // só lê o cache preenchido pelo login/getSession (Verificar se faz sentido)
//   const { data: user } = useQuery<User | null>({
//     queryKey: sessionKey,
//     queryFn: skipToken,
//   });

//   if (!user)
//     return (
//       <Link
//         to="/"
//         search={{ auth: "login" }}
//         className="rounded-lg bg-primary px-4 py-2 font-bold text-ink hover:bg-primary-light"
//       >
//         Entrar
//       </Link>
//     );

//   return (
//     <Link
//       to="/profile"
//       aria-label="Meu perfil"
//       className="grid size-10 place-items-center overflow-hidden rounded-full border border-primary/40 bg-surface text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
//     >
//       {user.avatarUrl ? (
//         <img src={user.avatarUrl} alt="" className="size-full object-cover" />
//       ) : (
//         <UserIcon />
//       )}
//     </Link>
//   );
// }
// src/components/HeaderAccount.tsx
import { Link, useRouter } from "@tanstack/react-router";
import { LogIn, UserIcon } from "lucide-react";
import { useSession } from "../features/auth/useAuth";
import { openAuthModal } from "../lib/authModal";

export default function HeaderAccount() {
  const router = useRouter();
  const { data: user } = useSession();

  if (!user)
    return (
      <button
        type="button"
        onClick={() => openAuthModal(router)}
        className="flex h-[35px] items-center gap-2 rounded bg-primary px-3 text-[15px] font-bold text-ink outline-none hover:bg-primary-light focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        <LogIn size={18} /> Entrar
      </button>
    );

  return (
    <Link
      to="/profile"
      aria-label="Meu perfil"
      className="grid size-10 place-items-center overflow-hidden rounded-full border border-primary/40 bg-surface-card text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="" className="size-full object-cover" />
      ) : (
        <UserIcon className="size-5" />
      )}
    </Link>
  );
}

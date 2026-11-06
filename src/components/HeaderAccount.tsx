import { skipToken, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { sessionKey } from "../features/auth/session";
import type { User } from "../types";
import { UserIcon } from "lucide-react";

export default function HeaderAccount() {
  // só lê o cache preenchido pelo login/getSession (Verificar se faz sentido)
  const { data: user } = useQuery<User | null>({
    queryKey: sessionKey,
    queryFn: skipToken,
  });

  if (!user)
    return (
      <Link
        to="/"
        search={{ auth: "login" }}
        className="rounded-lg bg-primary px-4 py-2 font-bold text-ink hover:bg-primary-light"
      >
        Entrar
      </Link>
    );

  return (
    <Link
      to="/profile"
      aria-label="Meu perfil"
      className="grid size-10 place-items-center overflow-hidden rounded-full border border-primary/40 bg-surface text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="" className="size-full object-cover" />
      ) : (
        <UserIcon />
      )}
    </Link>
  );
}

import { useId, useState } from "react";
import { skipToken, useQuery } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import SiteLayout from "../components/layout/SiteLayout";
import ProfileSidebar from "../components/desktop/ProfileSideBar";
import AvatarField from "../features/profile/AvatarField";
import { sessionKey } from "../features/auth/session";
import type { User } from "../types";

const input =
  "h-10 w-full border border-primary/40 bg-ink px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary";

function Field({
  label,
  required,
  type = "text",
  defaultValue,
}: {
  label: string;
  required?: boolean;
  type?: string;
  defaultValue?: string;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14px] text-foreground">
        {label}
        {required && <span className="ml-0.5 text-text-coral">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPass && show ? "text" : type}
          defaultValue={defaultValue}
          className={input}
        />
        {isPass && (
          <button
            type="button"
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: user } = useQuery<User | null>({
    queryKey: sessionKey,
    queryFn: skipToken,
  });
  if (!user) return null;

  return (
    <SiteLayout footer="lg">
      <div className="mx-auto grid w-full max-w-[1200px] gap-7 px-4 py-8 lg:grid-cols-[310px_1fr]">
        <ProfileSidebar />

        <main>
          <h1 className="mb-6 font-bold text-foreground">
            Perfil do colecionador
          </h1>

          <form onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="grid gap-x-7 gap-y-6 md:grid-cols-2">
              <Field label="Nome de exibição" required />
              <Field
                label="Nome de usuário"
                required
                defaultValue={user.username}
              />
              <Field label="E-mail" required defaultValue={user.email} />
              <Field label="Nome ENS" required />
              <Field label="Apelido da carteira" required />
              <AvatarField user={user} />
            </div>

            <h2 className="mb-4 mt-10 font-bold text-foreground">
              Alterar senha
            </h2>
            <div className="grid max-w-[520px] gap-5">
              <Field label="Senha atual" type="password" />
              <Field label="Nova senha" type="password" />
              <Field label="Confirmar nova senha" type="password" />
            </div>

            <button
              type="submit"
              className="mt-8 h-10 bg-primary px-8 font-bold text-ink hover:bg-primary-light"
            >
              Salvar
            </button>
          </form>
        </main>
      </div>
    </SiteLayout>
  );
}

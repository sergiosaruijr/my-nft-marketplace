import { useState } from "react";
import { Link, useRouter, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthLayout from "../components/AuthLayout";
import TextField from "../components/TextField";
import SocialButtons from "../components/SocialButtons";
import { useLogin } from "../features/auth/useAuth";
import { parseApiError } from "../lib/errors";
import { safeRedirect } from "../lib/session";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe sua senha"),
});
type Form = z.infer<typeof schema>;

const linkCls =
  "rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary underline-offset-4";

export default function LoginPage() {
  const router = useRouter();
  const { redirect } = useSearch({ strict: false }) as { redirect?: string };
  const login = useLogin();
  const [notice, setNotice] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
      router.history.push(safeRedirect(redirect));
    } catch (e) {
      setError("root", { message: parseApiError(e).message });
    }
  });

  return (
    <AuthLayout
      title="Entrar"
      footer={
        <>
          Novo na Kurio?{" "}
          <Link to="/signup" search={{ redirect }} className={linkCls}>
            Crie uma conta
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <div className="flex flex-col gap-3">
          <TextField
            label="E-mail"
            placeholder="contato@email.com"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="Senha"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="mt-2.5 flex h-5 items-center justify-between gap-3">
          <p
            role="status"
            className="min-w-0 truncate text-[11px] text-text-muted"
          >
            {notice}
          </p>
          <button
            type="button"
            onClick={() => setNotice("Recurso indisponível na demo.")}
            className="shrink-0 rounded text-[14px] leading-5 text-text-accent outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Esqueceu a senha?
          </button>
        </div>

        {errors.root && (
          <p role="alert" className="mt-3 text-[13px] text-text-coral">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          aria-busy={login.isPending}
          className="mt-[38px] h-[60px] w-full rounded-xl bg-primary text-[16px] font-bold text-ink outline-none hover:bg-primary-light focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-60"
        >
          {login.isPending ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <SocialButtons />
    </AuthLayout>
  );
}

// import { useState } from "react";
// import { Link, useRouter, useSearch } from "@tanstack/react-router";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import AuthLayout from "../components/AuthLayout";
// import TextField from "../components/TextField";
// import SocialButtons from "../components/SocialButtons";
// import { useLogin } from "../features/auth/useAuth";
// import { parseApiError } from "../lib/errors";
// import { safeRedirect } from "../lib/session";

// const schema = z.object({
//   email: z.string().email("Informe um e-mail válido"),
//   password: z.string().min(1, "Informe sua senha"),
// });
// type Form = z.infer<typeof schema>;

// export default function LoginPage() {
//   const router = useRouter();
//   const { redirect } = useSearch({ strict: false }) as { redirect?: string };
//   const login = useLogin();
//   const [notice, setNotice] = useState("");
//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm<Form>({ resolver: zodResolver(schema) });

//   const onSubmit = handleSubmit(async (values) => {
//     try {
//       await login.mutateAsync(values);
//       router.history.push(safeRedirect(redirect));
//     } catch (e) {
//       setError("root", { message: parseApiError(e).message });
//     }
//   });

//   return (
//     <AuthLayout
//       title="Entrar"
//       footer={
//         <>
//           Novo na Kurio?{" "}
//           <Link
//             to="/signup"
//             search={{ redirect }}
//             className="font-bold text-primary underline-offset-4 hover:underline"
//           >
//             Crie uma conta
//           </Link>
//         </>
//       }
//     >
//       <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
//         <TextField
//           label="contato@email.com"
//           type="email"
//           autoComplete="email"
//           error={errors.email?.message}
//           {...register("email")}
//         />
//         <TextField
//           label="Senha"
//           type="password"
//           autoComplete="current-password"
//           error={errors.password?.message}
//           {...register("password")}
//         />
//         <button
//           type="button"
//           onClick={() =>
//             setNotice("Recuperação de senha indisponível nesta demonstração.")
//           }
//           className="self-end text-sm text-text-accent outline-none focus-visible:ring-2 focus-visible:ring-primary"
//         >
//           Esqueceu a senha?
//         </button>
//         <p role="status" className="min-h-4 text-xs text-text-muted">
//           {notice}
//         </p>

//         {errors.root && (
//           <p role="alert" className="text-sm text-text-coral">
//             {errors.root.message}
//           </p>
//         )}
//         <button
//           type="submit"
//           disabled={login.isPending}
//           aria-busy={login.isPending}
//           className="mt-2 h-[60px] rounded-xl bg-primary font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-60"
//         >
//           {login.isPending ? "Entrando…" : "Entrar"}
//         </button>
//       </form>
//       <SocialButtons />
//     </AuthLayout>
//   );
// }

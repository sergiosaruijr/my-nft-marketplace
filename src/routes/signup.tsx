import { Link, useRouter, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthLayout from "../components/AuthLayout";
import TextField from "../components/TextField";
import SocialButtons from "../components/SocialButtons";
import { useSignup } from "../features/auth/useAuth";
import { parseApiError } from "../lib/errors";
import { safeRedirect } from "../lib/session";

const schema = z
  .object({
    username: z.string().trim().min(3, "Use ao menos 3 caracteres"),
    email: z.string().email("Informe um e-mail válido"),
    password: z.string().min(8, "Use ao menos 8 caracteres"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "As senhas não coincidem",
  });
type Form = z.infer<typeof schema>;

const linkCls =
  "rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary underline-offset-4";

export default function SignupPage() {
  const router = useRouter();
  const { redirect } = useSearch({ strict: false }) as { redirect?: string };
  const signup = useSignup();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async ({ username, email, password }) => {
    try {
      await signup.mutateAsync({ username, email, password });
      router.history.push(safeRedirect(redirect));
    } catch (e) {
      const { message, fields } = parseApiError(e);
      if (fields)
        Object.entries(fields).forEach(([k, v]) =>
          setError(k as keyof Form, { message: v }),
        );
      else setError("root", { message });
    }
  });

  return (
    <AuthLayout
      title="Criar perfil de colecionador"
      titleClassName="text-[18.5px]"
      footer={
        <>
          Já tem uma conta?{" "}
          <Link to="/login" search={{ redirect }} className={linkCls}>
            Entre
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <div className="flex flex-col gap-3">
          <TextField
            label="Nome de usuário"
            // centerPlaceholder
            autoComplete="username"
            error={errors.username?.message}
            {...register("username")}
          />
          <TextField
            label="E-mail"
            placeholder="Digite seu e-mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="Senha"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <TextField
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            error={errors.confirm?.message}
            {...register("confirm")}
          />
        </div>

        {errors.root && (
          <p role="alert" className="mt-3 text-[13px] text-text-coral">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={signup.isPending}
          aria-busy={signup.isPending}
          className="mt-10 h-[60px] w-full rounded-xl bg-primary text-[16px] font-bold text-ink outline-none hover:bg-primary-light focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-60"
        >
          {signup.isPending ? "Criando perfil…" : "Criar perfil"}
        </button>
      </form>

      <SocialButtons />
    </AuthLayout>
  );
}

// import { Link, useRouter, useSearch } from "@tanstack/react-router";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import AuthLayout from "../components/AuthLayout";
// import TextField from "../components/TextField";
// import SocialButtons from "../components/SocialButtons";
// import { useSignup } from "../features/auth/useAuth";
// import { parseApiError } from "../lib/errors";
// import { safeRedirect } from "../lib/session";

// const schema = z
//   .object({
//     username: z.string().trim().min(3, "Use ao menos 3 caracteres"),
//     email: z.string().email("Informe um e-mail válido"),
//     password: z.string().min(8, "Use ao menos 8 caracteres"),
//     confirm: z.string(),
//   })
//   .refine((v) => v.password === v.confirm, {
//     path: ["confirm"],
//     message: "As senhas não coincidem",
//   });
// type Form = z.infer<typeof schema>;

// export default function SignupPage() {
//   const router = useRouter();
//   const { redirect } = useSearch({ strict: false }) as { redirect?: string };
//   const signup = useSignup();
//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm<Form>({ resolver: zodResolver(schema) });

//   const onSubmit = handleSubmit(async ({ username, email, password }) => {
//     try {
//       await signup.mutateAsync({ username, email, password });
//       router.history.push(safeRedirect(redirect));
//     } catch (e) {
//       const { message, fields } = parseApiError(e);
//       if (fields)
//         Object.entries(fields).forEach(([k, v]) =>
//           setError(k as keyof Form, { message: v }),
//         );
//       else setError("root", { message });
//     }
//   });

//   return (
//     <AuthLayout
//       title="Criar perfil de colecionador"
//       footer={
//         <>
//           Já tem uma conta?{" "}
//           <Link
//             to="/login"
//             search={{ redirect }}
//             className="font-bold text-primary underline-offset-4 hover:underline"
//           >
//             Entre
//           </Link>
//         </>
//       }
//     >
//       <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
//         <TextField
//           label="Nome de usuário"
//           autoComplete="username"
//           error={errors.username?.message}
//           {...register("username")}
//         />
//         <TextField
//           label="Digite seu e-mail"
//           type="email"
//           autoComplete="email"
//           error={errors.email?.message}
//           {...register("email")}
//         />
//         <TextField
//           label="Senha"
//           type="password"
//           autoComplete="new-password"
//           error={errors.password?.message}
//           {...register("password")}
//         />
//         <TextField
//           label="Confirmar senha"
//           type="password"
//           autoComplete="new-password"
//           error={errors.confirm?.message}
//           {...register("confirm")}
//         />

//         {errors.root && (
//           <p role="alert" className="text-sm text-text-coral">
//             {errors.root.message}
//           </p>
//         )}
//         <button
//           type="submit"
//           disabled={signup.isPending}
//           aria-busy={signup.isPending}
//           className="mt-4 h-[60px] rounded-xl bg-primary font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-60"
//         >
//           {signup.isPending ? "Criando perfil…" : "Criar perfil"}
//         </button>
//       </form>
//       <SocialButtons />
//     </AuthLayout>
//   );
// }

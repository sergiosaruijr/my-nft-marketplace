import { Link, useSearch } from "@tanstack/react-router";
import AuthLayout from "../components/AuthLayout";
import SignupForm from "../features/auth/SignupForm";

const linkCls =
  "rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary underline-offset-4";

export default function SignupPage() {
  const { redirect } = useSearch({ strict: false }) as { redirect?: string };

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
      <SignupForm redirect={redirect} />
    </AuthLayout>
  );
}

import { Link, useSearch } from "@tanstack/react-router";
import AuthLayout from "../components/AuthLayout";
import LoginForm from "../features/auth/LoginForm";

const linkCls =
  "rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary underline-offset-4";

export default function LoginPage() {
  const { redirect } = useSearch({ strict: false }) as { redirect?: string };

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
      <LoginForm redirect={redirect} />
    </AuthLayout>
  );
}

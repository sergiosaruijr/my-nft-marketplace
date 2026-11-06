import { useRouter, useSearch } from "@tanstack/react-router";
import AuthModal from "./AuthModal";
import { closeAuthModal, switchAuthMode } from "../lib/authModal";
import { isDesktop } from "../lib/viewport";

export default function AuthModalHost() {
  const router = useRouter();
  const { auth, redirect } = useSearch({ strict: false }) as {
    auth?: "login" | "signup";
    redirect?: string;
  };
  if (!auth || !isDesktop()) return null;

  return (
    <AuthModal
      mode={auth}
      redirect={redirect}
      onModeChange={(m) => switchAuthMode(router, m)}
      onClose={() => closeAuthModal(router)}
    />
  );
}

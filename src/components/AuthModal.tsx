// import { useEffect, useRef } from "react";
// import LoginForm from "../features/auth/LoginForm";
// import SignupForm from "../features/auth/SignupForm";

// type Mode = "login" | "signup";
// type Props = {
//   mode: Mode;
//   redirect?: string;
//   onModeChange: (m: Mode) => void;
//   onClose: () => void;
// };

// export default function AuthModal({
//   mode,
//   redirect,
//   onModeChange,
//   onClose,
// }: Props) {
//   const ref = useRef<HTMLDialogElement>(null);

//   useEffect(() => {
//     const d = ref.current;
//     if (d && !d.open) d.showModal();
//   }, []);

//   const tab = (m: Mode, label: string) => (
//     <button
//       type="button"
//       onClick={() => onModeChange(m)}
//       aria-pressed={mode === m}
//       className={`outline-none focus-visible:ring-2 focus-visible:ring-primary ${
//         mode === m ? "text-text-accent" : "text-foreground"
//       }`}
//     >
//       {label}
//     </button>
//   );

//   return (
//     <dialog
//       ref={ref}
//       aria-label="Entrar ou criar conta"
//       onClose={onClose} // Esc
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//       className="m-auto w-[500px] max-w-[calc(100vw-32px)] border-b-[6px] border-primary bg-ink p-0 text-foreground backdrop:bg-black/70"
//     >
//       <div className="relative px-20 pb-10 pt-12">
//         <button
//           type="button"
//           onClick={onClose}
//           aria-label="Fechar"
//           className="absolute right-4 top-4 text-primary"
//         >
//           ✕
//         </button>

//         <div className="mb-8 flex justify-center gap-3 text-[20px] font-bold">
//           {tab("login", "Entrar")}
//           <span aria-hidden className="w-px bg-primary" />
//           {tab("signup", "Criar conta")}
//         </div>

//         {mode === "login" ? (
//           <LoginForm redirect={redirect} />
//         ) : (
//           <SignupForm redirect={redirect} />
//         )}
//       </div>
//     </dialog>
//   );
// }
import { useEffect, useRef } from "react";
import LoginForm from "../features/auth/LoginForm";
import SignupForm from "../features/auth/SignupForm";

type Mode = "login" | "signup";
type Props = {
  mode: Mode;
  redirect?: string;
  onModeChange: (m: Mode) => void;
  onClose: () => void;
};

export default function AuthModal({
  mode,
  redirect,
  onModeChange,
  onClose,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  // abre o dialog (o navegador devolve o foco ao botão que o abriu ao fechar)
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  // foco no primeiro campo ao abrir e ao trocar entre Entrar e Criar conta
  useEffect(() => {
    ref.current?.querySelector<HTMLInputElement>("input")?.focus();
  }, [mode]);

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => onModeChange(m)}
      aria-pressed={mode === m}
      className={`outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        mode === m ? "text-text-accent" : "text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <dialog
      ref={ref}
      aria-label="Entrar ou criar conta"
      onClose={onClose} // Esc
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[500px] max-w-[calc(100vw-32px)] border-b-[6px] border-primary bg-ink p-0 text-foreground backdrop:bg-black/70"
    >
      <div className="relative px-20 pb-10 pt-12">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          ✕
        </button>

        <div className="mb-8 flex justify-center gap-3 text-[20px] font-bold">
          {tab("login", "Entrar")}
          <span aria-hidden className="w-px bg-primary" />
          {tab("signup", "Criar conta")}
        </div>

        {mode === "login" ? (
          <LoginForm redirect={redirect} />
        ) : (
          <SignupForm redirect={redirect} />
        )}
      </div>
    </dialog>
  );
}

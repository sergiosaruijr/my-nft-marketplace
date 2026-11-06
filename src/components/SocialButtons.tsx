import { useState } from "react";

const btn =
  "flex h-10 w-full items-center justify-center gap-3 rounded-[6px] border border-surface-raised pr-4 text-[13px] font-medium text-text-secondary outline-none transition-colors hover:bg-surface-card focus-visible:ring-2 focus-visible:ring-primary";

export default function SocialButtons() {
  const [notice, setNotice] = useState("");
  const unavailable = (n: string) => () =>
    setNotice(`Login com ${n} indisponível na demo.`);

  return (
    <section aria-label="Outras formas de entrar" className="mt-10">
      <div className="mb-3 flex items-center gap-[11px] text-[13px] leading-4 text-foreground">
        <span aria-hidden className="h-px flex-1 bg-surface-raised" />
        Ou continue com
        <span aria-hidden className="h-px flex-1 bg-surface-raised" />
      </div>

      <div className="relative flex flex-col gap-4">
        <button type="button" className={btn} onClick={unavailable("Google")}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path
              className="fill-google-blue"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              className="fill-google-green"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              className="fill-google-yellow"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              className="fill-orange"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar com Google
        </button>

        <button type="button" className={btn} onClick={unavailable("Facebook")}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path
              className="fill-facebook"
              d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.1v2.4H7.6V13h2.7v8h3.2z"
            />
          </svg>
          Continuar com Facebook
        </button>

        {/* absoluto: não desloca o layout do Figma */}
        <p
          role="status"
          className="absolute inset-x-0 top-full mt-1 text-center text-[11px] text-text-muted"
        >
          {notice}
        </p>
      </div>
    </section>
  );
}

// import { useState } from "react";

// const btn =
//   "flex h-10 w-full items-center justify-center gap-3 rounded-lg border border-border text-[13px] font-medium text-text-secondary outline-none hover:bg-surface-card focus-visible:ring-2 focus-visible:ring-primary";

// function FacebookIcon() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="#1877F2">
//       <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
//     </svg>
//   );
// }

// export default function SocialButtons() {
//   const [notice, setNotice] = useState("");
//   const unavailable = (n: string) => () =>
//     setNotice(`Login com ${n} indisponível nesta demonstração.`);
//   return (
//     <div className="mt-8">
//       <div className="mb-4 flex items-center gap-3 text-xs text-foreground">
//         <span className="h-px flex-1 bg-border" /> Ou continue com{" "}
//         <span className="h-px flex-1 bg-border" />
//       </div>
//       <div className="flex flex-col gap-3">
//         <button type="button" className={btn} onClick={unavailable("Google")}>
//           <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
//             <path
//               className="fill-google-blue"
//               d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//             />
//             <path
//               className="fill-google-green"
//               d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//             />
//             <path
//               className="fill-google-yellow"
//               d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//             />
//             <path
//               className="fill-orange"
//               d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//             />
//           </svg>
//           Continuar com Google
//         </button>
//         <button type="button" className={btn} onClick={unavailable("Facebook")}>
//           {/* <Facebook size={20} className="text-facebook" aria-hidden /> Continuar */}
//           <FacebookIcon />
//           Continuar com Facebook
//         </button>
//       </div>
//       <p
//         role="status"
//         className="mt-3 min-h-4 text-center text-xs text-text-muted"
//       >
//         {notice}
//       </p>
//     </div>
//   );
// }

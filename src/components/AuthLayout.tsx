import type { ReactNode } from "react";

type Props = {
  title: string;
  titleClassName?: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthLayout({
  title,
  titleClassName = "text-[20px]",
  children,
  footer,
}: Props) {
  return (
    <main className="min-h-dvh bg-ink px-7 pb-6">
      <div className="mx-auto w-full max-w-[358px] pt-[132px]">
        <p
          aria-hidden
          className="pl-[0.1em] text-center text-[32px] font-bold leading-none tracking-[0.1em] text-foreground"
        >
          KURIO
        </p>

        <h1
          className={`mt-[87px] mb-[33px] text-center font-bold leading-7 text-foreground ${titleClassName}`}
        >
          {title}
        </h1>

        {children}

        <p className="mt-10 text-center text-[15px] leading-5 text-text-secondary">
          {footer}
        </p>
      </div>
    </main>
  );
}

// import type { ReactNode } from "react";

// export default function AuthLayout({
//   title,
//   children,
//   footer,
// }: {
//   title: string;
//   children: ReactNode;
//   footer: ReactNode;
// }) {
//   return (
//     <main className="min-h-dvh bg-ink px-6 pb-8">
//       <div className="mx-auto flex min-h-dvh w-full max-w-[414px] flex-col">
//         <p
//           aria-hidden
//           className="pt-28 text-center text-[32px] font-bold tracking-[0.15em] text-foreground"
//         >
//           KURIO
//         </p>
//         <h1 className="mt-24 mb-8 text-center text-lg font-bold text-foreground">
//           {title}
//         </h1>
//         {children}
//         <p className="mt-auto pt-10 text-center text-sm text-text-secondary">
//           {footer}
//         </p>
//       </div>
//     </main>
//   );
// }

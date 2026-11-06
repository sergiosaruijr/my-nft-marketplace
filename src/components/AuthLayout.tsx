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

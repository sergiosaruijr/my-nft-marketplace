import { useId, type ReactNode } from "react";

type Ctl = {
  id: string;
  className: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
};
export const controlCls = (err?: boolean) =>
  `h-10 w-full rounded border bg-transparent px-3 text-[14px] text-foreground outline-none placeholder:text-secondary focus:border-primary ${err ? "border-error" : "border-border-soft"}`;

export default function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: (c: Ctl) => ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[14px] leading-5 text-foreground"
      >
        {label}
        {required && (
          <>
            <span aria-hidden className="ml-0.5 text-[16px] text-text-coral">
              *
            </span>
            <span className="sr-only"> (obrigatório)</span>
          </>
        )}
      </label>
      {children({
        id,
        className: controlCls(!!error),
        "aria-invalid": !!error,
        "aria-describedby": error ? `${id}-err` : undefined,
      })}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-xs text-text-coral">
          {error}
        </p>
      )}
    </div>
  );
}

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  centerPlaceholder?: boolean;
};

const TextField = forwardRef<HTMLInputElement, Props>(
  (
    { label, error, type = "text", placeholder, centerPlaceholder, ...rest },
    ref,
  ) => {
    const id = useId();
    const errId = `${id}-err`;
    const [show, setShow] = useState(false);
    const isPwd = type === "password";
    const Icon = show ? Eye : EyeOff;

    return (
      <div>
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={isPwd && show ? "text" : type}
            placeholder={placeholder ?? label}
            aria-invalid={!!error}
            aria-describedby={error ? errId : undefined}
            className={[
              "h-[50px] w-full rounded-xl border bg-transparent px-4 text-[14px] text-foreground outline-none placeholder:text-secondary focus-visible:ring-2 focus-visible:ring-primary",
              isPwd ? "pr-12" : "",
              centerPlaceholder ? "placeholder-shown:text-center" : "",
              error
                ? "border-error"
                : "border-surface-raised focus:border-primary",
            ].join(" ")}
            {...rest}
          />
          {isPwd && (
            <button
              type="button"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={show}
              onClick={() => setShow((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded text-border-soft outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Icon size={18} strokeWidth={1.75} />
            </button>
          )}
        </div>
        {error && (
          <p id={errId} className="mt-1.5 text-xs text-text-coral">
            {error}
          </p>
        )}
      </div>
    );
  },
);
export default TextField;

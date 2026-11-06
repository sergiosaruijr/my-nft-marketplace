import type { ReactNode } from "react";

type Props = {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  end?: boolean;
  className?: string;
  children: ReactNode;
};

export default function RadioCard({
  name,
  value,
  checked,
  onChange,
  end,
  className = "",
  children,
}: Props) {
  const dot = (
    <span
      aria-hidden
      className={`grid size-[18px] shrink-0 place-items-center rounded-full border-2 ${checked ? "border-primary" : "border-border-soft"} ${end ? "ml-auto" : ""}`}
    >
      {checked && <span className="size-2 rounded-full bg-primary" />}
    </span>
  );
  return (
    <label
      className={`flex cursor-pointer items-center gap-[18px] rounded-2xl bg-surface-card has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {!end && dot}
      {children}
      {end && dot}
    </label>
  );
}

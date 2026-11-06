import { useEffect, useState } from "react";

export const notify = (message: string) =>
  window.dispatchEvent(new CustomEvent("kurio:notify", { detail: message }));

export default function Announcer() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    let t: number;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      clearTimeout(t);
      t = window.setTimeout(() => setMsg(""), 5000);
    };
    window.addEventListener("kurio:notify", on);
    return () => {
      window.removeEventListener("kurio:notify", on);
      clearTimeout(t);
    };
  }, []);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-28 z-50 flex justify-center px-6 lg:bottom-8"
    >
      {msg && (
        <p className="pointer-events-auto rounded-xl border border-border-soft bg-surface-raised px-4 py-3 text-[13px] text-foreground shadow-lg">
          {msg}
        </p>
      )}
    </div>
  );
}

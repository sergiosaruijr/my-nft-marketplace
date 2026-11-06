import type { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

type Props = { children: ReactNode; footer?: "all" | "lg" | "none" };

export default function SiteLayout({ children, footer = "all" }: Props) {
  return (
    <div className="min-h-dvh bg-ink">
      <SiteHeader />
      {children}
      {footer !== "none" && (
        <SiteFooter
          className={footer === "lg" ? "hidden lg:block" : "pb-24 lg:pb-0"}
        />
      )}
    </div>
  );
}

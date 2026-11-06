import type { ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import SiteLayout from "./layout/SiteLayout";
import ProfileSidebar from "../components/desktop/ProfileSideBar";
import { wrap } from "./layout/wrap";

export default function ProfileLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <SiteLayout footer="lg">
      <header className="flex items-center gap-4 px-7 pb-4 pt-8 lg:hidden">
        <button
          type="button"
          aria-label="Voltar"
          onClick={() => router.history.back()}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-primary/30 bg-surface-card text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-[20px] font-bold text-foreground">{title}</h1>
      </header>

      <div
        className={`${wrap} grid gap-7 pb-16 lg:grid-cols-[310px_minmax(0,1fr)] lg:pt-8`}
      >
        <div className="hidden lg:block">
          <ProfileSidebar />
        </div>
        <main className="px-7 lg:px-0">
          <h1 className="mb-6 hidden font-bold text-foreground lg:block">
            {title}
          </h1>
          {children}
        </main>
      </div>
    </SiteLayout>
  );
}

import { ChevronLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export default function ScreenHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <header className="relative mx-7 flex h-9 items-center justify-center">
      <button
        type="button"
        aria-label="Voltar"
        onClick={() => router.history.back()}
        className="absolute left-0 grid size-9 place-items-center rounded-full bg-surface-raised text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ChevronLeft size={20} />
      </button>
      <h1 className="text-[18px] font-bold text-foreground">{title}</h1>
    </header>
  );
}

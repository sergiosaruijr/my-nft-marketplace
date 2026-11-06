import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CatalogTab } from "../lib/catalog";

type Props = {
  page: number;
  pages: number;
  tab?: CatalogTab;
  anchor?: boolean;
};

const box =
  "grid size-9 place-items-center border text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-primary";

export default function Pagination({ page, pages, tab, anchor }: Props) {
  if (pages <= 1) return null;
  const hash = anchor ? "catalogo" : undefined;
  const q = (p: number) => ({ tab, page: p > 1 ? p : undefined });
  const off = `${box} border-primary/20 text-primary/30`;

  return (
    <nav
      aria-label="Paginação"
      className="mt-10 flex items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          to="/"
          search={q(page - 1)}
          hash={hash}
          aria-label="Página anterior"
          className={`${box} border-primary/40 text-primary`}
        >
          <ChevronLeft size={18} />
        </Link>
      ) : (
        <span aria-hidden className={off}>
          <ChevronLeft size={18} />
        </span>
      )}

      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          to="/"
          search={q(n)}
          hash={hash}
          aria-label={`Página ${n}`}
          aria-current={n === page ? "page" : undefined}
          className={`${box} ${n === page ? "border-primary bg-primary font-bold text-ink" : "border-primary/40 text-primary"}`}
        >
          {n}
        </Link>
      ))}

      {page < pages ? (
        <Link
          to="/"
          search={q(page + 1)}
          hash={hash}
          aria-label="Próxima página"
          className={`${box} border-primary/40 text-primary`}
        >
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span aria-hidden className={off}>
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}

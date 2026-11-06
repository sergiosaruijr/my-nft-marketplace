import { useNavigate, useSearch } from "@tanstack/react-router";
import type { CatalogTab } from "../lib/catalog";

const TABS: { label: string; value?: CatalogTab }[] = [
  { label: "Todos os NFTs" },
  { label: "Novos lançamentos", value: "novos" },
  { label: "Em alta", value: "alta" },
];

function Tabs() {
  const { tab } = useSearch({ from: "/" });
  const navigate = useNavigate();

  return (
    <div
      role="group"
      aria-label="Filtrar NFTs"
      className="flex items-center gap-4 mt-5 overflow-x-auto"
    >
      {TABS.map(({ label, value }) => {
        const active = tab === value;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={active}
            onClick={() =>
              navigate({
                to: "/",
                search: { tab: value },
                replace: true,
                resetScroll: false,
              })
            }
            className={[
              "text-sm font-medium pb-1 whitespace-nowrap shrink-0 border-b-2 outline-none focus-visible:ring-2 focus-visible:ring-primary",
              active
                ? "text-primary border-primary"
                : "text-foreground border-transparent",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;

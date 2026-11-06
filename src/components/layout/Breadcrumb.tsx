import { Link } from "@tanstack/react-router";

export default function Breadcrumb({
  items,
}: {
  items: { label: string; to?: "/" }[];
}) {
  return (
    <nav
      aria-label="Você está em"
      className="pt-8 text-[14px] font-bold text-foreground"
    >
      <ol className="flex gap-2">
        {items.map((it, i) => (
          <li
            key={it.label}
            aria-current={i === items.length - 1 ? "page" : undefined}
            className="flex gap-2"
          >
            {it.to ? (
              <Link
                to={it.to}
                className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary"
              >
                {it.label}
              </Link>
            ) : (
              it.label
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

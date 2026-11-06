import { useState } from "react";
import { Link } from "@tanstack/react-router";
import ImageBox from "./ImageBox";
import { NFTS } from "../../data/nfts";
import { eth } from "../../lib/format";

const PER = 5;

export default function NFTCarousel({
  title,
  exclude,
}: {
  title: string;
  exclude?: string;
}) {
  const items = NFTS.filter((n) => n.id !== exclude);
  const pages = Math.ceil(items.length / PER);
  const [page, setPage] = useState(0);

  return (
    <section aria-label={title} className="mt-[70px]">
      <h2 className="border-b border-primary/40 pb-2 text-[16px] font-bold text-primary">
        {title}
      </h2>
      <ul className="mt-8 grid grid-cols-5 gap-[26px]">
        {items.slice(page * PER, page * PER + PER).map((n) => (
          <li key={n.id}>
            <Link
              to="/nft/$nftId"
              params={{ nftId: n.id }}
              className="block rounded outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="bg-surface-card p-[15px]">
                <ImageBox
                  src={n.image}
                  alt={`Arte do NFT ${n.name}`}
                  className="aspect-[190/226] w-full rounded-2xl"
                />
              </div>
              <p className="mt-3 text-[15px] text-foreground">{n.name}</p>
              <p className="mt-1 text-[15px] font-bold text-primary">
                {eth(n.price)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <div className="mt-8 flex justify-center gap-3">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Página ${i + 1}`}
              aria-current={i === page}
              onClick={() => setPage(i)}
              className={`size-3 rounded-full border-2 border-primary outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${i === page ? "bg-primary" : ""}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

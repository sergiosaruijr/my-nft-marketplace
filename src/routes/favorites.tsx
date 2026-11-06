import { Link } from "@tanstack/react-router";
import BottomNav from "../components/BottomNav";
import SiteLayout from "../components/layout/SiteLayout";
import { wrap } from "../components/layout/wrap";
import ImageBox from "../components/desktop/ImageBox";
import ProfileSidebar from "../components/desktop/ProfileSideBar";
import FavoriteButton from "../features/favorites/FavoriteButton";
import { useFavorites } from "../features/favorites/hooks";
import { eth } from "../lib/format";

export default function FavoritesRoute() {
  const { data: favs, isPending, isError, refetch } = useFavorites();
  return (
    <SiteLayout footer="all">
      <main className={`${wrap} pb-32 pt-10 lg:pb-24 lg:pt-8`}>
        <div className="lg:grid lg:grid-cols-[310px_minmax(0,1fr)] lg:items-start lg:gap-[47px]">
          <div className="hidden lg:block">
            <ProfileSidebar />
          </div>

          <section aria-labelledby="fav-h">
            <h1
              id="fav-h"
              className="text-center text-[18px] font-bold text-foreground lg:text-left lg:text-[20px]"
            >
              Lista de interesse
            </h1>

            {isError && (
              <p role="alert" className="mt-6 text-sm text-text-coral">
                Não foi possível carregar seus favoritos.{" "}
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="underline"
                >
                  Tentar novamente
                </button>
              </p>
            )}

            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-[33px] lg:gap-y-[60px]">
              {isPending &&
                [0, 1, 2, 3].map((i) => (
                  <li
                    key={i}
                    aria-hidden
                    className="aspect-[259/340] bg-surface-card motion-safe:animate-pulse"
                  />
                ))}
              {favs?.map((n) => (
                <li key={n.id} className="relative">
                  <Link
                    to="/nft/$nftId"
                    params={{ nftId: n.id }}
                    className="block rounded outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className="bg-surface-card p-[7px] pt-[15px]">
                      <ImageBox
                        src={n.image}
                        alt={`Arte do NFT ${n.name}`}
                        className="aspect-square w-full rounded-2xl"
                      />
                    </div>
                    <p className="mt-3 text-[14px] text-foreground">{n.name}</p>
                    <p className="mt-1 text-[16px] font-bold text-primary">
                      {eth(n.price)}
                    </p>
                  </Link>
                  <FavoriteButton
                    nft={n}
                    size={16}
                    className="absolute right-3 top-5 grid size-8 place-items-center rounded-full bg-ink/70 text-primary"
                  />
                </li>
              ))}
            </ul>

            {favs?.length === 0 && (
              <p className="mt-10 text-center text-sm text-text-secondary">
                Você ainda não favoritou nenhum NFT.{" "}
                <Link to="/" className="text-primary underline">
                  Explorar NFTs
                </Link>
              </p>
            )}
          </section>
        </div>
      </main>
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </SiteLayout>
  );
}

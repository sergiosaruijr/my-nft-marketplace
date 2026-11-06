import { useNavigate, useSearch } from "@tanstack/react-router";
import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import Tabs from "../components/Tabs";
import NFTGrid from "../components/NFTGrid";
import BottomNav from "../components/BottomNav";
import SiteLayout from "../components/layout/SiteLayout";
import HomeDesktop from "../components/desktop/HomeDesktop";
import AuthModal from "../components/AuthModal";

function HomeMobile() {
  return (
    <div className="min-h-dvh bg-ink overflow-y-auto font-['Roboto_Mono',monospace]">
      <div className="px-6">
        <SearchBar />
        <HeroBanner />
        <Tabs />
        <NFTGrid />
      </div>
      <BottomNav />
    </div>
  );
}

export default function HomeRoute() {
  const { auth, redirect } = useSearch({ from: "/" });
  const navigate = useNavigate();

  return (
    <>
      <div className="lg:hidden">
        <HomeMobile />
      </div>

      <div className="hidden lg:block">
        <SiteLayout footer="all">
          <HomeDesktop />
        </SiteLayout>

        {auth && (
          <AuthModal
            mode={auth}
            redirect={redirect}
            onModeChange={(m) =>
              navigate({
                to: "/",
                search: (s) => ({ ...s, auth: m }),
                replace: true,
              })
            }
            onClose={() =>
              navigate({
                to: "/",
                search: (s) => ({ ...s, auth: undefined, redirect: undefined }),
              })
            }
          />
        )}
      </div>
    </>
  );
}

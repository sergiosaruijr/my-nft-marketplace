import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import Tabs from "../components/Tabs";
import NFTGrid from "../components/NFTGrid";
import BottomNav from "../components/BottomNav";
import SiteLayout from "../components/layout/SiteLayout";
import HomeDesktop from "../components/desktop/HomeDesktop";

function HomeMobile() {
  return (
    <div className="min-h-dvh bg-ink overflow-y-auto font-['Roboto_Mono',monospace]">
      <div className="mx-auto w-full max-w-[560px] px-6">
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
  return (
    <>
      <div className="lg:hidden">
        <HomeMobile />
      </div>
      <div className="hidden lg:block">
        <SiteLayout footer="all">
          <HomeDesktop />
        </SiteLayout>
      </div>
    </>
  );
}

import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import Tabs from "../components/Tabs";
import NFTGrid from "../components/NFTGrid";
import BottomNav from "../components/BottomNav";

// // mock
// const NFTS = [
//   { id: "1", name: "Emerald Ape #042", price: "1.19 ETH", image: null },
//   { id: "2", name: "Sage Nomad #009", price: "1.69 ETH", image: null },
//   {
//     id: "3",
//     name: "Dark Baron #017",
//     price: "2.50 ETH",
//     image: null,
//     rare: true,
//   },
//   { id: "4", name: "Orange Beats #031", price: "1.89 ETH", image: null },
// ];

// function SearchBar() {
//   return (
//     <div className="flex items-center gap-3 pt-10">
//       {/* busca: fundo surface-card */}
//       <div className="flex flex-1 items-center gap-3 h-[45px] rounded-2xl px-4 bg-[#241612]">
//         <Search
//           size={20}
//           strokeWidth={1.5}
//           className="shrink-0 text-secondary"
//         />
//         <span className="text-secondary text-[15px] font-medium">
//           Explorar coleções
//         </span>
//       </div>

//       <button className="flex items-center justify-center w-[45px] h-[45px] shrink-0 rounded-xl bg-gradient-to-br from-[#DD9A5F] to-[#C47B3E]">
//         <SlidersHorizontal size={20} strokeWidth={2} className="text-ink" />
//       </button>
//     </div>
//   );
// }

// function HeroBanner() {
//   return (
//     <div className="relative mt-4 overflow-hidden rounded-[28px] h-[190px] bg-[#2F1D15]">
//       {/* arrumar círculo decorativo */}
//       <div
//         className="absolute w-[240px] h-[240px] rounded-full"
//         style={{
//           background: "rgba(210,138,76,0.09)",
//           top: 40,
//           right: -20,
//         }}
//       />

//       {/* texto esquerdo */}
//       <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-center max-w-[190px]">
//         <p className="text-xs font-normal text-foreground">Bem-vindo à Kurio</p>
//         <h2 className="text-lg font-bold text-foreground leading-[24px] mt-2 uppercase">
//           SEJA DONO DA
//           <br />
//           CULTURA DIGITAL
//         </h2>
//         <p className="text-[12px] font-normal text-secondary leading-[17px] mt-2">
//           Descubra NFTs selecionados de criadores do mundo todo.
//         </p>
//         <button className="flex items-center gap-1 mt-2 text-xs font-bold text-primary uppercase">
//           EXPLORAR →
//         </button>
//       </div>

//       {/* imagem*/}
//       <div className="absolute right-4 top-3">
//         <div className="w-[110px] h-[128px] rounded-[20px] bg-[#F0E6CC]" />

//         {/* miniatura */}
//         <div
//           className="absolute w-[60px] h-[58px] rounded-[18px] bg-[#E8D9B8]"
//           style={{
//             bottom: -10,
//             left: -1,
//             border: "4px solid #2F1D15",
//           }}
//         />
//       </div>

//       <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
//         {[0, 1, 2].map((i) => (
//           <div
//             key={i}
//             className="w-1.5 h-1.5 rounded-full bg-primary"
//             style={{ opacity: i === 0 ? 1 : 0.35 }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// function Tabs() {
//   const tabs = ["Todos os NFTs", "Novos lançamentos", "Em alta"];
//   return (
//     <div className="flex items-center gap-4 mt-5 overflow-x-auto">
//       {tabs.map((tab, i) => (
//         <button
//           key={tab}
//           className={[
//             "text-sm font-medium pb-1 whitespace-nowrap shrink-0 border-b-2",
//             i === 0
//               ? "text-primary border-primary"
//               : "text-foreground border-transparent",
//           ].join(" ")}
//         >
//           {tab}
//         </button>
//       ))}
//     </div>
//   );
// }

// function NFTCard({ nft, rare }: { nft: (typeof NFTS)[0]; rare?: boolean }) {
//   return (
//     <div className="flex flex-col">
//       <div className="relative rounded-[20px] bg-surface-card pt-3 px-1 pb-1">
//         {rare && (
//           <div className="absolute top-3 left-0 z-10 h-8 px-3 flex items-center bg-primary rounded-r-[4px]">
//             <span className="text-[13px] font-bold text-ink">RARO</span>
//           </div>
//         )}

//         <div className="w-full aspect-square rounded-2xl bg-[#F0E6CC]" />

//         <button className="absolute top-4 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(20,13,10,0.70)]">
//           <Heart size={16} strokeWidth={1.5} className="text-secondary" />
//         </button>
//       </div>

//       <div className="mt-2 pl-2">
//         <p className="text-sm font-normal text-foreground">{nft.name}</p>
//         <p className="text-sm font-bold text-primary mt-1">{nft.price}</p>
//       </div>
//     </div>
//   );
// }

// function NFTGrid() {
//   const left = [NFTS[0], NFTS[2]];
//   const right = [NFTS[1], NFTS[3]];

//   return (
//     <div className="flex gap-4 mt-5 pb-32">
//       {/* esquerda */}
//       <div className="flex flex-col gap-5 flex-1">
//         {left.map((nft, i) => (
//           <NFTCard key={nft.id} nft={nft} rare={i === 1} />
//         ))}
//       </div>

//       {/* direita */}
//       <div className="flex flex-col gap-5 flex-1">
//         {right.map((nft) => (
//           <NFTCard key={nft.id} nft={nft} />
//         ))}
//       </div>
//     </div>
//   );
// }

// function BottomNav() {
//   return (
//     <div className="fixed bottom-0 left-0 right-0 flex justify-center h-24">
//       {/* esquerdo */}
//       <div className="flex items-center justify-around w-[175px] h-full bg-surface-card rounded-tl-[36px]">
//         <button aria-label="Home">
//           <Home size={22} className="text-primary" fill="#D28A4C" />
//         </button>
//         <button aria-label="Favoritos">
//           <Heart size={22} className="text-secondary" fill="#CFB28C" />
//         </button>
//       </div>

//       {/* centro */}
//       <div className="w-24 shrink-0" />

//       {/* direito */}
//       <div className="flex items-center justify-around w-[175px] h-full bg-surface-card rounded-tr-[36px]">
//         <button aria-label="Carrinho">
//           <ShoppingCart size={22} className="text-secondary" />
//         </button>
//         <button aria-label="Perfil">
//           <User size={22} className="text-secondary" fill="#CFB28C" />
//         </button>
//       </div>

//       <div
//         className="absolute left-1/2 -translate-x-1/2 -top-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#DD9A5F] to-[#C47B3E] border-[6px] border-ink flex items-center justify-center"
//         style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}
//       >
//         <Scan size={24} strokeWidth={2} className="text-ink" />
//       </div>
//     </div>
//   );
// }

export default function HomePage() {
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

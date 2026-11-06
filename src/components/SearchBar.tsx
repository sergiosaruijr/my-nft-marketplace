import { Search, SlidersHorizontal } from "lucide-react";

function SearchBar() {
  return (
    <div className="flex items-center gap-3 pt-10">
      {/* busca: fundo surface-card */}
      <div className="flex flex-1 items-center gap-3 h-[45px] rounded-2xl px-4 bg-[#241612]">
        <Search
          size={20}
          strokeWidth={1.5}
          className="shrink-0 text-secondary"
        />
        <span className="text-secondary text-[15px] font-medium">
          Explorar coleções
        </span>
      </div>

      <button className="flex items-center justify-center w-[45px] h-[45px] shrink-0 rounded-xl bg-gradient-to-br from-[#DD9A5F] to-[#C47B3E]">
        <SlidersHorizontal size={20} strokeWidth={2} className="text-ink" />
      </button>
    </div>
  );
}

export default SearchBar;

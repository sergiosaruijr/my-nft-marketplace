function Tabs() {
  const tabs = ["Todos os NFTs", "Novos lançamentos", "Em alta"];
  return (
    <div className="flex items-center gap-4 mt-5 overflow-x-auto">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          className={[
            "text-sm font-medium pb-1 whitespace-nowrap shrink-0 border-b-2",
            i === 0
              ? "text-primary border-primary"
              : "text-foreground border-transparent",
          ].join(" ")}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Tabs;

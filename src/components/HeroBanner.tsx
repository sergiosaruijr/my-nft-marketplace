function HeroBanner() {
  return (
    <div className="relative mt-4 overflow-hidden rounded-[28px] h-[190px] bg-[#2F1D15]">
      {/* arrumar círculo decorativo */}
      <div
        className="absolute w-[240px] h-[240px] rounded-full"
        style={{
          background: "rgba(210,138,76,0.09)",
          top: 40,
          right: -20,
        }}
      />

      {/* texto esquerdo */}
      <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-center max-w-[190px]">
        <p className="text-xs font-normal text-foreground">Bem-vindo à Kurio</p>
        <h2 className="text-lg font-bold text-foreground leading-[24px] mt-2 uppercase">
          SEJA DONO DA
          <br />
          CULTURA DIGITAL
        </h2>
        <p className="text-[12px] font-normal text-secondary leading-[17px] mt-2">
          Descubra NFTs selecionados de criadores do mundo todo.
        </p>
        <button className="flex items-center gap-1 mt-2 text-xs font-bold text-primary uppercase">
          EXPLORAR →
        </button>
      </div>

      {/* imagem*/}
      <div className="absolute right-4 top-3">
        <div className="w-[110px] h-[128px] rounded-[20px]  overflow-hidden">
          <img
            src="/img/EmeraldApe.svg"
            alt="NFT destaque"
            className="w-full h-full object-cover"
          />
        </div>

        {/* miniatura */}
        <div
          className="absolute w-[60px] h-[58px] rounded-[20px] bg-[#E8D9B8]"
          style={{
            bottom: -10,
            left: -1,
          }}
        >
          <img
            src="/img/VioletNomad.svg"
            alt="NFT miniatura"
            className="w-full h-full object-cover rounded-[20px]"
          />
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            style={{ opacity: i === 0 ? 1 : 0.35 }}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;

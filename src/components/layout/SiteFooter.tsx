import { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const FEATURES = [
  [
    "W",
    "Segurança da carteira",
    "Proteja sua carteira e colecione arte digital verificada com confiança.",
  ],
  [
    "C",
    "Criadores em destaque",
    "Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.",
  ],
  [
    "D",
    "Alertas de lançamentos",
    "Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.",
  ],
] as const;

const COLUMNS = [
  [
    "Meu perfil",
    [
      "Meu perfil",
      "Minha coleção",
      "Atividade",
      "Estúdio do criador",
      "Lista de interesse",
    ],
  ],
  [
    "Central de ajuda",
    [
      "Central de ajuda",
      "Como comprar NFTs",
      "Carteira e segurança",
      "Política do mercado",
      "Denunciar item",
    ],
  ],
  [
    "Coleções",
    ["Arte digital", "Fotografia", "Música", "Arte 3D", "Utilidade"],
  ],
] as const;

const SOCIAL = [
  { name: "Facebook", Icon: FaFacebook, href: "https://www.facebook.com/" },
  { name: "Instagram", Icon: FaInstagram, href: "https://www.instagram.com/" },
  { name: "X", Icon: FaXTwitter, href: "https://twitter.com/" },
  { name: "LinkedIn", Icon: FaLinkedin, href: "https://www.linkedin.com/" },
  { name: "YouTube", Icon: FaYoutube, href: "https://www.youtube.com/" },
];

const grid = "sm:grid-cols-2 lg:grid-cols-[303px_302px_303px_1fr]";

export default function SiteFooter({ className = "" }: { className?: string }) {
  const [notice, setNotice] = useState("");

  return (
    <footer className={className}>
      <div className="mx-auto w-full max-w-[1200px]">
        <section
          aria-label="Por que a Kurio"
          className={`grid bg-surface-card lg:grid-cols-[297px_266px_266px_1fr] sm:grid-cols-2`}
        >
          {FEATURES.map(([letter, title, text], i) => (
            <div
              key={title}
              className={`border-primary/60 px-6 py-6 lg:border-l lg:pb-4 lg:pl-4 lg:pt-8 ${i === 0 ? "lg:border-l-0 lg:pl-12" : ""}`}
            >
              <span
                aria-hidden
                className="grid size-[74px] place-items-center rounded-full bg-primary text-[28px] font-bold text-ink"
              >
                {letter}
              </span>
              <h2 className="mt-4 text-[18px] font-bold leading-6 text-foreground">
                {title}
              </h2>
              <p className="mt-3 text-[14px] leading-[22px] text-text-muted">
                {text}
              </p>
            </div>
          ))}
          <div className="border-primary/60 px-6 py-6 lg:border-l lg:pb-4 lg:pl-4 lg:pt-8">
            <h2 className="text-[18px] font-bold leading-4 text-foreground">
              Antecipe-se ao próximo lançamento
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNotice("Newsletter indisponível nesta demonstração.");
              }}
              className="mt-4 flex"
            >
              <label htmlFor="newsletter" className="sr-only">
                E-mail
              </label>
              <input
                id="newsletter"
                type="email"
                placeholder="digite seu e-mail..."
                className="h-10 min-w-0 flex-1 bg-surface-raised px-3 text-[14px] text-foreground outline-none placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary"
              />
              <button
                type="submit"
                className="h-10 bg-primary px-4 text-[16px] font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
              >
                Enviar
              </button>
            </form>
            <p
              role="status"
              className="mt-3 text-[13px] leading-[22px] text-text-muted"
            >
              {notice ||
                "Receba lançamentos selecionados, histórias de criadores e novidades do mercado."}
            </p>
          </div>
        </section>

        <div
          className={`grid gap-3 bg-surface-dark px-6 py-6 text-[14px] leading-[22px] text-foreground lg:px-8 lg:py-8 ${grid}`}
        >
          <p className="font-bold tracking-[0.1em]">KURIO</p>
          <p>Feito para colecionadores, criadores e cultura</p>
          <p>contato@email.com</p>
          <p>+55 11 4002 8922</p>
        </div>

        <div className={`grid gap-8 bg-surface-card px-6 py-8 lg:px-8 ${grid}`}>
          {COLUMNS.map(([title, items]) => (
            <nav key={title} aria-label={title}>
              <h2 className="text-[18px] font-bold text-foreground">{title}</h2>
              <ul className="mt-1">
                {items.map((t) => (
                  <li
                    key={t}
                    className="text-[14px] leading-[30px] text-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-foreground">
              Redes sociais
            </h2>
            <ul className="mt-3 flex gap-2 flex-wrap">
              {SOCIAL.map(({ name, Icon, href }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="grid size-8 place-items-center rounded border border-primary text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              ))}
            </ul>
            <h2 className="mt-8 text-[18px] font-bold text-foreground">
              Carteiras compatíveis
            </h2>
            <p className="mt-3 w-full rounded border border-primary/50 bg-surface-raised px-2 py-1 text-[9px] font-bold tracking-wide text-primary">
              METAMASK • WALLETCONNECT • COINBASE
            </p>
          </div>
        </div>

        <p className="py-6 text-center text-[13px] text-foreground">
          © 2026 Kurio. Propriedade digital para todos.
        </p>
      </div>
    </footer>
  );
}

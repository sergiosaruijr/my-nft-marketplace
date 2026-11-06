import { useEffect } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { cartKey, useOrder } from "../features/shop/hooks";
import { eth, fmtDate, providerLabel, shortAddr, tokenId } from "../lib/format";

const cols = "grid grid-cols-[56px_1fr_44px_auto] items-center gap-x-2";

const meta =
  "border-primary/60 even:border-l even:pl-4 sm:border-l sm:pl-4 sm:first:border-l-0 sm:first:pl-0";

function ThankYou() {
  return (
    <svg
      width="68"
      height="82"
      viewBox="0 0 68 82"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      className="mx-auto text-primary"
      aria-hidden
    >
      <path d="M6 34v40a4 4 0 0 0 4 4h48a4 4 0 0 0 4-4V34" />
      <path d="M6 34l28 22 28-22" />
      <path d="M14 36V12a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v24" />
      <text
        x="34"
        y="24"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
      >
        THANK
      </text>
      <text
        x="34"
        y="35"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
      >
        YOU
      </text>
    </svg>
  );
}

export default function OrderPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const { data: o, isPending, isError, refetch } = useOrder(orderId);
  const qc = useQueryClient();

  useEffect(() => {
    if (o?.status === "confirmed") qc.invalidateQueries({ queryKey: cartKey });
  }, [o?.status, qc]);

  if (isPending || o?.status === "pending")
    return (
      <main
        role="status"
        className="grid min-h-dvh place-items-center bg-ink text-sm text-text-secondary"
      >
        Processando seu pedido…
      </main>
    );

  if (isError || !o)
    return (
      <main className="grid min-h-dvh place-items-center bg-ink px-7 text-center text-sm text-text-coral">
        <p role="alert">
          Não foi possível carregar o pedido.{" "}
          <button type="button" onClick={() => refetch()} className="underline">
            Tentar novamente
          </button>
        </p>
      </main>
    );

  if (o.status === "rejected")
    return (
      <main className="grid min-h-dvh place-items-center bg-ink px-7 text-center">
        <div>
          <p role="alert" className="text-[16px] font-bold text-text-coral">
            Pagamento recusado
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Seus itens continuam no carrinho.
          </p>
          <Link
            to="/payment"
            className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 font-bold text-ink"
          >
            Voltar ao pagamento
          </Link>
        </div>
      </main>
    );

  return (
    <main className="mx-auto h-fit min-h-0 w-full max-w-[578px] flex-none bg-ink sm:min-h-dvh sm:py-10 lg:pt-[166px]">
      <article
        aria-labelledby="thanks"
        className="relative overflow-hidden bg-surface-card"
      >
        <Link
          to="/"
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={18} />
        </Link>

        <header className="border-b border-primary/60 px-5 pb-5 pt-6 text-center">
          <ThankYou />
          <h1
            id="thanks"
            className="mt-3 text-[14px] font-bold text-text-secondary"
          >
            Seus NFTs agora estão na sua carteira
          </h1>
        </header>

        <dl className="grid grid-cols-2 gap-y-4 border-b border-primary/60 px-5 py-4 text-[12px] leading-4 sm:grid-cols-4 sm:px-11">
          <div className={meta}>
            <dt className="font-bold text-text-secondary">ID da transação</dt>
            <dd className="text-text-muted">{shortAddr(o.txHash)}</dd>
          </div>
          <div className={meta}>
            <dt className="text-text-secondary">Data</dt>
            <dd className="text-text-muted">{fmtDate(o.createdAt)}</dd>
          </div>
          <div className={meta}>
            <dt className="text-text-secondary">Total</dt>
            <dd className="text-text-muted">{eth(o.total, 3)}</dd>
          </div>
          <div className={meta}>
            <dt className="font-bold text-text-secondary">Carteira</dt>
            <dd className="text-text-muted">{providerLabel[o.provider]}</dd>
          </div>
        </dl>

        <section className="px-5 pb-6 pt-5 sm:px-11">
          <h2 className="text-[13px] font-bold text-foreground">
            Detalhes da transação
          </h2>
          <div
            className={`${cols} mt-3 border-b border-primary/40 pb-2 text-[12px] font-bold text-foreground`}
          >
            <span className="col-span-2">NFTs</span>
            <span className="text-center">Edições</span>
            <span className="text-right">Subtotal</span>
          </div>
          <ul>
            {o.items.map((i) => (
              <li key={i.nftId} className={`${cols} py-2`}>
                <div className="size-14 overflow-hidden rounded-lg bg-[#F0E6CC]">
                  {i.image && (
                    <img
                      src={i.image}
                      alt={`Arte do NFT ${i.name}`}
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-foreground">
                    {i.name}
                  </p>
                  <p className="truncate text-[11px] text-text-muted">
                    ID do token: {tokenId(i.name)}
                  </p>
                </div>
                <span className="text-center text-[12px] text-text-secondary">
                  (x {i.qty})
                </span>
                <span className="text-right text-[14px] font-bold text-primary">
                  {eth(i.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-1 space-y-1 border-b border-primary/40 pb-2 text-[14px] text-foreground">
            <div className="flex justify-between">
              <dt>Taxa de rede</dt>
              <dd>{eth(o.networkFee, 3)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-bold">Total</dt>
              <dd className="font-bold text-primary">{eth(o.total, 3)}</dd>
            </div>
          </dl>

          <p className="mt-3 text-center text-[12px] leading-[22px] text-text-secondary">
            Transação confirmada na Ethereum. A propriedade foi transferida para
            sua carteira conectada e registrada na rede.
          </p>
          <Link
            to="/"
            className="mx-auto mt-5 block w-fit rounded bg-primary px-6 py-3 text-[14px] font-bold text-ink outline-none hover:bg-primary-light focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card"
          >
            Ver no Etherscan
          </Link>
        </section>
        <div aria-hidden className="h-2.5 bg-primary" />
      </article>
    </main>
  );
}

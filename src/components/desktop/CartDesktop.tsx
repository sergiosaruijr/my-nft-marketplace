import { useId, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import Breadcrumb from "../layout/Breadcrumb";
import NFTCarousel from "./NFTCarousel";
import ImageBox from "./ImageBox";
import { wrap } from "../layout/wrap";
import {
  useApplyCoupon,
  useCart,
  useRemoveCoupon,
  useRemoveItem,
  useSetQty,
} from "../../features/shop/hooks";
import { eth, ethNum, tokenId } from "../../lib/format";
import { parseApiError } from "../../lib/errors";

const cols =
  "grid grid-cols-[minmax(0,1fr)_110px_120px_110px_56px] items-center";
const step =
  "grid size-[22px] place-items-center rounded-full bg-primary text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary-light disabled:opacity-40";

export default function CartDesktop() {
  const navigate = useNavigate();
  const { data: cart, isPending, isError, refetch } = useCart();
  const setQty = useSetQty();
  const remove = useRemoveItem();
  const apply = useApplyCoupon();
  const clear = useRemoveCoupon();
  const [code, setCode] = useState("");
  const couponId = useId();
  const busy = setQty.isPending || remove.isPending;
  const couponError = apply.isError ? parseApiError(apply.error).message : "";
  const itemError = setQty.isError ? parseApiError(setQty.error).message : "";

  return (
    <main className={`${wrap} pb-24`}>
      <Breadcrumb
        items={[
          { label: "Início", to: "/" },
          { label: "Mercado", to: "/" },
          { label: "Carrinho" },
        ]}
      />

      <div className="mt-1 grid grid-cols-[minmax(0,1fr)_332px] items-start gap-[86px]">
        <section aria-labelledby="cart-h">
          <h1 id="cart-h" className="sr-only">
            Carrinho de NFTs
          </h1>
          <div
            className={`${cols} border-b border-primary/40 pb-3 text-[14px] text-foreground`}
          >
            <span>NFTs</span>
            <span>Preço</span>
            <span>Edições</span>
            <span>Total</span>
            <span />
          </div>

          {itemError && (
            <p role="alert" className="mt-3 text-[13px] text-text-coral">
              {itemError}
            </p>
          )}
          <ul className="mt-3 space-y-3">
            {isPending &&
              [0, 1, 2].map((i) => (
                <li
                  key={i}
                  aria-hidden
                  className="h-[70px] bg-surface-card motion-safe:animate-pulse"
                />
              ))}
            {isError && (
              <li role="alert" className="text-sm text-text-coral">
                Não foi possível carregar o carrinho.{" "}
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="underline"
                >
                  Tentar novamente
                </button>
              </li>
            )}
            {cart?.items.length === 0 && (
              <li className="py-10 text-text-secondary">
                Seu carrinho está vazio.{" "}
                <Link to="/" className="text-primary underline">
                  Explorar NFTs
                </Link>
              </li>
            )}
            {cart?.items.map(({ nft, qty, lineTotal }) => (
              <li key={nft.id} className={`${cols} h-[70px] bg-surface-card`}>
                <div className="flex min-w-0 items-center gap-4">
                  <ImageBox
                    src={nft.image}
                    alt={`Arte do NFT ${nft.name}`}
                    className="size-[70px] shrink-0 rounded-lg"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-bold text-foreground">
                      {nft.name}
                    </p>
                    <p className="text-[13px] text-text-muted">
                      ID do token: {tokenId(nft.name)}
                    </p>
                  </div>
                </div>
                <span className="text-[16px] font-bold text-text-accent">
                  {eth(nft.price)}
                </span>
                <div
                  role="group"
                  aria-label={`Quantidade de ${nft.name}`}
                  className="flex items-center gap-3"
                >
                  <button
                    type="button"
                    aria-label="Diminuir quantidade"
                    disabled={busy || qty <= 1}
                    onClick={() =>
                      setQty.mutate({ nftId: nft.id, qty: qty - 1 })
                    }
                    className={step}
                  >
                    <Minus size={13} />
                  </button>
                  <span
                    aria-live="polite"
                    className="w-4 text-center text-[15px] text-foreground"
                  >
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Aumentar quantidade"
                    disabled={busy || qty >= nft.available}
                    onClick={() =>
                      setQty.mutate({ nftId: nft.id, qty: qty + 1 })
                    }
                    className={step}
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <span className="text-[16px] font-bold text-text-accent">
                  {eth(lineTotal)}
                </span>
                <button
                  type="button"
                  aria-label={`Remover ${nft.name}`}
                  disabled={busy}
                  onClick={() => remove.mutate(nft.id)}
                  className="justify-self-center rounded text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40"
                >
                  <Trash2 size={20} strokeWidth={1.75} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <aside aria-labelledby="sum-h">
          <h2
            id="sum-h"
            className="border-b border-primary/40 pb-3 text-[18px] font-bold text-foreground"
          >
            Resumo da carteira
          </h2>
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!cart?.coupon && code.trim()) apply.mutate(code.trim());
            }}
          >
            <label
              htmlFor={couponId}
              className="text-[13px] font-bold text-foreground"
            >
              Código promocional
            </label>
            <div className="mt-2 flex h-10 border border-primary">
              <input
                id={couponId}
                value={cart?.coupon?.code ?? code}
                readOnly={!!cart?.coupon}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Digite o código promocional..."
                aria-invalid={!!couponError}
                aria-describedby={couponError ? `${couponId}-err` : undefined}
                className="min-w-0 flex-1 bg-transparent px-2 text-[12px] text-foreground outline-none placeholder:text-text-muted"
              />
              {cart?.coupon ? (
                <button
                  type="button"
                  onClick={() => {
                    clear.mutate();
                    setCode("");
                  }}
                  className="bg-primary px-4 text-[14px] font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light"
                >
                  Remover
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={apply.isPending || !code.trim()}
                  className="bg-primary px-4 text-[14px] font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light disabled:opacity-70"
                >
                  Aplicar
                </button>
              )}
            </div>
            {couponError && (
              <p
                id={`${couponId}-err`}
                role="alert"
                className="mt-2 text-[12px] text-text-coral"
              >
                {couponError}
              </p>
            )}
          </form>

          <dl className="mt-5 space-y-3 text-[14px] leading-6 text-foreground">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="text-[18px]">
                {cart ? eth(cart.subtotal, 2) : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Desconto do lançamento</dt>
              <dd>
                {cart
                  ? `(-) ${ethNum(cart.discount, 2).padStart(5, "0")}`
                  : "—"}
              </dd>
            </div>
            <div>
              <div className="flex justify-between">
                <dt>Taxa de rede</dt>
                <dd className="text-[18px]">
                  {cart ? eth(cart.networkFee, 3) : "—"}
                </dd>
              </div>
              <p className="text-right text-[11px] text-primary">
                Taxa estimada
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <dt className="font-bold">Total</dt>
              <dd className="text-[18px] font-bold text-primary">
                {cart ? eth(cart.total, 3) : "—"}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            disabled={!cart?.items.length || busy}
            onClick={() => navigate({ to: "/payment" })}
            className="mt-6 h-10 w-full bg-primary text-[15px] font-bold text-ink outline-none hover:bg-primary-light focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50"
          >
            Conectar e finalizar
          </button>
          <Link
            to="/"
            className="mt-5 block rounded text-center text-[15px] text-text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary"
          >
            Continuar explorando
          </Link>
        </aside>
      </div>

      <NFTCarousel title="Colecionadores também viram" />
    </main>
  );
}

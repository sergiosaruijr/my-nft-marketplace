import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import ScreenHeader from "../components/ScreenHeader";
import {
  useApplyCoupon,
  useCart,
  useRemoveCoupon,
  useRemoveItem,
  useSetQty,
} from "../features/shop/hooks";
import { eth, ethNum } from "../lib/format";
import { parseApiError } from "../lib/errors";
import type { CartLine } from "../../src/types";
import SiteLayout from "../components/layout/SiteLayout";
import CartDesktop from "../components/desktop/CartDesktop";

const grad = "bg-gradient-to-r from-primary-light to-primary-dark";
const couponBtn =
  "w-[97px] shrink-0 rounded-full bg-gradient-to-r from-[#7a4f33] to-primary-light text-[14px] font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:opacity-70";

function StepBtn({
  label,
  ...p
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      {...p}
      className="grid size-6 place-items-center rounded-full bg-surface-raised text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40"
    />
  );
}

function Row({
  label,
  value,
  note,
}: {
  label: string;
  value?: string;
  note?: string;
}) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className="text-right">
        {value ?? "—"}
        {note && (
          <span className="block text-[11px] leading-3 text-primary">
            {note}
          </span>
        )}
      </dd>
    </div>
  );
}

function CartMobile() {
  const navigate = useNavigate();
  const { data: cart, isPending, isError, refetch } = useCart();
  const setQty = useSetQty();
  const remove = useRemoveItem();
  const apply = useApplyCoupon();
  const clear = useRemoveCoupon();
  const [code, setCode] = useState("");
  const busy = setQty.isPending || remove.isPending;
  const couponError = apply.isError ? parseApiError(apply.error).message : "";
  const itemError = setQty.isError ? parseApiError(setQty.error).message : "";

  return (
    <div className="mx-auto flex h-dvh max-w-[414px] flex-col bg-ink pt-8">
      <ScreenHeader title="Carrinho de NFTs" />

      <ul
        aria-label="Itens do carrinho"
        className="mt-6 flex-1 space-y-5 overflow-y-auto px-7 pb-5"
      >
        {isPending &&
          [0, 1, 2].map((i) => (
            <li
              key={i}
              aria-hidden
              className="h-[100px] rounded-2xl bg-surface-card motion-safe:animate-pulse"
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
          <li className="py-10 text-center text-sm text-text-secondary">
            Seu carrinho está vazio.{" "}
            <Link to="/" className="text-primary underline">
              Explorar NFTs
            </Link>
          </li>
        )}
        {itemError && (
          <li role="alert" className="text-sm text-text-coral">
            {itemError}
          </li>
        )}

        {cart?.items.map(({ nft, qty, lineTotal }: CartLine) => (
          <li
            key={nft.id}
            className="flex h-[100px] overflow-hidden rounded-2xl bg-surface-card"
          >
            <div className="size-[100px] shrink-0 bg-[#F0E6CC]">
              {nft.image && (
                <img
                  src={nft.image}
                  alt={`Arte do NFT ${nft.name}`}
                  className="size-full object-cover"
                />
              )}
            </div>
            <div className="flex min-w-0 flex-1 justify-between py-3 pl-[9px] pr-[17px]">
              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <p className="truncate text-[14px] font-bold leading-5 text-foreground">
                    {nft.name}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-4 text-text-secondary">
                    Edição: {nft.edition}
                  </p>
                </div>
                <p className="text-[18px] font-bold leading-6 text-primary">
                  {eth(lineTotal)}
                </p>
              </div>

              {/* direita*/}
              <div className="flex flex-col items-end justify-between">
                <div
                  role="group"
                  aria-label={`Quantidade de ${nft.name}`}
                  className="flex items-center gap-2"
                >
                  <StepBtn
                    label="Diminuir quantidade"
                    disabled={busy || qty <= 1}
                    onClick={() =>
                      setQty.mutate({ nftId: nft.id, qty: qty - 1 })
                    }
                  >
                    <Minus size={14} />
                  </StepBtn>
                  <span
                    aria-live="polite"
                    className="w-4 text-center text-[14px] text-foreground"
                  >
                    {qty}
                  </span>
                  <StepBtn
                    label="Aumentar quantidade"
                    disabled={busy || qty >= nft.available}
                    onClick={() =>
                      setQty.mutate({ nftId: nft.id, qty: qty + 1 })
                    }
                  >
                    <Plus size={14} />
                  </StepBtn>
                </div>
                <button
                  type="button"
                  aria-label={`Remover ${nft.name}`}
                  disabled={busy}
                  onClick={() => remove.mutate(nft.id)}
                  className="grid size-6 place-items-center rounded text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40"
                >
                  <Trash2 size={20} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section
        aria-label="Resumo do pedido"
        className="shrink-0 rounded-t-[36px] bg-ink-soft px-6 pb-9 pt-6"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!cart?.coupon && code.trim()) apply.mutate(code.trim());
          }}
          className="flex h-[50px] overflow-hidden rounded-full border border-surface-raised bg-surface-card"
        >
          <label htmlFor="coupon" className="sr-only">
            Código promocional
          </label>
          <input
            id="coupon"
            value={cart?.coupon?.code ?? code}
            readOnly={!!cart?.coupon}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Digite o código promocional..."
            aria-invalid={!!couponError}
            aria-describedby={couponError ? "coupon-err" : undefined}
            className="min-w-0 flex-1 bg-transparent px-4 text-[12px] text-foreground outline-none placeholder:text-text-muted"
          />
          {cart?.coupon ? (
            <button
              type="button"
              onClick={() => {
                clear.mutate();
                setCode("");
              }}
              className={couponBtn}
            >
              Remover
            </button>
          ) : (
            <button
              type="submit"
              disabled={apply.isPending || !code.trim()}
              className={couponBtn}
            >
              Aplicar
            </button>
          )}
        </form>
        {couponError && (
          <p
            id="coupon-err"
            role="alert"
            className="mt-2 px-4 text-[12px] text-text-coral"
          >
            {couponError}
          </p>
        )}

        <dl className="mt-3.5 space-y-3 text-[14px] leading-5 text-foreground">
          <Row label="Subtotal" value={cart && eth(cart.subtotal, 2)} />
          <Row
            label="Desconto do lançamento"
            value={cart && `(-) ${ethNum(cart.discount, 2).padStart(5, "0")}`}
          />
          <Row
            label="Taxa de rede"
            value={cart && eth(cart.networkFee, 3)}
            note="Taxa estimada"
          />
          <div className="flex items-center justify-between">
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
          className={`mt-[30px] h-[60px] w-full rounded-[30px] ${grad} text-[16px] font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink-soft disabled:opacity-50`}
        >
          Conectar e finalizar
        </button>
      </section>
    </div>
  );
}

export default function CartRoute() {
  return (
    <SiteLayout footer="lg">
      <div className="lg:hidden">
        <CartMobile />
      </div>
      <div className="hidden lg:block">
        <CartDesktop />
      </div>
    </SiteLayout>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Breadcrumb from "../layout/Breadcrumb";
import ImageBox from "./ImageBox";
import { wrap } from "../layout/wrap";
import {
  useCart,
  useCreateOrder,
  useSaveWallet,
  useWallets,
} from "../../features/shop/hooks";
import {
  WalletFields,
  emptyWallet,
  toForm,
  walletSchema,
  type WalletFormValues,
} from "../../features/wallets/form";
import { eth, ethNum, providerLabel, tokenId } from "../../lib/format";
import { parseApiError } from "../../lib/errors";
import type { Provider, Wallet, WalletInput } from "../../types";

const PROVIDERS = Object.keys(providerLabel) as Provider[];

export default function PaymentDesktop() {
  const navigate = useNavigate();
  const wallets = useWallets();
  const cart = useCart();
  const create = useCreateOrder();
  const saveWallet = useSaveWallet();
  const [role, setRole] = useState<Wallet["role"]>("principal");
  const [note, setNote] = useState("");
  const wallet = wallets.data?.find((w) => w.role === role);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: emptyWallet,
  });

  useEffect(() => {
    reset(toForm(wallet));
  }, [role, wallet?.id, reset]);

  const provider = watch("walletType") as Provider | "";

  const key = useMemo(
    () => crypto.randomUUID(),
    [role, provider, cart.data?.total],
  );
  const busy = saveWallet.isPending || create.isPending;

  const onSubmit = handleSubmit(async (v) => {
    try {
      const saved = await saveWallet.mutateAsync({
        role,
        data: v as WalletInput,
      });
      const order = await create.mutateAsync({
        key,
        walletId: saved.id,
        provider: v.walletType,
        ...(note ? { note } : {}),
      } as any);
      navigate({ to: "/order/$orderId", params: { orderId: order.id } });
    } catch (e) {
      const { message, fields } = parseApiError(e);
      if (fields)
        Object.entries(fields).forEach(([k, m]) =>
          setError(k as keyof WalletFormValues, { message: m }),
        );
      else setError("root", { message });
    }
  });

  return (
    <main className={`${wrap} pb-24`}>
      <Breadcrumb
        items={[
          { label: "Início", to: "/" },
          { label: "Mercado", to: "/" },
          { label: "Pagamento" },
        ]}
      />

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-9 grid grid-cols-[minmax(0,1fr)_405px] items-start gap-[45px]"
      >
        {/* esquerda */}
        <section aria-labelledby="collector-h">
          <h1
            id="collector-h"
            className="mb-3 text-[18px] font-bold text-foreground"
          >
            Perfil do colecionador
          </h1>
          <WalletFields
            register={register}
            errors={errors}
            nicknameLabel="Nome de usuário"
            className="grid grid-cols-2 gap-x-6 gap-y-4"
          />

          <label className="mt-5 flex w-fit cursor-pointer items-center gap-2 text-[14px] text-foreground">
            <input
              type="checkbox"
              checked={role === "secondary"}
              onChange={(e) =>
                setRole(e.target.checked ? "secondary" : "principal")
              }
              className="size-4 appearance-none rounded-full border-2 border-primary checked:bg-primary focus-visible:ring-2 focus-visible:ring-primary-light"
            />
            Usar outra carteira?
          </label>

          <div className="mt-5">
            <label htmlFor="note" className="block text-[14px] text-foreground">
              Observação do colecionador (opcional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 h-[152px] w-full max-w-[350px] border border-border-soft bg-transparent p-3 text-[14px] text-foreground outline-none focus:border-primary"
            />
          </div>
        </section>

        {/* direita */}
        <aside aria-label="Resumo do pedido">
          <h2 className="text-[16px] font-bold text-foreground">Seus NFTs</h2>
          <div className="mt-2 flex justify-between text-[14px] font-bold text-foreground">
            <span>NFTs</span>
            <span>Subtotal</span>
          </div>
          <ul className="mt-3 space-y-3">
            {cart.data?.items.map(({ nft, qty, lineTotal }) => (
              <li
                key={nft.id}
                className="flex h-[70px] items-center gap-3 bg-surface-card pr-3"
              >
                <ImageBox
                  src={nft.image}
                  alt={`Arte do NFT ${nft.name}`}
                  className="size-[70px] shrink-0 rounded-lg"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-foreground">
                    {nft.name}
                  </p>
                  <p className="text-[12px] text-text-muted">
                    ID do token: {tokenId(nft.name)}
                  </p>
                </div>
                <span className="text-[13px] text-text-secondary">
                  (x {qty})
                </span>
                <span className="w-[92px] text-right text-[16px] font-bold text-text-accent">
                  {eth(lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-center text-[14px] text-foreground">
            Tem um código promocional?{" "}
            <Link to="/cart" className="underline">
              Aplique aqui
            </Link>
          </p>
          <dl className="mt-3 space-y-2 text-[15px] text-foreground">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{cart.data ? eth(cart.data.subtotal, 2) : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Desconto do lançamento</dt>
              <dd>
                {cart.data
                  ? `(-) ${ethNum(cart.data.discount, 2).padStart(5, "0")}`
                  : "—"}
              </dd>
            </div>
            <div>
              <div className="flex justify-between">
                <dt>Taxa de rede</dt>
                <dd>{cart.data ? eth(cart.data.networkFee, 3) : "—"}</dd>
              </div>
              <p className="text-right text-[11px] text-primary">
                Taxa estimada
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-primary/40 pt-3">
              <dt className="font-bold">Total</dt>
              <dd className="text-[18px] font-bold text-primary">
                {cart.data ? eth(cart.data.total, 3) : "—"}
              </dd>
            </div>
          </dl>

          <h2
            id="provider-h"
            className="mt-4 text-center text-[16px] font-bold text-foreground"
          >
            Carteira e rede
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="provider-h"
            className="mt-4 space-y-4"
          >
            {PROVIDERS.map((p) => (
              <label
                key={p}
                className={`flex h-[46px] cursor-pointer items-center gap-3 border px-3 text-[14px] text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${provider === p ? "border-foreground" : "border-border-soft"}`}
              >
                <input
                  type="radio"
                  name="provider"
                  value={p}
                  checked={provider === p}
                  onChange={() =>
                    setValue("walletType", p, { shouldValidate: true })
                  }
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className="grid size-4 place-items-center rounded-full border-2 border-primary"
                >
                  {provider === p && (
                    <span className="size-1.5 rounded-full bg-primary" />
                  )}
                </span>
                {providerLabel[p]}
              </label>
            ))}
          </div>
          {errors.walletType && (
            <p role="alert" className="mt-2 text-[12px] text-text-coral">
              {errors.walletType.message}
            </p>
          )}
          {errors.root && (
            <p role="alert" className="mt-3 text-[13px] text-text-coral">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !cart.data?.items.length}
            aria-busy={busy}
            className="mt-6 h-[45px] w-full bg-primary text-[15px] font-bold text-ink outline-none hover:bg-primary-light focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50"
          >
            {busy ? "Confirmando…" : "Confirmar compra"}
          </button>
        </aside>
      </form>
    </main>
  );
}

import { useMemo, useState, type JSX } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { MoreVertical, Wallet as WalletIcon } from "lucide-react";
import ScreenHeader from "../components/ScreenHeader";
import RadioCard from "../components/RadioCard";
import { useCart, useCreateOrder, useWallets } from "../features/shop/hooks";
import { eth, networkLabel, providerLabel, shortAddr } from "../lib/format";
import { parseApiError } from "../lib/errors";
import type { Provider } from "../types";
// import { createFileRoute } from "@tanstack/react-router";

const PROVIDERS: Provider[] = ["walletconnect", "metamask", "coinbase"];
const icon: Record<Provider, ReactNodeish> = {
  walletconnect: "W",
  metamask: "M",
  coinbase: <WalletIcon size={20} />,
};
type ReactNodeish = string | JSX.Element;

export default function PaymentPage() {
  const navigate = useNavigate();
  const wallets = useWallets();
  const cart = useCart();
  const create = useCreateOrder();
  const [walletId, setWalletId] = useState<string>();
  const [provider, setProvider] = useState<Provider>();

  // ordem do Figma: Reserva (secundária) primeiro, depois Principal
  const list = [...(wallets.data ?? [])].sort((a, b) =>
    a.role === b.role ? 0 : a.role === "secondary" ? -1 : 1,
  );
  const selected = list.find((w) => w.id === walletId) ?? list[0];
  const chosen = provider ?? selected?.walletType;
  const addRole = list.some((w) => w.role === "principal")
    ? "secondary"
    : "principal";

  // uma chave por tentativa: cliques repetidos e retries reaproveitam o mesmo pedido
  const key = useMemo(
    () => crypto.randomUUID(),
    [selected?.id, chosen, cart.data?.total],
  );

  const confirm = async () => {
    if (!selected || !chosen) return;
    try {
      const order = await create.mutateAsync({
        key,
        walletId: selected.id,
        provider: chosen,
      });
      navigate({ to: "/order/$orderId", params: { orderId: order.id } });
    } catch {
      /* erro exibido abaixo */
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-[414px] flex-col bg-ink pb-8 pt-8">
      <ScreenHeader title="Pagamento com carteira" />
      <form
        className="flex flex-1 flex-col px-7"
        onSubmit={(e) => {
          e.preventDefault();
          confirm();
        }}
      >
        <div className="mt-6 flex items-center justify-between">
          <h2
            id="wallets-h"
            className="text-[14px] font-bold leading-5 text-foreground"
          >
            Carteira conectada
          </h2>
          <Link
            to="/wallets"
            search={{ role: addRole }}
            className="rounded text-[14px] font-bold text-text-accent outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Adicionar carteira
          </Link>
        </div>

        <div
          role="radiogroup"
          aria-labelledby="wallets-h"
          className="mt-3.5 space-y-5"
        >
          {wallets.isPending && (
            <div
              aria-hidden
              className="h-[93px] rounded-2xl bg-surface-card motion-safe:animate-pulse"
            />
          )}
          {wallets.isError && (
            <p role="alert" className="text-sm text-text-coral">
              Não foi possível carregar suas carteiras.
            </p>
          )}
          {wallets.data && list.length === 0 && (
            <p className="rounded-2xl bg-surface-card p-5 text-[13px] text-text-secondary">
              Você ainda não cadastrou uma carteira. Toque em “Adicionar
              carteira”.
            </p>
          )}
          {list.map((w) => (
            <div key={w.id} className="relative">
              <RadioCard
                name="wallet"
                value={w.id}
                checked={selected?.id === w.id}
                onChange={() => {
                  setWalletId(w.id);
                  setProvider(undefined);
                }}
                className="h-[93px] px-[18px]"
              >
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold leading-5 text-foreground">
                    {w.nickname}
                  </span>
                  <span className="mt-1 block truncate text-[13px] leading-[22px] text-text-secondary">
                    {w.altAddress || shortAddr(w.address)}
                  </span>
                  <span className="block text-[13px] leading-[22px] text-text-secondary">
                    {w.role === "principal" ? "Rede principal" : "Rede"}{" "}
                    {networkLabel[w.network]}
                  </span>
                </span>
              </RadioCard>
              <Link
                to="/wallets"
                search={{ role: w.role }}
                aria-label={`Editar carteira ${w.nickname}`}
                className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <MoreVertical size={18} />
              </Link>
            </div>
          ))}
        </div>

        <h2
          id="provider-h"
          className="mt-[13px] text-[14px] font-bold leading-5 text-foreground"
        >
          Carteira e rede
        </h2>
        <div
          role="radiogroup"
          aria-labelledby="provider-h"
          className="mt-[15px] space-y-4"
        >
          {PROVIDERS.map((p) => (
            <RadioCard
              key={p}
              end
              name="provider"
              value={p}
              checked={chosen === p}
              onChange={() => setProvider(p)}
              className="h-16 px-[14px]"
            >
              <span
                aria-hidden
                className="grid size-10 place-items-center rounded-full bg-surface-raised text-[14px] font-bold text-primary"
              >
                {icon[p]}
              </span>
              <span className="-ml-[7px] text-[14px] text-foreground">
                {providerLabel[p]}
              </span>
            </RadioCard>
          ))}
        </div>

        <p className="mt-3.5 flex items-center justify-end gap-[30px] text-foreground">
          <span className="text-[14px] font-bold">Total:</span>
          <span className="text-[18px] font-bold text-primary">
            {cart.data ? eth(cart.data.total, 3) : "—"}
          </span>
        </p>

        <div className="mt-auto pt-6">
          {create.isError && (
            <p role="alert" className="mb-3 text-[13px] text-text-coral">
              {parseApiError(create.error).message}
            </p>
          )}
          <button
            type="submit"
            disabled={
              !selected ||
              !chosen ||
              !cart.data?.items.length ||
              create.isPending
            }
            aria-busy={create.isPending}
            className="h-[60px] w-full rounded-[30px] bg-gradient-to-r from-primary-light to-primary-dark text-[16px] font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50"
          >
            {create.isPending ? "Confirmando…" : "Confirmar compra"}
          </button>
        </div>
      </form>
    </main>
  );
}

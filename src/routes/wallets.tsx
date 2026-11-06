import { useState } from "react";
import { useRouter, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ScreenHeader from "../components/ScreenHeader";
import { useSaveWallet, useWallets } from "../features/shop/hooks";
import {
  WalletFields,
  toForm,
  walletSchema,
  type WalletFormValues,
} from "../features/wallets/form";
import { parseApiError } from "../lib/errors";
import type { Wallet, WalletInput } from "../types";

type Role = Wallet["role"];

function WalletForm({
  role,
  wallet,
  principal,
  onSaved,
}: {
  role: Role;
  wallet?: Wallet;
  principal?: Wallet;
  onSaved: () => void;
}) {
  const save = useSaveWallet();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: toForm(wallet),
  });

  const onSubmit = handleSubmit(async (v) => {
    try {
      await save.mutateAsync({ role, data: v as WalletInput });
      onSaved();
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
    <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
      {role === "secondary" && principal && (
        <label className="flex items-center gap-2 text-[13px] text-foreground">
          <input
            type="checkbox"
            className="size-4 accent-[#d28a4c]"
            onChange={(e) =>
              e.target.checked &&
              reset({ ...toForm(principal), nickname: "Reserva" })
            }
          />
          Igual à carteira principal
        </label>
      )}

      <WalletFields register={register} errors={errors} />

      {errors.root && (
        <p role="alert" className="text-[13px] text-text-coral">
          {errors.root.message}
        </p>
      )}
      <button
        type="submit"
        disabled={save.isPending}
        aria-busy={save.isPending}
        className="h-[52px] w-full rounded-xl bg-primary text-[15px] font-bold text-ink outline-none hover:bg-primary-light focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-60"
      >
        {save.isPending ? "Salvando…" : "Salvar carteira"}
      </button>
    </form>
  );
}

export default function WalletsPage() {
  const router = useRouter();
  const { role: r } = useSearch({ strict: false }) as { role?: Role };
  const [role, setRole] = useState<Role>(
    r === "secondary" ? "secondary" : "principal",
  );
  const { data: wallets, isPending, isError, refetch } = useWallets();
  const wallet = wallets?.find((w) => w.role === role);
  const principal = wallets?.find((w) => w.role === "principal");

  return (
    <main className="mx-auto min-h-dvh max-w-[414px] bg-ink pb-10 pt-8">
      <ScreenHeader title="Carteiras" />
      <div className="px-7">
        <div className="mt-6 flex gap-4 border-b border-surface-raised">
          {(["principal", "secondary"] as const).map((x) => (
            <button
              key={x}
              type="button"
              aria-pressed={role === x}
              onClick={() => setRole(x)}
              className={`-mb-px border-b-2 pb-2 text-[14px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary ${role === x ? "border-primary text-primary" : "border-transparent text-foreground"}`}
            >
              {x === "principal" ? "Principal" : "Secundária"}
            </button>
          ))}
        </div>

        <h2 className="mt-5 text-[16px] font-bold text-foreground">
          {role === "principal" ? "Carteira principal" : "Carteira secundária"}
        </h2>
        <p className="mt-1 text-[12px] leading-5 text-text-secondary">
          Estas carteiras ficam disponíveis no pagamento e para receber NFTs
          comprados.
        </p>

        {isPending && (
          <div
            aria-hidden
            className="mt-5 h-64 rounded-2xl bg-surface-card motion-safe:animate-pulse"
          />
        )}
        {isError && (
          <p role="alert" className="mt-5 text-sm text-text-coral">
            Erro ao carregar.{" "}
            <button
              type="button"
              onClick={() => refetch()}
              className="underline"
            >
              Tentar novamente
            </button>
          </p>
        )}
        {wallets && (
          <WalletForm
            key={`${role}-${wallet?.id ?? "new"}`}
            role={role}
            wallet={wallet}
            principal={principal}
            onSaved={() => router.history.back()}
          />
        )}
      </div>
    </main>
  );
}

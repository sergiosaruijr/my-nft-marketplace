import { useState } from "react";
import { useRouter, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { z } from "zod";
import ScreenHeader from "../components/ScreenHeader";
import Field, { controlCls } from "../components/Field";
import { useSaveWallet, useWallets } from "../features/shop/hooks";
import { networkLabel, providerLabel } from "../lib/format";
import { parseApiError } from "../lib/errors";
import type { Wallet, WalletInput } from "../types";

type Role = Wallet["role"];

const schema = z.object({
  displayName: z.string().trim().min(2, "Informe o nome de exibição"),
  nickname: z.string().trim().min(2, "Informe o apelido da carteira"),
  network: z.enum(["ethereum", "polygon"], { message: "Selecione uma rede" }),
  profileName: z.string().trim().min(2, "Informe o nome do perfil"),
  address: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Endereço 0x inválido (42 caracteres)"),
  altAddress: z.string().optional(),
  walletType: z.enum(["walletconnect", "metamask", "coinbase"], {
    message: "Selecione uma carteira",
  }),
  referralCode: z.string().trim().min(3, "Informe o código de indicação"),
  email: z.string().email("Informe um e-mail válido"),
  ensName: z.string().trim().min(1, "Informe o nome ENS"),
  ensSuffix: z.enum([".eth", ".kurio.eth"]),
});
type F = z.infer<typeof schema>;

const empty = {
  displayName: "",
  nickname: "",
  network: "",
  profileName: "",
  address: "",
  altAddress: "",
  walletType: "",
  referralCode: "",
  email: "",
  ensName: "",
  ensSuffix: ".eth",
} as unknown as F;
const toForm = (w?: Wallet): F => {
  if (!w) return empty;
  const { id: _i, role: _r, ...rest } = w;
  return { ...empty, ...rest };
};

function Select({
  children,
  ...p
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...p} className={`${p.className} appearance-none pr-9`}>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
      />
    </div>
  );
}

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
  } = useForm<F>({
    resolver: zodResolver(schema),
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
          setError(k as keyof F, { message: m }),
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
      <Field
        label="Nome de exibição"
        required
        error={errors.displayName?.message}
      >
        {(c) => <input {...c} {...register("displayName")} />}
      </Field>
      <Field
        label="Apelido da carteira"
        required
        error={errors.nickname?.message}
      >
        {(c) => <input {...c} {...register("nickname")} />}
      </Field>
      <Field label="Rede" required error={errors.network?.message}>
        {(c) => (
          <Select {...c} {...register("network")}>
            <option value="">Selecione uma rede</option>
            {Object.entries(networkLabel).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field
        label="Nome do perfil"
        required
        error={errors.profileName?.message}
      >
        {(c) => <input {...c} {...register("profileName")} />}
      </Field>
      <Field
        label="Endereço da carteira"
        required
        error={errors.address?.message}
      >
        {(c) => (
          <input
            {...c}
            placeholder="Endereço 0x da carteira"
            autoComplete="off"
            {...register("address")}
          />
        )}
      </Field>
      <Field
        label="ENS ou carteira secundária"
        error={errors.altAddress?.message}
      >
        {(c) => (
          <input
            {...c}
            placeholder="ENS ou carteira secundária (opcional)"
            {...register("altAddress")}
          />
        )}
      </Field>
      <Field
        label="Tipo de carteira"
        required
        error={errors.walletType?.message}
      >
        {(c) => (
          <Select {...c} {...register("walletType")}>
            <option value="">Selecione uma carteira</option>
            {Object.entries(providerLabel).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field
        label="Código de indicação"
        required
        error={errors.referralCode?.message}
      >
        {(c) => <input {...c} {...register("referralCode")} />}
      </Field>
      <Field label="E-mail" required error={errors.email?.message}>
        {(c) => (
          <input
            {...c}
            type="email"
            autoComplete="email"
            {...register("email")}
          />
        )}
      </Field>
      <Field label="Nome ENS" required error={errors.ensName?.message}>
        {(c) => (
          <div className="flex gap-2">
            <select
              aria-label="Sufixo ENS"
              className={`${controlCls()} w-[112px] shrink-0`}
              {...register("ensSuffix")}
            >
              <option value=".eth">.eth</option>
              <option value=".kurio.eth">.kurio.eth</option>
            </select>
            <input
              {...c}
              className={`${c.className} min-w-0 flex-1`}
              {...register("ensName")}
            />
          </div>
        )}
      </Field>

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

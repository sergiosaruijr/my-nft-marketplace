import { ChevronDown } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import Field, { controlCls } from "../../components/Field";
import { networkLabel, providerLabel } from "../../lib/format";
import type { Wallet } from "../../types";

export const walletSchema = z.object({
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
export type WalletFormValues = z.infer<typeof walletSchema>;

export const emptyWallet = {
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
} as unknown as WalletFormValues;

export const toForm = (w?: Wallet): WalletFormValues => {
  if (!w) return emptyWallet;
  const { id: _i, role: _r, ...rest } = w;
  return { ...emptyWallet, ...rest };
};

export function Select({
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

export function WalletFields({
  register,
  errors,
  nicknameLabel = "Apelido da carteira",
  className = "space-y-4",
}: {
  register: UseFormRegister<WalletFormValues>;
  errors: FieldErrors<WalletFormValues>;
  nicknameLabel?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Field
        label="Nome de exibição"
        required
        error={errors.displayName?.message}
      >
        {(c) => <input {...c} {...register("displayName")} />}
      </Field>
      <Field label={nicknameLabel} required error={errors.nickname?.message}>
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
    </div>
  );
}

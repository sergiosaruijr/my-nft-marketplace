import { useEffect, useRef, useState } from "react";
import type { User } from "../../types";
import { useUpdateAvatar } from "../auth/useAvatar";
import { UserIcon } from "lucide-react";

const MAX = 2 * 1024 * 1024;
const TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function AvatarField({ user }: { user: User }) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const update = useUpdateAvatar();

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!TYPES.includes(file.type)) return setError("Use PNG, JPG ou WebP.");
    if (file.size > MAX) return setError("O arquivo deve ter até 2 MB.");
    setError("");
    setPreview(URL.createObjectURL(file));
    update.mutate(file, {
      onError: () => {
        setPreview(null);
        setError("Não foi possível enviar a foto.");
      },
    });
  };

  const src = preview ?? user.avatarUrl;

  return (
    <div>
      <span>Avatar</span>
      <div className="mt-2 flex items-center gap-5">
        <div className="grid size-[50px] place-items-center overflow-hidden rounded-full bg-surface text-primary">
          {src ? (
            <img src={src} alt="" className="size-full object-cover" />
          ) : (
            <UserIcon />
          )}
        </div>

        <input
          ref={input}
          type="file"
          accept={TYPES.join(",")}
          hidden
          onChange={onPick}
        />
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={update.isPending}
          className="rounded-lg bg-primary px-5 py-2 font-bold text-ink disabled:opacity-60"
        >
          Alterar
        </button>
        {src && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              update.mutate(null);
            }}
            disabled={update.isPending}
          >
            Remover
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-[13px] text-text-coral">
          {error}
        </p>
      )}
    </div>
  );
}

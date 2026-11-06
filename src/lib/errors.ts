import { isAxiosError } from "axios";
import type { ApiError } from "../types";

export function parseApiError(e: unknown): {
  message: string;
  fields?: Record<string, string>;
} {
  if (isAxiosError<ApiError>(e)) {
    if (!e.response)
      return {
        message:
          e.code === "ECONNABORTED"
            ? "A requisição demorou demais. Tente novamente."
            : "Sem conexão com o servidor. Tente novamente.",
      };
    const d = e.response.data;
    return {
      message: d?.message ?? "Algo deu errado. Tente novamente.",
      fields: d?.fields,
    };
  }
  return { message: "Algo deu errado. Tente novamente." };
}

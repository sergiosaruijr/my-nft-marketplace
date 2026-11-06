import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

// Política (documentar no README): staleTime 30s; retry até 2x só para
// falhas de rede/5xx; 4xx nunca é repetido.
//Verificar se está de acordo com o que foi pedido
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (n, err) =>
        n < 2 &&
        !(isAxiosError(err) && err.response && err.response.status < 500),
    },
  },
});

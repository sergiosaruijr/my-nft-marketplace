# Kurio — Marketplace de NFTs

Desafio Frontend: marketplace de NFTs em React + TypeScript, com API, autenticação, carteiras e pagamentos **simulados** (MSW).

- **Aplicação publicada:** https://my-nft-marketplace-beige.vercel.app/
- **Repositório:** `<link do repositório>`
- **Commit publicado:** `<hash do commit que está na Vercel>`
- **Arquitetura, contratos e decisões:** [ARCHITECTURE.md](./ARCHITECTURE.md)

## Stack

| Responsabilidade | Tecnologia |
|---|---|
| Interface / Linguagem | React + TypeScript (Vite) |
| Roteamento | TanStack Router |
| Estado remoto | TanStack Query |
| Cliente HTTP | Axios |
| Tempo real | Socket.IO (`socket.io-client`) |
| Estilização | Tailwind CSS v4 |
| Componentes | shadcn/ui |
| Mocking | MSW (+ `@mswjs/socket.io-binding`) |
| Testes E2E e regressão visual | Playwright |
| Performance e qualidade | Lighthouse |

## Setup

Requisitos: Node 20 ou superior e npm.

```bash
git clone <link do repositório>
cd my-nft-marketplace
npm ci
npm run dev
```

Abra http://localhost:5173. Não há backend: toda a API roda no navegador via MSW.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_ENABLE_MOCKS` | ligado | Ativa o MSW (API e Socket.IO simulados). Use `false` para desligar. Sem backend real, o app só funciona com mocks ligados. |

Veja `.env.example`. Nenhuma variável é obrigatória para rodar ou publicar.

## Credenciais fictícias

| Usuário | E-mail | Senha | Estado inicial |
|---|---|---|---|
| ana | `ana@kurio.com` | `kurio1234` | carrinho com 4 itens, carteiras Principal e Reserva, 1 favorito |
| bruno | `bruno@kurio.com` | `kurio1234` | tudo vazio (sem carteiras, carrinho ou favoritos) |

O cadastro cria novos usuários (as senhas ficam como hash SHA-256 no banco simulado, nunca em texto claro).

Cupons: `KURIO5` (desconto de 0.50 ETH), `LANCAMENTO` (expirado). Qualquer outro código é inválido.

## Mocks, cenários e reset

- O banco simulado persiste no `localStorage` (`kurio.mock.db`), então refresh mantém sessão, carrinho, favoritos, carteiras e pedidos.
- **Reset:** abra `/?reset=1`. Restaura usuários, carrinhos, carteiras, favoritos, pedidos, sessão, id de visitante e cenário para o estado inicial conhecido.
- **Cenários:** acrescente `?scenario=<nome>` a qualquer URL. O cenário vale para a aba (sessionStorage) até você abrir `?scenario=default`. As latências são determinísticas (mesma sequência a cada carga).

| Cenário | O que simula |
|---|---|
| `default` | latência 150–300 ms, tudo funcionando |
| `slow` | latência 1,8–2,5 s (skeletons e estados de carregamento) |
| `variable` | latência 0,1–2,2 s (respostas fora de ordem) |
| `offline` | falha de conexão em todas as chamadas |
| `server500` | HTTP 500 em todas as chamadas (exceto `/auth`) |
| `empty` | catálogo vazio |
| `expired` | sessão expirada: toda chamada autenticada devolve 401 |
| `order-timeout` | o pedido é criado, mas a resposta nunca chega (timeout de 10 s) |
| `payment-rejected` | o pagamento é recusado (pedido termina como `rejected`) |
| `favorites-fail` | falha ao favoritar/desfavoritar (HTTP 500) |

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | desenvolvimento com mocks (Vite) |
| `npm run build` | verificação de tipos + build de produção (inclui os mocks, é o build da demonstração) |
| `npm run preview` | serve o build em http://localhost:4173 |
| `npm run typecheck` | verificação de tipos (`tsc -b`) |
| `npm run lint` | ESLint |
| `npm run test:e2e` | testes Playwright (sobe build + preview sozinho) |
| `npm run test:e2e:report` | abre o relatório HTML do Playwright |
| `npm run lighthouse` | auditoria Lighthouse (precisa de `npm run build && npm run preview` rodando) |

Na primeira vez, instale o navegador do Playwright: `npx playwright install chromium`.

## Reproduzindo os fluxos de falha

1. **Carregamento lento / skeletons:** `/?scenario=slow`.
2. **Respostas fora de ordem:** `/?scenario=variable` e altere filtros ou busca rapidamente.
3. **Sem conexão e recuperação:** `/?scenario=offline` → o carrinho mostra o erro com "Tentar novamente"; abra `/?scenario=default` e tente de novo.
4. **Erro HTTP 5xx:** `/?scenario=server500`.
5. **Sessão expirada:** entre como `ana`, abra `/cart?scenario=expired` → você volta ao login com `redirect` para retomar o contexto.
6. **Conflito de cadastro:** cadastre-se com `ana@kurio.com` (409) ou envie campos inválidos (422).
7. **Cupom:** `LANCAMENTO` (expirado) e qualquer texto (inválido) no carrinho.
8. **Limite de edição:** Violet Nomad #314 (edição 1/1) bloqueia o botão `+` ao chegar a 1 unidade.
9. **Timeout após criar o pedido:** `/?scenario=order-timeout`, finalize a compra, aguarde o erro (10 s) e clique de novo em "Confirmar compra" → a mesma chave de idempotência recupera o **mesmo** pedido, sem duplicar.
10. **Pagamento recusado:** `/?scenario=payment-rejected` e finalize a compra; os itens continuam no carrinho.
11. **Falha ao favoritar (rollback):** entre como `ana`, abra `/favorites?scenario=favorites-fail` e remova um favorito: o item some e volta, com aviso.
12. **Tempo real:** ver a seção "Eventos" do ARCHITECTURE.md.

## Deploy (Vercel)

- Framework: Vite · build `npm run build` · saída `dist`.
- `vercel.json` reescreve qualquer rota para `index.html` (acesso direto e refresh funcionam).
- Não há variáveis obrigatórias: os mocks vêm ligados por padrão.
- Em *Settings → Deployment Protection*, a proteção deve estar desligada para a produção, para a URL abrir sem login da Vercel.

## Estrutura

```
src/
  components/   UI compartilhada (layout/, desktop/)
  data/         fixtures (NFTs)
  features/     auth, shop (carrinho, carteiras, pedidos), favorites, wallets
  lib/          axios, sessão, formatação, erros, cache
  mocks/        MSW: db, cenários, handlers REST e Socket.IO
  realtime/     cliente Socket.IO e sincronização com o cache
  routes/       telas
e2e/            testes Playwright (e baselines visuais versionadas)
scripts/        auditoria Lighthouse
lighthouse/     relatórios HTML/JSON e summary.json
```

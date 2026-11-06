import { useEffect } from "react";
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import HomeRoute from "./routes/home";
import NFTRoute from "./routes/nft.$nftId";
import LoginPage from "./routes/login";
import SignupPage from "./routes/signup";
import CartPage from "./routes/cart";
import PaymentPage from "./routes/payment";
import WalletsPage from "./routes/wallets";
import OrderPage from "./routes/order.$orderId";
import { getSession } from "./features/auth/session";
import { queryClient } from "./lib/queryClient";
import { clearToken, SESSION_EXPIRED } from "./lib/session";

function SessionWatcher() {
  const router = useRouter();
  useEffect(() => {
    const onExpired = () => {
      clearToken();
      queryClient.clear();
      router.navigate({
        to: "/login",
        search: { redirect: router.state.location.href },
      });
    };
    window.addEventListener(SESSION_EXPIRED, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED, onExpired);
  }, [router]);
  return null;
}

// ── Root ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <div className="min-h-screen">
      <SessionWatcher />
      <Outlet />
    </div>
  ),
});

// ── Guards ─────────────────────────────────────────────────────────────────

const requireAuth = async ({
  context,
  location,
}: {
  context: { queryClient: QueryClient };
  location: { href: string };
}) => {
  if (!(await getSession(context.queryClient)))
    throw redirect({ to: "/login", search: { redirect: location.href } });
};

const requireGuest = async ({
  context,
}: {
  context: { queryClient: QueryClient };
}) => {
  if (await getSession(context.queryClient)) throw redirect({ to: "/" });
};

const validateSearch = (s: Record<string, unknown>) => ({
  redirect: typeof s.redirect === "string" ? s.redirect : undefined,
});

// ── Rotas ──────────────────────────────────────────────────────────────────

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: requireAuth,
  component: HomeRoute,
});

const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$nftId",
  beforeLoad: requireAuth,
  component: NFTRoute,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  validateSearch,
  beforeLoad: requireGuest,
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  validateSearch,
  beforeLoad: requireGuest,
  component: SignupPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  beforeLoad: requireAuth,
  component: CartPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment",
  beforeLoad: requireAuth,
  component: PaymentPage,
});

const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallets",
  beforeLoad: requireAuth,
  component: WalletsPage,
  validateSearch: (s: Record<string, unknown>) => ({
    role:
      s.role === "secondary"
        ? ("secondary" as const)
        : s.role === "principal"
          ? ("principal" as const)
          : undefined,
  }),
});

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order/$orderId",
  beforeLoad: requireAuth,
  component: OrderPage,
});

// ── Árvore — UMA só declaração ─────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftRoute,
  loginRoute,
  signupRoute,
  cartRoute, // ✅
  paymentRoute, // ✅
  walletsRoute, // ✅
  orderRoute, // ✅
]);

// ── Router — criado DEPOIS da árvore completa ──────────────────────────────

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
});

// ── Register — tipos automáticos ───────────────────────────────────────────

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// import { useEffect } from "react";
// import {
//   createRootRouteWithContext,
//   createRoute,
//   createRouter,
//   Outlet,
//   redirect,
//   useRouter,
// } from "@tanstack/react-router";
// import type { QueryClient } from "@tanstack/react-query";
// import HomeRoute from "./routes/home";
// import NFTRoute from "./routes/nft.$nftId";
// import LoginPage from "./routes/login";
// import SignupPage from "./routes/signup";
// import { getSession } from "./features/auth/session";
// import { queryClient } from "./lib/queryClient";
// import { clearToken, SESSION_EXPIRED } from "./lib/session";
// import CartPage from "./routes/cart";
// import PaymentPage from "./routes/payment";
// import WalletsPage from "./routes/wallets";
// import OrderPage from "./routes/order.$orderId";

// function SessionWatcher() {
//   const router = useRouter();
//   useEffect(() => {
//     const onExpired = () => {
//       clearToken();
//       queryClient.clear();
//       router.navigate({
//         to: "/login",
//         search: { redirect: router.state.location.href },
//       });
//     };
//     window.addEventListener(SESSION_EXPIRED, onExpired);
//     return () => window.removeEventListener(SESSION_EXPIRED, onExpired);
//   }, [router]);
//   return null;
// }

// const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
//   component: () => (
//     <div className="min-h-screen">
//       <SessionWatcher />
//       <Outlet />
//     </div>
//   ),
// });

// // Por ora tudo que não é login/cadastro exige sessão (login como tela inicial).
// // Para liberar catálogo a visitantes depois, remova requireAuth de "/" e "/nft/$nftId".
// const requireAuth = async ({
//   context,
//   location,
// }: {
//   context: { queryClient: QueryClient };
//   location: { href: string };
// }) => {
//   if (!(await getSession(context.queryClient)))
//     throw redirect({ to: "/login", search: { redirect: location.href } });
// };
// const requireGuest = async ({
//   context,
// }: {
//   context: { queryClient: QueryClient };
// }) => {
//   if (await getSession(context.queryClient)) throw redirect({ to: "/" });
// };
// const validateSearch = (s: Record<string, unknown>) => ({
//   redirect: typeof s.redirect === "string" ? s.redirect : undefined,
// });

// const indexRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/",
//   beforeLoad: requireAuth,
//   component: HomeRoute,
// });
// const nftRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/nft/$nftId",
//   beforeLoad: requireAuth,
//   component: NFTRoute,
// });
// const loginRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/login",
//   validateSearch,
//   beforeLoad: requireGuest,
//   component: LoginPage,
// });
// const signupRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/signup",
//   validateSearch,
//   beforeLoad: requireGuest,
//   component: SignupPage,
// });

// const routeTree = rootRoute.addChildren([
//   indexRoute,
//   nftRoute,
//   loginRoute,
//   signupRoute,
// ]);

// export const router = createRouter({
//   routeTree,
//   context: { queryClient },
//   defaultPreload: "intent",
// });

// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }

// const cartRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/cart",
//   beforeLoad: requireAuth,
//   component: CartPage,
// });
// const paymentRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/payment",
//   beforeLoad: requireAuth,
//   component: PaymentPage,
// });
// const walletsRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/wallets",
//   beforeLoad: requireAuth,
//   component: WalletsPage,
//   validateSearch: (s: Record<string, unknown>) => ({
//     role:
//       s.role === "secondary"
//         ? ("secondary" as const)
//         : s.role === "principal"
//           ? ("principal" as const)
//           : undefined,
//   }),
// });
// const orderRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/order/$orderId",
//   beforeLoad: requireAuth,
//   component: OrderPage,
// });

// const routeTree = rootRoute.addChildren([
//   indexRoute,
//   nftRoute,
//   loginRoute,
//   signupRoute,
//   cartRoute,
//   paymentRoute,
//   walletsRoute,
//   orderRoute,
// ]);

// // import {
// //   createRouter,
// //   createRootRoute,
// //   createRoute,
// //   Outlet,
// // } from "@tanstack/react-router";
// // import HomeRoute from "./routes/home";
// // import NFTRoute from "./routes/nft.$nftId";
// // // import { NFTS } from "./data/nfts";

// // const rootRoute = createRootRoute({
// //   component: () => (
// //     <div className="min-h-screen">
// //       <Outlet />
// //     </div>
// //   ),
// // });

// // const indexRoute = createRoute({
// //   getParentRoute: () => rootRoute,
// //   path: "/",
// //   component: HomeRoute,
// // });

// // const nftRoute = createRoute({
// //   getParentRoute: () => rootRoute,
// //   path: "/nft/$nftId",
// //   // loader será adicionada abaixo (ex: chama queryClient.fetchQuery)
// //   async loader({ params }) {
// //     // exemplo simples (ver nota TanStack Query abaixo)
// //     const res = await fetch(`/api/nfts/${params.nftId}`);
// //     const data = await res.json();
// //     return { nft: data };
// //   },
// //   component: NFTRoute,
// // });

// // const routeTree = rootRoute.addChildren([indexRoute, nftRoute]);

// // export const router = createRouter({ routeTree, defaultPreload: "intent" });

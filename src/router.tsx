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
import { isDesktop } from "./lib/viewport";
import ProfilePage from "./routes/profile";
import { validateAuthSearch, validateHomeSearch } from "./lib/search";
import AuthModalHost from "./components/AuthModalHost";

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

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  validateSearch: validateAuthSearch,
  component: () => (
    <div className="min-h-screen">
      <SessionWatcher />
      <Outlet />
      <AuthModalHost />
    </div>
  ),
});

type Ctx = {
  context: { queryClient: QueryClient };
  location: { href: string };
};

const requireAuth = async ({ context, location }: Ctx) => {
  if (!(await getSession(context.queryClient)))
    throw redirect({ to: "/login", search: { redirect: location.href } });
};

const requireAuthOnMobile = (ctx: Ctx) =>
  isDesktop() ? undefined : requireAuth(ctx);

const requireGuest = async ({
  context,
}: {
  context: { queryClient: QueryClient };
}) => {
  if (await getSession(context.queryClient)) throw redirect({ to: "/" });
};

const validateSearch = (s: Record<string, unknown>): { redirect?: string } => ({
  redirect: typeof s.redirect === "string" ? s.redirect : undefined,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: validateHomeSearch,
  beforeLoad: async (ctx): Promise<void> => {
    const { auth, redirect: back } = ctx.search;

    if (!isDesktop()) {
      // mobile: /?auth=... vira a página cheia de login/cadastro (verificar isso)
      if (auth === "signup")
        throw redirect({ to: "/signup", search: { redirect: back } });
      if (auth) throw redirect({ to: "/login", search: { redirect: back } });
      return requireAuth(ctx);
    }

    // desktop: carrega a sessão (o header precisa dela) e fecha o modal se já logado (verificar isso)
    const session = await getSession(ctx.context.queryClient);
    if (auth && session) throw redirect({ to: "/" });
  },
  component: HomeRoute,
});

const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$nftId",
  beforeLoad: requireAuthOnMobile,
  component: NFTRoute,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  validateSearch,
  beforeLoad: async (ctx) => {
    await requireGuest(ctx);
    if (isDesktop())
      throw redirect({
        to: "/",
        search: { auth: "login", redirect: ctx.search.redirect },
      });
  },
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  validateSearch,
  beforeLoad: async (ctx) => {
    await requireGuest(ctx);
    if (isDesktop())
      throw redirect({
        to: "/",
        search: { auth: "signup", redirect: ctx.search.redirect },
      });
  },
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

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  beforeLoad: requireAuth,
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftRoute,
  loginRoute,
  signupRoute,
  cartRoute,
  paymentRoute,
  walletsRoute,
  orderRoute,
  profileRoute,
]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

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
import FavoritesRoute from "./routes/favorites";
import Announcer from "./components/Announcer";

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
  beforeLoad: ({ context }) =>
    getSession(context.queryClient).then(() => undefined),
  component: () => (
    <div className="min-h-screen">
      <SessionWatcher />
      <Outlet />
      <AuthModalHost />
      <Announcer />
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
    if (!auth) return;

    if (!isDesktop()) {
      if (auth === "signup")
        throw redirect({ to: "/signup", search: { redirect: back } });
      throw redirect({ to: "/login", search: { redirect: back } });
    }

    if (await getSession(ctx.context.queryClient)) throw redirect({ to: "/" });
  },
  component: HomeRoute,
});

const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$nftId",
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

// const favoritesRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/favorites",
//   beforeLoad: requireAuth,
//   component: FavoritesRoute,
// });

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

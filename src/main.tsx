import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/700.css";
import "./index.css";

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
    try {
      const { worker } = await import("./mocks/browser");
      await worker.start({ onUnhandledRequest: "warn" });
      if (new URLSearchParams(location.search).has("reset")) {
        const { resetDb } = await import("./mocks/db");
        await resetDb();
        ["kurio.token", "kurio.guest"].forEach((k) =>
          localStorage.removeItem(k),
        );
        sessionStorage.removeItem("kurio.scenario");
        history.replaceState(null, "", location.pathname);
      }
      if (import.meta.env.DEV) {
        document.addEventListener("visibilitychange", async () => {
          if (document.visibilityState !== "visible") return;
          if (!navigator.serviceWorker.controller) location.reload();
        });
      }
      console.log("[msw] worker started");
    } catch (err) {
      console.error("[msw] failed to start worker", err);
    }
  }

  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();

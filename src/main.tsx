import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
    try {
      const { worker } = await import("./mocks/browser");
      await worker.start({ onUnhandledRequest: "warn" });
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

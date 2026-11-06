// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./index.css";

// async function bootstrap() {
//   if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
//     try {
//       const { worker } = await import("./mocks/browser");
//       await worker.start({ onUnhandledRequest: "warn" });
//       if (import.meta.env.DEV) {
//         document.addEventListener("visibilitychange", async () => {
//           if (document.visibilityState !== "visible") return;
//           if (!navigator.serviceWorker.controller) location.reload();
//         });
//       }
//       console.log("[msw] worker started");
//     } catch (err) {
//       console.error("[msw] failed to start worker", err);
//     }
//   }

//   createRoot(document.getElementById("root")!).render(<App />);
// }

// bootstrap();

// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

async function bootstrap() {
  // só tenta iniciar o worker se a flag estiver ativa
  if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
    try {
      // carregamento dinâmico evita bundlar o worker no SSR/build
      const { worker } = await import("./mocks/browser");

      // Forçar explicitamente a URL do service worker (garante que /mockServiceWorker.js seja usada)
      await worker.start({
        serviceWorker: {
          // O arquivo gerado pelo `msw init public/` deve ficar em /mockServiceWorker.js
          url: "/mockServiceWorker.js",
        },
        onUnhandledRequest: "warn", // mantém o comportamento que você já tinha
        quiet: true, // evita muitos logs em prod
      });

      // sinal simples para debugging (opcional)
      // eslint-disable-next-line no-console
      console.info("[msw] worker started (client)");
      // marca global para checagem rápida
      (window as any).__MSW__ = true;

      if (import.meta.env.DEV) {
        document.addEventListener("visibilitychange", async () => {
          if (document.visibilityState !== "visible") return;
          if (!navigator.serviceWorker.controller) location.reload();
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[msw] failed to start worker", err);
    }
  }

  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const MOCKS_ON = import.meta.env.VITE_ENABLE_MOCKS !== "false";

async function startMocks() {
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });

  if (new URLSearchParams(location.search).has("reset")) {
    const { resetDb } = await import("./mocks/db");
    await resetDb();
    ["kurio.token", "kurio.guest"].forEach((k) => localStorage.removeItem(k));
    sessionStorage.removeItem("kurio.scenario");
    history.replaceState(null, "", location.pathname);
  }
  console.info("[kurio] mocks ativos");
}

async function bootstrap() {
  if (MOCKS_ON) {
    try {
      await startMocks();
    } catch (e) {
      console.error(
        "[kurio] os mocks não iniciaram, a API simulada não vai responder:",
        e,
      );
    }
  }
  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();

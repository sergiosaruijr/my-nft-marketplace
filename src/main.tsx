// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// import React from "react";
// import { createRoot } from "react-dom/client";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { RouterProvider } from "@tanstack/react-router";
// import { router } from "./router";
// import "./index.css";

// const queryClient = new QueryClient();

// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <RouterProvider router={router} />
//     </QueryClientProvider>
//   </React.StrictMode>,
// );

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS === "true") {
    try {
      const { worker } = await import("./mocks/browser");
      // use 'warn' | 'bypass' | 'error' ou um callback personalizado
      await worker.start({ onUnhandledFrame: "warn" });
      console.log("[msw] worker started");
    } catch (err) {
      console.error("[msw] failed to start worker", err);
    }
  }

  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();

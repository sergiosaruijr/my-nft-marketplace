// function App() {
//   return (
//     <div className="min-h-screen bg-ink flex items-center justify-center">
//       <div className="text-center">
//         <h1 className="text-primary font-bold text-2xl font-mono">APP</h1>
//         <p className="text-text-secondary text-sm mt-2 font-mono">
//           Marketplace de NFTs
//         </p>
//         <div className="mt-4 w-32 h-32 rounded-card bg-surface-card mx-auto" />
//       </div>
//     </div>
//   );
// }

// export default App;

import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient } from "./lib/queryClient";
import { router } from "./router";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

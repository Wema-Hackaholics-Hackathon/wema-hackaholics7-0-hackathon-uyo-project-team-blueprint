import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/routeTree";
import { AppProvider } from "@/store/app-context";
import { ToastProvider } from "@/components/ui/toast";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
);

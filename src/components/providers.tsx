"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/contexts/auth-context";
import { LoaderProvider } from "@/contexts/loader-context";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Something went wrong:</h2>
        <pre className="mt-2 text-red-600">{error.message}</pre>
      </div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <LoaderProvider>
          <AuthProvider>
            <SidebarProvider>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </SidebarProvider>
          </AuthProvider>
        </LoaderProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/contexts/auth-context";
import { useState, useEffect, useMemo } from "react";
import { configureAmplify } from "@/lib/amplify";

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
      }),
  );

  useEffect(() => {
    configureAmplify();
  }, []);

  const value = useMemo(
    () => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    ),
    [queryClient, children],
  );

  return value;
}

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Client-side providers wrapper.
 * Wraps the app with all context providers:
 * - React Query (server state)
 * - Toast notifications
 * Future: ThemeProvider, AuthProvider
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Premium toast notifications */}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0A0A0A',
            color: '#FAFAFA',
            fontFamily: 'var(--font-inter)',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 16px 32px -8px rgba(10, 10, 10, 0.25)',
          },
          success: {
            iconTheme: {
              primary: '#C9A84C',
              secondary: '#0A0A0A',
            },
          },
          error: {
            duration: 6000,
          },
        }}
      />

      {/* React Query Devtools (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

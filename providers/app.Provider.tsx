"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider, createTheme } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { useState, ReactNode } from "react";
import { AuthProvider } from "./authProvider";

// Your MUI theme (same as your old App.tsx)
const theme = createTheme({
  palette: {
    primary: {
      main: "#00246B",
    },
    background: {
      default: "#f9bfda",
    },
  },
  typography: {
    fontFamily: "Playfair Display, serif",
  },
});

// Enhanced error boundary fallback component with better UX
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-4 font-serif bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
          Oops! Something went wrong
        </h2>

        <p className="text-lg text-gray-600 mb-6 font-serif">
          Don&apos;t worry, this happens sometimes. You can try refreshing the
          page or go back to the home page.
        </p>

        {/* Show error details only in development */}
        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-red-600 bg-red-50 p-3 rounded border overflow-auto max-h-32">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-3 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors cursor-pointer font-serif font-semibold"
          >
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer font-serif font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    </section>
  );
}

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  // Create QueryClient instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
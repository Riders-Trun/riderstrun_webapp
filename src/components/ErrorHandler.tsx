import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(new Error(event.reason));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const clearError = () => setError(null);

  return { error, clearError };
};

export const ErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => {
  const handleRefresh = () => {
    resetError();
    window.location.reload();
  };

  const handleGoHome = () => {
    resetError();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>
        <div className="space-y-3">
          <Button 
            onClick={handleRefresh}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
          <Button 
            variant="outline"
            onClick={handleGoHome}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
        {import.meta.env.DEV && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">Error Details</summary>
            <pre className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};
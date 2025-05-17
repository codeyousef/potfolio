"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Settings page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Error loading settings</AlertTitle>
        <AlertDescription className="mt-2">
          <p>An error occurred while loading the settings page.</p>
          <p className="mt-2 text-sm opacity-80">
            {error.message || 'Unknown error occurred'}
          </p>
        </AlertDescription>
      </Alert>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="flex-1 sm:flex-none"
        >
          Reload Page
        </Button>
        <Button
          onClick={reset}
          className="flex-1 sm:flex-none"
        >
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="flex-1 sm:flex-none"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}

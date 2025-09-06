"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Something went wrong!
          </h1>
        </div>

        {/* Error Details */}
        <div className="mb-8">
          <p className="text-gray-600 leading-relaxed mb-4">
            We encountered an unexpected error. This might be due to a temporary
            issue or a bug in our system.
          </p>

          {/* Error Message (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-gray-100 p-4 rounded-lg text-left">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Error Details:
              </p>
              <p className="text-xs text-gray-600 font-mono break-words">
                {error.message || "Unknown error occurred"}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-200 transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <Bug className="w-5 h-5" />
            Reload Page
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>If this problem persists, please contact support</p>
          <Link
            href="/contact"
            className="text-red-600 hover:text-red-700 underline"
          >
            Contact Support
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}

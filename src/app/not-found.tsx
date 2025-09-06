"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Search, RefreshCw } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
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
            <RefreshCw className="w-5 h-5" />
            Refresh Page
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact our support team</p>
          <Link
            href="/contact"
            className="text-primary hover:text-secondary underline"
          >
            Get Support
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}

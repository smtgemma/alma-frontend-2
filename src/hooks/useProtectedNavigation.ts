"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { navigateToProtectedRoute, syncAuthToken } from "@/utils/authUtils";

/**
 * Hook that provides safe navigation to protected routes
 * Automatically handles token synchronization and authentication state
 */
export const useProtectedNavigation = () => {
  const router = useRouter();

  const navigateToProtected = useCallback(
    (path: string, fallbackPath = "/signIn") => {
      navigateToProtectedRoute(router, path, fallbackPath);
    },
    [router]
  );

  const ensureAuth = useCallback(() => {
    return syncAuthToken();
  }, []);

  return {
    navigateToProtected,
    ensureAuth,
  };
};
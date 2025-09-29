import Cookies from "js-cookie";
import { getAccessToken, setAccessToken } from "./cookieManager";

/**
 * Ensures that the authentication token is properly synchronized between localStorage and cookies
 * This is crucial for middleware to recognize authenticated state during navigation
 */
export const syncAuthToken = (): boolean => {
  try {
    // Get token from storage
    const storageToken = getAccessToken();
    
    if (!storageToken) {
      return false;
    }

    // Check if cookie already has the token
    const cookieToken = Cookies.get("token");
    
    if (!cookieToken) {
      // Set token in cookie with persistent options
      setAccessToken(storageToken);
      console.log("🔄 Token synchronized to cookie for middleware");
    }
    
    return true;
  } catch (error) {
    console.error("Error syncing auth token:", error);
    return false;
  }
};

/**
 * Safely navigates to a protected route by ensuring authentication state is properly set
 */
export const navigateToProtectedRoute = (
  router: any,
  path: string,
  fallbackPath = "/signIn"
): void => {
  try {
    // First ensure token is synced
    const isTokenSynced = syncAuthToken();
    
    if (!isTokenSynced) {
      console.warn("No authentication token found, redirecting to sign in");
      router.push(fallbackPath);
      return;
    }
    
    // Small delay to ensure cookie is set before navigation
    setTimeout(() => {
      router.push(path);
    }, 10);
  } catch (error) {
    console.error("Error navigating to protected route:", error);
    router.push(fallbackPath);
  }
};

/**
 * Validates if user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  try {
    const token = getAccessToken();
    const cookieToken = Cookies.get("token");
    
    return !!(token || cookieToken);
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};
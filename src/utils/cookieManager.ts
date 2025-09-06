import Cookies from "js-cookie";

// Cookie configuration for persistent storage
const COOKIE_OPTIONS = {
  expires: 30, // 30 days
  secure: false,
  // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: "lax" as const, // Prevent CSRF attacks while allowing normal navigation
  path: "/", // Available across the entire domain
};

// Cookie configuration for refresh tokens (longer expiration)
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  expires: 90, // 90 days (longer than access token)
  // secure: process.env.NODE_ENV === 'production',
  secure: false,
  sameSite: "lax" as const,
  path: "/",
  httpOnly: false, // Note: In a production environment, you might want to set this to true for security
};

/**
 * Set access token in both localStorage and cookies with persistence
 */
export const setAccessToken = (token: string): void => {
  try {
    // Store in localStorage
    localStorage.setItem("token", token);

    // Store in cookies with persistence settings
    Cookies.set("token", token, COOKIE_OPTIONS);
  } catch (error) {
    console.error("Error setting access token:", error);
  }
};

/**
 * Set refresh token in localStorage and optionally in cookies
 */
export const setRefreshToken = (refreshToken: string): void => {
  try {
    // Store in localStorage
    localStorage.setItem("refreshToken", refreshToken);

    // Optionally store in cookies (be cautious with refresh tokens in cookies)
    // For now, we'll keep it in localStorage only for security
    // Cookies.set('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
  } catch (error) {
    console.error("Error setting refresh token:", error);
  }
};

/**
 * Set user data in localStorage
 */
export const setUserData = (userData: any): void => {
  try {
    localStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Error setting user data:", error);
  }
};

/**
 * Get access token from localStorage or cookies
 */
export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem("token") || Cookies.get("token") || null;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem("refreshToken") || null;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

/**
 * Get user data from localStorage
 */
export const getUserData = (): any => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

/**
 * Clear all auth-related data
 */
export const clearAuthData = (): void => {
  try {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Clear cookies
    Cookies.remove("token", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

/**
 * Update tokens (both access and refresh)
 */
export const updateTokens = (
  accessToken: string,
  refreshToken?: string
): void => {
  setAccessToken(accessToken);

  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
};

/**
 * Check if we have valid auth data
 */
export const hasAuthData = (): boolean => {
  const token = getAccessToken();
  return !!token;
};

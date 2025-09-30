"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { initializeAuth, logout } from "@/redux/features/user/userSlice";
import { RootState } from "@/redux/store";
import {
  getAccessToken,
  getRefreshToken,
  getUserData,
  clearAuthData,
  setAccessToken,
} from "@/utils/cookieManager";
import { syncAuthToken } from "@/utils/authUtils";
import Cookies from "js-cookie";

interface DecodedToken {
  id: string;
  role: string;
  exp: number;
}

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isInitialized, token } = useSelector(
    (state: RootState) => state.user
  );



  useEffect(() => {

    // Only run initialization once
    if (isInitialized) {
      return;
    }


    const initializeAuthentication = async () => {
      try {
        // Check for tokens using our cookie manager utility
        const storedToken = getAccessToken();
        const storedRefreshToken = getRefreshToken();

        // FIX: Get user data directly from localStorage
        let storedUser = null;
        try {
          const userDataFromStorage = localStorage.getItem("user");
          if (userDataFromStorage) {
            storedUser = JSON.parse(userDataFromStorage);
          }
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
        }

        console.log("🔍 AuthInitializer Debug:");
        console.log("storedToken:", storedToken);
        console.log("storedRefreshToken:", storedRefreshToken);
        console.log("storedUser:", storedUser);
        console.log("storedUser?.accessToken:", storedUser?.accessToken);

        if (storedToken || storedUser?.accessToken) {
          // Use accessToken from user object if available, otherwise use storedToken
          const tokenToUse = storedUser?.accessToken || storedToken;

          console.log("🔧 Token to use:", tokenToUse);

          // Verify token is not expired
          try {
            const decoded: DecodedToken = jwtDecode(tokenToUse);

            // Check if token is expired
            if (decoded.exp * 1000 < Date.now()) {
              // Token is expired, but we might have a refresh token
              if (storedRefreshToken) {
                console.log(
                  "Access token expired, but refresh token available"
                );
                // The token refresh will be handled by the API interceptor
                // For now, just initialize with the expired token - the interceptor will refresh it
              } else {
                // No refresh token, clean up completely
                clearAuthData();
                dispatch(logout());
                return;
              }
            }

            // Token is valid or we have refresh token, initialize auth state
            const userData = storedUser;

            // Ensure cookies have the token with persistence (for middleware)
            // Check cookie directly; getAccessToken() may return from localStorage and prevent cookie creation
            if (!Cookies.get("token")) {
              setAccessToken(tokenToUse);
            }

            console.log("🔧 Final token being used:", tokenToUse);
            console.log("🔧 User data being set:", userData);
            console.log("🔧 Dispatching initializeAuth...");

            dispatch(
              initializeAuth({
                token: tokenToUse, // Use accessToken from user object
                refreshToken: storedRefreshToken,
                user: userData,
              })
            );

            console.log("✅ initializeAuth dispatched successfully!");
            
            // Ensure token is synced for immediate middleware access
            syncAuthToken();
          } catch (error) {
            // Invalid token, clean up
            console.error("Invalid token during initialization:", error);
            clearAuthData();
            dispatch(logout());
          }
        } else {
          // No token found, mark as initialized
          console.log("❌ No stored token or user accessToken found");
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        dispatch(logout());
      }
    };

    initializeAuthentication();
  }, [dispatch, isInitialized]);

  // Force initialization if we have user data but no token
  useEffect(() => {
    if (isInitialized && !token) {
      console.log("🔄 Force initialization check - user has data but no token");

      const userDataFromStorage = localStorage.getItem("user");
      if (userDataFromStorage) {
        try {
          const parsedUser = JSON.parse(userDataFromStorage);
          if (parsedUser?.accessToken) {
            console.log("🔧 Force setting token from user data");
            dispatch(
              initializeAuth({
                token: parsedUser.accessToken,
                refreshToken: localStorage.getItem("refreshToken"),
                user: parsedUser,
              })
            );
            // Sync token after force initialization
            syncAuthToken();
          }
        } catch (error) {
          console.error("Error in force initialization:", error);
        }
      }
    }
  }, [isInitialized, token, dispatch]);
  //http://10.0.30.45:2002 http://172.252.13.71:1002/api/v1
  // Don't render children until auth is initialized
  if (!isInitialized) {
    console.log("⏳ Auth not initialized, showing loading...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  console.log("✅ Auth initialized, rendering children");
  return <>{children}</>;
};

export default AuthInitializer;

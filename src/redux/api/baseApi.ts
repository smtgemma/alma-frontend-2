// src/redux/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";
import { refreshAccessToken, isTokenExpired } from "@/utils/tokenRefresh";

// Create base query with token refresh logic
const baseQuery = fetchBaseQuery({
  // http://206.162.244.131:1002 //
  baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
  credentials: "omit",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token") || Cookies?.get("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Check if token needs refresh before making the request
  const token = localStorage.getItem("token") || Cookies?.get("token");
  if (token && isTokenExpired(token)) {
    console.log("Token is expired or expiring soon, refreshing...");
    const newToken = await refreshAccessToken();
    if (!newToken) {
      // Refresh failed, the refreshAccessToken function will handle logout
      return {
        error: {
          status: 401,
          data: { message: "Authentication failed" },
        } as FetchBaseQueryError,
      };
    }
  }

  // Make the original request
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    console.log("Got 401 error, attempting token refresh...");

    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry the original request with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, the refreshAccessToken function will handle logout
      return {
        error: {
          status: 401,
          data: { message: "Authentication failed" },
        } as FetchBaseQueryError,
      };
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["User", "Plans", "BusinessPlan", "Admin", "Team", "ExpertReview"],
});

// Export hooks for usage in functional components
export default baseApi;

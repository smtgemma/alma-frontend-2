import baseApi from "../baseApi";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import {
  RegistrationRequest,
  RegistrationResponse,
  EmailVerificationRequest,
  EmailVerificationResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetPasswordOtpRequest,
  VerifyResetPasswordOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  GetUserProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadProfileImageRequest,
  UploadProfileImageResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/interfaces/global";

// Custom base query for image upload that doesn't set Content-Type
const imageUploadBaseQuery = fetchBaseQuery({
  baseUrl: "http://172.252.13.71:1002/api/v1",
  credentials: "omit",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token") || Cookies?.get("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // Don't set Content-Type for FormData - let browser set it automatically
    return headers;
  },
});

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    adminSignIn: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/admin/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    signUp: builder.mutation<RegistrationResponse, RegistrationRequest>({
      query: (body) => ({
        url: "/auth/create-account",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    verifyEmail: builder.mutation<
      EmailVerificationResponse,
      EmailVerificationRequest
    >({
      query: (body) => ({
        url: "/auth/email-verify",
        method: "POST",
        body,
      }),
    }),
    resendCode: builder.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),
    forgetPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    verifyResetPasswordOtp: builder.mutation<
      VerifyResetPasswordOtpResponse,
      VerifyResetPasswordOtpRequest
    >({
      query: (body) => ({
        url: "/auth/verify-reset-password-otp",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    refreshToken: builder.mutation<
      {
        success: boolean;
        data: { accessToken: string; refreshToken?: string };
      },
      { refreshToken: string }
    >({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),

    // User Profile Endpoints
    getUserProfile: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (body) => ({
        url: "/users/update-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    uploadProfileImage: builder.mutation<UploadProfileImageResponse, FormData>({
      queryFn: async (body) => {
        try {
          const token = localStorage.getItem("token") || Cookies?.get("token");
          const headers: Record<string, string> = {};

          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }

          const response = await fetch(
            "http://206.162.244.131:1002/api/v1/users/me/uploads-profile-photo",
            {
              method: "POST",
              headers,
              body,
            }
          );

          const data = await response.json();

          if (!response.ok) {
            return { error: { status: response.status, data } };
          }

          return { data };
        } catch (error) {
          return { error: { status: 500, data: { message: "Network error" } } };
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendCodeMutation,
  useForgetPasswordMutation,
  useVerifyResetPasswordOtpMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useChangePasswordMutation,
  useAdminSignInMutation,
} = authApi;

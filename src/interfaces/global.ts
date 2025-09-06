export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  role: string;
  status: string;
  isVerified: boolean;
  accessToken: string;
  refreshToken?: string;
}

export type ErrorTypes = {
  success: boolean;
  message: string;
};

export interface RegistrationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    otpSent: boolean;
    message: string;
    type: string;
  };
}

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface EmailVerificationRequest {
  userId: string;
  otpCode: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    fistName: string;
    lastName: string;
    email: string;
    role: string;
    image: string | null;
    status: string;
    isVerified: boolean;
    accessToken: string;
    refreshToken?: string;
  };
}

export interface ResendOtpRequest {
  userId: string;
}

export interface ResendOtpResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    userId: string;
    otpSent: boolean;
    firstName: string;
    lastName: string;
    message: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    image: string | null;
    status: string;
    isVerified: boolean;
    accessToken: string;
    refreshToken?: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    otpSent: boolean;
    message: string;
    type: string;
  };
}

export interface VerifyResetPasswordOtpRequest {
  userId: string;
  otpCode: string;
}

export interface VerifyResetPasswordOtpResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}

export interface ResetPasswordRequest {
  newPassword: string;
}
export interface ChangePasswordRequest {
  newPassword: string;
  oldPassword: string
}
export interface ResetPasswordResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    message: string;
  };

}export interface ChangePasswordResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: {
    message: string;
  };
}

// User Profile Interfaces
export interface GetUserProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
    role: string;
    isVerified: boolean;
    isEmailVerified: boolean;
    membershipEnds: string;
    Subscription: Array<{
      id: string;
      userId: string;
      planId: string;
      status: string;
      startDate: string;
      endDate: string | null;
      stripeSubscriptionId: string;
      createdAt: string;
      updatedAt: string;
    }>;
    isProMember: boolean;
  };
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    message: string;
  };
}

export interface UploadProfileImageRequest {
  profileImage: File;
}

export interface UploadProfileImageResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
}

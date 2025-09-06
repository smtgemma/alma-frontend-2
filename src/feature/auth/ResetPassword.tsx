/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import { useResetPasswordMutation } from "@/redux/api/auth/authApi";
import CustomInput from "@/ui/CustomeInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Define Zod schema for validation
const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password should be at least 6 characters long" })
      .min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  
  // Check if we have the access token from OTP verification
  const accessToken = localStorage.getItem("token");
  
  console.log("Access token available:", !!accessToken);
  console.log("Access token:", accessToken);
  
  // Check if token is expired (basic check) - only for display purposes
  if (accessToken) {
    try {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      console.log("Token expiry:", new Date(tokenPayload.exp * 1000));
      console.log("Current time:", new Date(currentTime * 1000));
      
      if (tokenPayload.exp < currentTime) {
        console.log("Token is expired");
        toast.error("Session expired. Please try the forgot password process again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("forgotPassword");
        router.push("/forget-password");
        return null;
      }
    } catch (error) {
      console.log("Error parsing token:", error);
    }
  }

  // Use React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Watch form values for debugging
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  
  console.log("Form values - password:", password);
  console.log("Form values - confirmPassword:", confirmPassword);
  console.log("Passwords match:", password === confirmPassword);
  console.log("Form errors:", errors);
  const onSubmit = async (data: FormValues) => {
    console.log("Reset password attempt:", data);
    console.log("Current access token:", accessToken);
    console.log("Sending request to reset password...");
    
    try {
      const payload = {
        newPassword: data.password,
      };
      console.log("Reset password payload:", payload);
      
      const response = await resetPassword(payload).unwrap();

      console.log("Reset password response:", response);
      if (response?.success) {
        console.log("Password reset successfully");
        toast.success("Password reset successfully! Please login with your new password.");
        
        // Clear any stored data and redirect immediately
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("forgotPassword");
        
        // Direct redirect after clearing localStorage
        router.push("/reset-successful");
        return; // Stop execution here
      } else {
        console.error("Failed to reset password");
        toast.error("Failed to reset password");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      console.error("Error status:", error?.status);
      console.error("Error data:", error?.data);
      console.error("Error message:", error?.data?.message);
      
      if (error?.data?.message === "jwt expired") {
        toast.error("Session expired. Please try the forgot password process again.");
        // Clear expired token and redirect to forgot password
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("forgotPassword");
        router.push("/forget-password");
      } else {
        toast.error(error?.data?.message || "Failed to reset password");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full lg:min-w-[500px]">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-gray-500 text-sm text-center">
          Set a strong password
        </p>
      </div>

      <form 
        onSubmit={(e) => {
          console.log("Form submitted!");
          console.log("Current form values:", { password, confirmPassword });
          console.log("Passwords match check:", password === confirmPassword);
          
          if (password !== confirmPassword) {
            e.preventDefault();
            console.log("Passwords don't match, preventing submit");
            return;
          }
          
          console.log("Passwords match, calling handleSubmit...");
          handleSubmit(onSubmit)(e);
        }} 
        className="space-y-6 w-full"
      >
        {/* Password Input */}
        <CustomInput
          id="password"
          type="password"
          label="New Password"
          placeholder="••••••••••"
          showPasswordToggle={true}
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Confirm Password Input */}
        <CustomInput
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="••••••••••"
          showPasswordToggle={true}
          error={
            typeof errors.confirmPassword?.message === "string"
              ? errors.confirmPassword.message
              : "*Both passwords must be the same*"
          }
          {...register("confirmPassword")}
        />

        {/* Sign Up Button */}
        <PrimaryButton 
          type="submit" 
          loading={isLoading}
          onClick={() => {
            console.log("Reset password button clicked!");
            console.log("About to submit form...");
            
            // Manually trigger form submission
            const form = document.querySelector('form');
            if (form) {
              console.log("Form found, submitting...");
              form.dispatchEvent(new Event('submit', { bubbles: true }));
            } else {
              console.log("Form not found!");
            }
          }}
        >
          Reset Password
        </PrimaryButton>
      </form>
    </div>
  );
}

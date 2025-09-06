/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import Container from "@/lib/Container";
import CustomInput from "@/ui/CustomeInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Define Zod schema for validation
const formSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .min(1, { message: "New password is required" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Use React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log("Admin reset password attempt with:", data);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Password reset successfully!");
      router.push("/admin-reset-successful");
    } catch (error: any) {
      console.log("Error during admin password reset:", error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="w-full lg:min-w-[500px]">
        <h2 className="text-accent text-[2rem] font-medium text-center mb-8">Reset Admin Password</h2>
        <p className="text-gray-600 text-center mb-8">Please enter your new password below. Make sure it's strong and secure.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* New Password Input */}
          <CustomInput
            id="newPassword"
            type="password"
            label="New Password (Min. 8 characters)"
            placeholder="Enter your new password"
            showPasswordToggle={true}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          {/* Confirm Password Input */}
          <CustomInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your new password"
            showPasswordToggle={true}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              href="/admin-forget-password"
              className="text-sm text-red-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <PrimaryButton type="submit" loading={isLoading} text="Reset Password" />

          {/* Back to Sign In Link */}
          <div className="text-center">
            <Link
              href="/admin-signin"
              className="text-accent hover:underline"
            >
              Back to Admin Sign In
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}

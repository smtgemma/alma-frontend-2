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
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminForgetPass() {
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
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log("Admin forgot password attempt with:", data);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Password reset link sent to your email!");
      router.push("/admin-otp");
    } catch (error: any) {
      console.log("Error during admin forgot password:", error);
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="w-full lg:min-w-[500px]">
        <h2 className="text-accent text-[2rem] font-medium text-center mb-8">Forgot your admin password?</h2>
        <p className="text-gray-600 text-center mb-8">Enter your email and we'll send you a 6-digit code</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Email Input */}
          <CustomInput
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your admin email address"
            {...register("email")}
            error={errors.email?.message}
          />

          {/* Submit Button */}
          <PrimaryButton type="submit" loading={isLoading} text="Send Email" />

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

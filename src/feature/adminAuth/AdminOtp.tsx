/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import Container from "@/lib/Container";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Define Zod schema for validation
const formSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Use React Hook Form with Zod resolver
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const resendOtp = () => {
    setTimeLeft(60);
    setOtp(["", "", "", "", "", ""]);
    toast.success("New OTP sent to your email!");
  };

  const onSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("OTP verified successfully!");
      router.push("/admin-reset-password");
    } catch (error: any) {
      console.log("Error during admin OTP verification:", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="w-full lg:min-w-[500px]">
        <h2 className="text-accent text-[2rem] font-medium text-center mb-8">Admin Verification</h2>
        <p className="text-gray-600 text-center mb-8">Enter the 6-digit code sent to your admin email</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Verification Code
            </label>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="0"
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm mt-2">{errors.otp.message}</p>
            )}
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-gray-600">
                Resend code in {timeLeft}s
              </p>
            ) : (
              <button
                type="button"
                onClick={resendOtp}
                className="text-accent hover:underline"
              >
                Didn't get it? Resend
              </button>
            )}
          </div>

          {/* Submit Button */}
          <PrimaryButton type="submit" loading={isLoading} text="Verify OTP" />

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

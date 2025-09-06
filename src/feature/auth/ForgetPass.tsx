"use client";

import Logo from "@/components/shared/Logo";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import { useForgetPasswordMutation } from "@/redux/api/auth/authApi";
import CustomInput from "@/ui/CustomeInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Define Zod schema for validation
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "*Wrong email address*" })
    .min(1, { message: "Email is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgetPassPage() {
  const router = useRouter();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
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
    console.log("Form Data:", data);
    try {
      const response = await forgetPassword(data).unwrap();
      if (response?.success) {
        console.log("Forgot password response:", response);
        
        // Store userId for OTP verification
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("email", data.email);
        localStorage.setItem("forgotPassword", "true"); // Flag to identify this is forgot password flow
        
        toast.success("OTP sent successfully to your email");
        router.push("/otp");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error sending OTP. Please try again.");
    }
  };

  return (
    <div className="w-full lg:min-w-[500px] ">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Forget Password!</h1>
        <p className="text-gray-500 text-sm">
           Enter email associated to your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* Email Input */}
        <CustomInput
          id="email"
          type="email"
          label="Enter email"
          placeholder="example@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Login Button */}
        <PrimaryButton type="submit" loading={isLoading} text="Send Otp" />
      </form>

      {/* Register Link */}
      {/* <div className="text-center mb-3 mt-3 text-sm text-gray-600">
        Remembered the Account?{" "}
        <Link href="/signIn" className="text-primary hover:underline">
          Sign In
        </Link>
      </div> */}
    </div>
  );
}

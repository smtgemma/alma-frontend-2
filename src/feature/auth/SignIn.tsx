/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import Container from "@/lib/Container";
import { useSignInMutation } from "@/redux/api/auth/authApi";
import { setUser } from "@/redux/features/user/userSlice";
import CustomInput from "@/ui/CustomeInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { setAccessToken, setRefreshToken, setUserData } from "@/utils/cookieManager";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import * as z from "zod";

// Define Zod schema for validation
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters long" })
    .min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignInPage() {
  // Use React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [signIn, { isLoading }] = useSignInMutation();

  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data: FormValues) => {
    console.log("Login attempt with:", data);
    try {
      const response = await signIn(data).unwrap();
      console.log("Login response:", response);

      if (response?.success) {
        // Store access token with persistent cookies
        setAccessToken(response.data.accessToken);

        // Store refresh token if provided
        if (response.data.refreshToken) {
          setRefreshToken(response.data.refreshToken);
        }

        // Store user data
        setUserData(response.data);

        // Update Redux state
        dispatch(
          setUser({
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: response.data,
          })
        );

        toast.success("Accesso riuscito!");
        router.push("/login-successful");
      }
    } catch (error: any) {
      console.log("Error during sign-in:", error);
      toast.error(error?.data?.message || "Accesso non riuscito");
    }
  };

  return (
    <Container>
      <div className="w-full lg:min-w-[500px] ">
        <h2 className="text-accent text-[2rem] font-medium text-center mb-8">
          Accedi al tuo account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Email Input */}
          <CustomInput
            id="email"
            type="email"
            label="Email"
            placeholder="georgiayoung@example.com"
            {...register("email")}
            error={errors.email?.message}
          />

          {/* Password Input */}
          <CustomInput
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••••"
            showPasswordToggle={true}
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-600"
              >
                Ricordami
              </label>
            </div>
            <Link
              href="/forget-password"
              className="text-sm text-red-500 hover:underline"
            >
              Hai dimenticato la password?
            </Link>
          </div>
          {/* Login Button */}
          <PrimaryButton type="submit" loading={isLoading} text="Accedi" />
        </form>

        {/* SignUp Link */}
        <div className="text-center mb-3 mt-3 text-sm text-gray-600">
          Non hai un account?{" "}
          <Link href="/signUp" className="text-primary hover:underline">
          Registrati!
          </Link>
        </div>
      </div>
    </Container>
  );
}

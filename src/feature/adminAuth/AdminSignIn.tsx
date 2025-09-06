/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import Container from "@/lib/Container";
import { useAdminSignInMutation } from "@/redux/api/auth/authApi";
import { setUser } from "@/redux/features/user/userSlice";
import CustomInput from "@/ui/CustomeInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { setAccessToken, setUserData, setRefreshToken } from "@/utils/cookieManager";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function AdminSignIn() {
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

  const [signIn, { isLoading }] = useAdminSignInMutation();

  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await signIn(data).unwrap();

      if (response?.success) {
        // Store access token with persistent cookies
        setAccessToken(response.data.accessToken);

        // Store user data
        setUserData(response.data);

        // Store refresh token if provided
        if (response.data.refreshToken) {
          setRefreshToken(response.data.refreshToken);
        }

        // Update Redux state
        dispatch(
          setUser({
            token: response.data.accessToken,
            user: response.data,
          })
        );

        toast.success("Admin login successful!");
        router.push("/admin");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Admin login failed");
    }
  };

  return (
    <Container>
      <div className="w-full lg:min-w-[500px]">
        <h2 className="text-accent text-[2rem] font-medium text-center mb-8">
          Admin Login
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Admin access only. All actions are logged for security.
        </p>

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

          {/* Password Input */}
          <CustomInput
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            showPasswordToggle={true}
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/admin-forget-password"
              className="text-sm text-red-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <PrimaryButton type="submit" loading={isLoading} text="Log In" />
        </form>
      </div>
    </Container>
  );
}

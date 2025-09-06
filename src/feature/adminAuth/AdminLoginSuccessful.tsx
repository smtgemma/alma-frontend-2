"use client";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import Container from "@/lib/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginSuccessful() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/admin");
  };

  return (
    <Container>
      <div className="w-full lg:min-w-[500px] text-center">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-accent text-[2rem] font-medium mb-4">
            Admin Login Successful!
          </h2>
          <p className="text-gray-600">
            Welcome back! You have successfully logged in to the admin panel.
          </p>
        </div>

        <div className="space-y-4">
          <PrimaryButton
            onClick={handleGoToDashboard}
            text="Go to Admin Dashboard"
          />

          <div className="text-center">
            <Link href="/admin-signin" className="text-accent hover:underline">
              Sign in with different account
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function PayPalReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    const confirmPayment = async () => {
      try {
        const token =
          (typeof window !== "undefined" && localStorage.getItem("token")) ||
          Cookies.get("token");

        if (!token) {
          toast.error("Please sign in again.");
          router.push("/signIn");
          return;
        }

        // Prefer sessionStorage, but also allow a query param fallback if ever provided
        let paypalSubscriptionId =
          (typeof window !== "undefined" &&
            sessionStorage.getItem("paypalSubscriptionId")) ||
          "";

        if (!paypalSubscriptionId) {
          const qpId = searchParams.get("paypalSubscriptionId") || "";
          paypalSubscriptionId = qpId;
        }

        if (!paypalSubscriptionId) {
          setStatus("error");
          toast.error("Missing PayPal subscription reference.");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/billing/confirm-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ paypalSubscriptionId }),
          }
        );

        const data = await res.json();
        if (!res.ok || !data?.success) {
          // Check if this is an already processed subscription or retry scenario
          if (data?.data?.alreadyProcessed) {
            // Subscription was already activated, treat as success
            setStatus("success");
          } else {
            const msg = data?.message || `Server error: ${res.status}`;
            toast.error(msg);
            setStatus("error");
            return;
          }
        }

        // Clear stored ID after successful confirmation
        let redirectPath = "/dashboard";
        try {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("paypalSubscriptionId");
            const storedPath = sessionStorage.getItem("postPaymentRedirectPath");
            if (storedPath) {
              redirectPath = storedPath;
              sessionStorage.removeItem("postPaymentRedirectPath");
            }
          }
        } catch {}

        // Handle both new activations and already processed subscriptions
        if (data?.data?.alreadyProcessed) {
          toast.success("Subscription is already active!");
        } else {
          toast.success("Subscription activated successfully!");
        }
        setStatus("success");

        // Redirect based on origin (default to dashboard)
        setTimeout(() => router.push(redirectPath), 1000);
      } catch (e: any) {
        toast.error(e?.message || "Failed to confirm payment");
        setStatus("error");
      }
    };

    confirmPayment();
  }, [router, searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't verify your payment. Please contact support if you
            believe this is an error.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your subscription! Your payment has been processed
            successfully.
          </p>
        </div>
      </div>
    </>
  );
}

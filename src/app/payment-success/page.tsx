"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  loadBillingInfoFromStorage,
  clearBillingInfo,
} from "../../redux/features/billing/billingSlice";
import { useGetDraftBusinessPlanQuery } from "../../redux/api/businessPlan/businessPlanApi";
import axios from "axios";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // Check for draft business plan
  const { data: draftData, isLoading: isDraftLoading } =
    useGetDraftBusinessPlanQuery({});

  const billingData = useSelector(
    (state: RootState) => state.billing.billingInfo
  );
  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isBillingApiCompleted, setIsBillingApiCompleted] = useState(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  // Use useRef to track if the API has been called to prevent multiple calls
  const hasProcessedPayment = useRef(false);
  const isProcessing = useRef(false);

  const sendBillingInfoToBackend = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isProcessing.current) {
      return;
    }

    isProcessing.current = true;

    try {
      // Get billing info from Redux store first, then fallback to localStorage
      let currentBillingData = billingData;

      if (!currentBillingData && typeof window !== "undefined") {
        const stored = localStorage.getItem("billingInfo");
        if (stored) {
          try {
            currentBillingData = JSON.parse(stored);
          } catch (error) {
            console.error(
              "Failed to parse billing info from localStorage:",
              error
            );
          }
        }
      }

      if (!currentBillingData) {
        console.warn("⚠️ No billing data found in Redux or localStorage");
        console.log("🔍 Available data:", {
          reduxBillingData: billingData,
          localStorageKeys:
            typeof window !== "undefined" ? Object.keys(localStorage) : [],
        });
        // Still mark as completed even if no billing data to prevent infinite loading
        setIsBillingApiCompleted(true);
        return;
      }

      const Info = {
        phone: currentBillingData?.phone || "",
        country: currentBillingData?.country || "",
        city: currentBillingData?.city || "",
        state: currentBillingData?.state || "",
        postalCode: currentBillingData?.zipCode || "",
        email: currentBillingData?.email || "",
        address: currentBillingData?.address || "",
        additionalInfo: currentBillingData?.additionalInfo || "",
      };

      console.log("📝 Sending billing info to API:", {
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/billing/info`,
        data: Info,
        hasToken: !!localStorage.getItem("token"),
      });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Send billing info to your API
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/billing/info`,
        Info,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Billing API call completed successfully");
      setIsBillingApiCompleted(true);

      // Clear billing info from Redux and localStorage after successful submission
      dispatch(clearBillingInfo());
    } catch (err: any) {
      console.error("❌ Failed to send billing info to backend:", {
        error: err,
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        requestData: err.config?.data,
      });

      // Log the full response for debugging
      if (err.response) {
        console.error("📝 Full API Error Response:", {
          status: err.response.status,
          headers: err.response.headers,
          data: err.response.data,
        });

        // Show toast error with specific message from API
        const errorMessage =
          err.response.data?.message || "Failed to save billing information";
        toast.error(errorMessage);
      } else {
        // Network error or other issues
        toast.error(
          "Failed to save billing information. Please check your connection."
        );
      }
      
      // Mark as completed even on error to prevent infinite loading
      setIsBillingApiCompleted(true);
    } finally {
      isProcessing.current = false;
    }
  }, [billingData, dispatch]);

  // Single useEffect to handle the entire payment process
  useEffect(() => {
    // Prevent running multiple times
    if (hasProcessedPayment.current) {
      return;
    }

    hasProcessedPayment.current = true;

    const processPayment = async () => {
      // Load billing info from localStorage if not in Redux
      if (!billingData) {
        dispatch(loadBillingInfoFromStorage());
        // Wait a bit for the dispatch to complete
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const payment_intent = searchParams.get("payment_intent");
      const payment_intent_client_secret = searchParams.get(
        "payment_intent_client_secret"
      );
      const subscriptionId = searchParams.get("subscription_id");
      const paymentIntentId = searchParams.get("payment_intent_id");

      console.log("🔍 DEBUG: Payment success page loaded with params:", {
        payment_intent,
        payment_intent_client_secret,
        subscriptionId,
        paymentIntentId,
        billingDataExists: !!billingData,
      });

      if (payment_intent && payment_intent_client_secret) {
        console.log("✅ Payment verification successful");
        setPaymentStatus("success");

        // Wait a bit more to ensure data is loaded, then send billing info
        setTimeout(async () => {
          await sendBillingInfoToBackend();
        }, 500);
      } else {
        console.log(
          "❌ Payment verification failed - missing required parameters"
        );
        setPaymentStatus("error");
      }
    };

    processPayment();
  }, []); // Empty dependency array - only run once on mount

  // useEffect to handle redirect logic when both conditions are met
  useEffect(() => {
    if (isBillingApiCompleted && !isDraftLoading && draftData?.data) {
      console.log(
        "📝 Both conditions met - Billing API completed and Draft business plan found, redirecting to subscription success..."
      );
      
      setTimeout(() => {
        setIsProcessingComplete(true);
        router.push("/ai-smart-form?step=12");
      }, 1000);
    } else if (isBillingApiCompleted && !isDraftLoading) {
      // API completed but no draft data, mark processing as complete
      setTimeout(() => {
        setIsProcessingComplete(true);
      }, 1000);
    }
  }, [isBillingApiCompleted, isDraftLoading, draftData, router]);

  if (paymentStatus === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isUpdatingStatus
              ? "Updating payment status..."
              : "Verifying payment..."}
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "error") {
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
      <Toaster position="top-right" richColors />
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

          {/* Processing status */}
          {!isProcessingComplete && (
            <div className="bg-blue-50 p-3 rounded-md text-sm mb-6">
              <div className="flex items-center justify-center mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <p className="text-blue-800 font-medium">
                  {!isBillingApiCompleted
                    ? "Processing billing information..."
                    : isDraftLoading
                    ? "Checking for draft business plan..."
                    : "Finalizing your setup..."}
                </p>
              </div>
              <p className="text-blue-700 text-xs">
                Please wait while we complete the process
              </p>
            </div>
          )}

          {/* Debug: Show billing data from Redux (remove in production) */}
          {/* {process.env.NODE_ENV === "development" && billingData && (
          <div className="bg-green-50 p-3 rounded-md text-xs mb-6 text-left">
            <p className="font-medium text-green-800 mb-2">
              ✅ Debug - Billing Data Retrieved from Redux:
            </p>
            <p className="text-green-700">
              Name: {billingData.firstName} {billingData.lastName}
            </p>
            <p className="text-green-700">Email: {billingData.email}</p>
            <p className="text-green-700">Phone: {billingData.phone}</p>
            <p className="text-green-700">Address: {billingData.address}</p>
            <p className="text-green-700">
              Location: {billingData.city}, {billingData.state},{" "}
              {billingData.country}
            </p>
            <p className="text-green-700">ZIP: {billingData.zipCode}</p>
          </div>
        )} */}

          {/* {process.env.NODE_ENV === "development" && !billingData && (
          <div className="bg-red-50 p-3 rounded-md text-xs mb-6">
            <p className="font-medium text-red-800">
              ⚠️ Debug - No billing data found in Redux
            </p>
          </div>
        )} */}

          <div className="space-y-3">
            {isProcessingComplete ? (
              <>
                <Link
                  href={
                    draftData?.data ? "/ai-smart-form?step=12" : "/ai-smart-form"
                  }
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors w-full"
                >
                  Generate Plan
                </Link>

                <Link
                  href="/"
                  className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors w-full"
                >
                  Return to Home
                </Link>
              </>
            ) : (
              <>
                <button
                  disabled
                  className="inline-block bg-gray-400 text-gray-600 px-6 py-3 rounded-lg cursor-not-allowed w-full opacity-50"
                >
                  Generate Plan
                </button>

                <button
                  disabled
                  className="inline-block bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed w-full opacity-50"
                >
                  Return to Home
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

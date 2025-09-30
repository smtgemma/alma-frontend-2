"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePayment } from "../hooks/usePayment";
import { BillingInfo, CreatePaymentMethodRequest } from "../interfaces/payment";
import { toast } from "sonner";
import { PaymentStatus } from "./PaymentStatus";
import { useDispatch } from "react-redux";
import { setSubscriptionData } from "../redux/features/subscription/subscriptionSlice";

// Form validation schemas
const billingInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  additionalInfo: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

const cardDataSchema = z.object({
  cardNumber: z.string().min(13, "Card number must be at least 13 digits"),
  expMonth: z.string().min(1, "Expiration month is required"),
  expYear: z.string().min(1, "Expiration year is required"),
  cvc: z
    .string()
    .min(3, "CVC must be at least 3 digits")
    .max(4, "CVC must be at most 4 digits"),
});

const formSchema = z.object({
  billing: billingInfoSchema,
  card: cardDataSchema,
});

type FormData = z.infer<typeof formSchema>;

interface PaymentFormProps {
  planId: string;
  planName: string;
  planPrice: number;
  planCurrency: string;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  onComplete?: () => void; // Add callback for when payment is complete
  showHeader?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  planId,
  planName,
  planPrice,
  planCurrency,
  onSuccess,
  onError,
  onComplete,
  showHeader = true,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { isLoading, error, isSuccess, processPayment, resetState } =
    usePayment();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState<
    "billing" | "payment" | "complete"
  >("billing");
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const onSubmit = async (data: FormData) => {
    try {
      setPaymentStatus("processing");
      setStatusMessage("Processing your payment...");

    

      // Convert form data to the required format
      const billingInfo: BillingInfo = {
        firstName: data.billing.firstName, // || "MR", // Test data fallback
        lastName: data.billing.lastName, // || "Jone", // Test data fallback
        phone: data.billing.phone, // || "01879654147", // Test data fallback
        location: data.billing.location, // || "Dhaka", // Test data fallback
        email: data.billing.email, // || "jane@gmail.com", // Test data fallback
        address: data.billing.address, // || "moricha palong", // Test data fallback
        additionalInfo: data.billing.additionalInfo, // || "Buy some thing", // Test data fallback
        country: data.billing.country, // || "Bangladesh", // Test data fallback
      };

      const cardData: CreatePaymentMethodRequest = {
        card: {
          number: data.card.cardNumber.replace(/\s/g, ""), // Remove spaces
          exp_month: parseInt(data.card.expMonth),
          exp_year: parseInt(data.card.expYear),
          cvc: data.card.cvc,
        },
        type: "card",
      };

      console.log("🔍 DEBUG: Calling processPayment with:", {
        planId,
        billingInfo,
        cardData,
        billingInfoString: JSON.stringify(billingInfo, null, 2),
      });

      // Process the payment
      const result = await processPayment(planId, billingInfo, cardData);

      console.log("🎉 DEBUG: Payment completed successfully:", result);

      // Store subscription data in Redux for later use
      // if (result?.subscription) {
      //   console.log(
      //     "💾 Storing subscription data in Redux:",
      //     result.subscription
      //   );
      //   dispatch(
      //     setSubscriptionData({
      //       clientSecret: result.subscription.clientSecret || null,
      //       paymentIntentId: result.subscription.paymentIntentId || null,
      //       subscriptionId: result.subscription.subscriptionId || null,
      //       status: result.subscription.status || null,
      //       amount: planPrice,
      //       currency: planCurrency,
      //     })
      //   );
      // }

      // After payment success, update backend payment status
      console.log("📋 Full payment result:", result);
      console.log("📋 Subscription data:", result?.subscription);
      console.log("🔍 DEBUG: Result structure:", {
        hasResult: !!result,
        resultKeys: result ? Object.keys(result) : [],
        hasSubscription: !!result?.subscription,
        subscriptionKeys: result?.subscription
          ? Object.keys(result.subscription)
          : [],
        subscriptionId: result?.subscription?.subscriptionId,
        paymentIntentId: result?.subscription?.paymentIntentId,
        clientSecret: result?.subscription?.clientSecret,
        status: result?.subscription?.status,
      });

      // Store subscription data in Redux for later use
      if (result?.subscription) {
        console.log(
          "💾 Storing subscription data in Redux:",
          result.subscription
        );
        dispatch(
          setSubscriptionData({
            clientSecret: result.subscription.clientSecret || null,
            paymentIntentId: result.subscription.paymentIntentId || null,
            // subscriptionId: result.subscription.subscriptionId || null,
            // status: result.subscription.status || null,
            // amount: planPrice,
            // currency: planCurrency,
          })
        );
      }

      // Check if payment is successful and update backend status
      if (result?.subscription?.subscriptionId) {
        try {
          console.log("🔄 Updating payment status in backend...");

          const token = localStorage.getItem("token");
          if (token) {
            // Use subscriptionId only - paymentIntentId should not be used for subscription status update
            const stripeSubscriptionId = result.subscription.subscriptionId;

            console.log("🔑 Using subscription ID:", stripeSubscriptionId);

            // Direct backend API call (no localhost proxy)
            const updateResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/billing/payment-status`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  stripeSubscriptionId: stripeSubscriptionId,
                  status: "PAID",
                }),
              }
            );

            if (updateResponse.ok) {
              const responseData = await updateResponse.json();
              console.log(
                "✅ Payment status updated successfully in backend:",
                responseData
              );
            } else {
              const errorData = await updateResponse.json();
              console.error("❌ Failed to update payment status:", {
                status: updateResponse.status,
                error: errorData,
              });
            }
          } else {
            console.error("❌ No authentication token found");
          }
        } catch (updateError) {
          console.error("❌ Error updating payment status:", updateError);
        }
      } else {
        console.warn("⚠️ No subscription ID found for payment status update");
        toast.warning(
          "Payment successful but subscription ID not found. Please contact support."
        );
      }
      // } else {
      //   console.log(
      //     "⚠️ No subscription ID or payment intent ID found in result:",
      //     result
      //   );
      // }

      setPaymentStatus("success");
      setStatusMessage("Payment completed successfully!");
      setCurrentStep("complete");
      toast.success("Payment completed successfully!");

      // Redirect to payment success page with subscription data
      if (
        result?.subscription?.subscriptionId ||
        result?.subscription?.paymentIntentId
      ) {
        const params = new URLSearchParams();

        // Always use subscriptionId if available
        if (result.subscription.subscriptionId) {
          params.append("subscription_id", result.subscription.subscriptionId);
          console.log(
            "🔑 Adding subscription_id to URL:",
            result.subscription.subscriptionId
          );
        }

        // Add paymentIntentId as backup
        if (result.subscription.paymentIntentId) {
          params.append("payment_intent", result.subscription.paymentIntentId);
          console.log(
            "🔑 Adding payment_intent to URL:",
            result.subscription.paymentIntentId
          );
        }

        console.log(
          "🔄 Redirecting to payment success with params:",
          params.toString()
        );
        window.location.href = `/payment-success?${params.toString()}`;
      }

      if (onSuccess) {
        onSuccess(result);
      }
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      const errorMessage = error.message || "Payment failed";
      setPaymentStatus("error");
      setStatusMessage(errorMessage);
      toast.error(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const handleReset = () => {
    reset();
    resetState();
    setCurrentStep("billing");
    setPaymentStatus("idle");
    setStatusMessage("");
  };

  const handleCloseStatus = () => {
    setPaymentStatus("idle");
    setStatusMessage("");
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  if (isSuccess && currentStep === "complete") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8 py-12">
          <div className=" mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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

              <h3 className="text-[2rem] font-medium text-accent mb-2">
                Payment Successful!
              </h3>
              <p className="text-[1rem] text-info mb-6">
                Your subscription has been activated successfully.
              </p>
              <button
                onClick={handleReset}
                className="w-full px-8 py-3 cursor-pointer bg-primary text-white text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:bg-primary/90"
              >
                Make Another Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full">
          {/* Header with Logo and Back Button */}
          {showHeader && (
            <div className="flex justify-between items-center mb-8 px-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-accent">
                  Pianifico Suite
                </span>
              </div>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          )}

          {/* Header */}
          <div className="mb-2 px-8">
            <h1 className="text-[1.7rem] md:text-[2.3rem] text-accent font-medium">
              Complete Payment
            </h1>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-[1rem] text-info">Plan:</span>
                <span className="font-medium text-accent">{planName}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[1rem] text-info">Amount:</span>
                <span className="font-medium text-lg text-accent">
                  {planPrice} {planCurrency}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus !== "idle" && (
            <div className="px-8 mb-4">
              <PaymentStatus
                status={paymentStatus}
                message={statusMessage}
                onClose={handleCloseStatus}
              />
            </div>
          )}

          {error && (
            <div className="px-8 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Main Content Grid */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid lg:grid-cols-2"
          >
            {/* Billing Information Section */}
            <div className="rounded-2xl p-8">
              <div className="space-y-4">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="question-text">First Name</label>
                    <input
                      type="text"
                      {...register("billing.firstName")}
                      placeholder="Paolo"
                      className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                    />
                    {errors.billing?.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.billing.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="question-text">Last Name</label>
                    <input
                      type="text"
                      {...register("billing.lastName")}
                      placeholder="Maldini"
                      className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                    />
                    {errors.billing?.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.billing.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="question-text">Phone</label>
                    <input
                      type="tel"
                      {...register("billing.phone")}
                      placeholder="+391026476"
                      className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                    />
                    {errors.billing?.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.billing.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="question-text">Email</label>
                    <input
                      type="email"
                      {...register("billing.email")}
                      placeholder="paolomaldini003@gmail.com"
                      className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                    />
                    {errors.billing?.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.billing.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Country/Region */}
                <div>
                  <label className="question-text">Country/Region</label>
                  <input
                    type="text"
                    {...register("billing.country")}
                    placeholder="Italy"
                    className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                  />
                  {errors.billing?.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.billing.country.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="question-text">Address</label>
                  <input
                    type="text"
                    {...register("billing.address")}
                    placeholder="Roma,Italia"
                    className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                  />
                  {errors.billing?.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.billing.address.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="question-text">Location</label>
                  <input
                    type="text"
                    {...register("billing.location")}
                    placeholder="3891 Ranchview"
                    className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                  />
                  {errors.billing?.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.billing.location.message}
                    </p>
                  )}
                </div>

                {/* Additional Information */}
                <div>
                  <label className="question-text">
                    Additional Information
                  </label>
                  <textarea
                    {...register("billing.additionalInfo")}
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                    rows={4}
                    className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem] resize-none"
                  />
                </div>

                {/* Security Notice */}
                <p className="text-[1rem] text-info font-medium mt-4">
                  Your billing information is securely stored and encrypted.
                </p>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="rounded-2xl p-8">
              <h2 className="text-[2rem] font-medium text-accent mb-6 mt-5">
                Payment Method
              </h2>

              <div className="space-y-4">
                {/* Card Information */}
                <div>
                  <div>
                    <label className="question-text">Card Information</label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register("card.cardNumber")}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          e.target.value = formatted;
                        }}
                        placeholder="4242 5859 5684 2585"
                        maxLength={19}
                        className="w-full px-4 py-3 border border-[#888888]/50 rounded-t-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem] pr-16"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                        <div className="w-6 h-4 bg-red-600 rounded-sm"></div>
                        <div className="w-6 h-4 bg-yellow-500 rounded-sm"></div>
                      </div>
                    </div>
                    {errors.card?.cardNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.card.cardNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Expiry and CVC */}
                  <div className="grid grid-cols-2">
                    <div>
                      <select
                        {...register("card.expMonth")}
                        className="w-full px-4 py-3 border border-[#888888]/50 rounded-bl-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200 text-[0.9rem] bg-white"
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <option
                              key={month}
                              value={month.toString().padStart(2, "0")}
                            >
                              {month.toString().padStart(2, "0")}
                            </option>
                          )
                        )}
                      </select>
                      {errors.card?.expMonth && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.card.expMonth.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <select
                        {...register("card.expYear")}
                        className="w-full px-4 py-3 border border-[#888888]/50 rounded-br-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200 text-[0.9rem] bg-white"
                      >
                        <option value="">YYYY</option>
                        {Array.from(
                          { length: 10 },
                          (_, i) => new Date().getFullYear() + i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      {errors.card?.expYear && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.card.expYear.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <input
                      type="text"
                      {...register("card.cvc")}
                      placeholder="CVC"
                      maxLength={4}
                      className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                    />
                    {errors.card?.cvc && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.card.cvc.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subscribe Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-3 cursor-pointer bg-primary text-white text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:bg-primary/90 mt-8 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing Payment...
                    </div>
                  ) : (
                    `Pay ${planPrice} ${planCurrency}`
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

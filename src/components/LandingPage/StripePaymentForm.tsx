"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import axios from "axios";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setBillingInfo,
  BillingInfo,
} from "@/redux/features/billing/billingSlice";
import {
  useGetCurrentPlansQuery,
  useGetSinglePlansQuery,
} from "@/redux/api/plans/plansApi";
import Loading from "../Others/Loading";

// Form validation schema for billing info
const billingInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  additionalInfo: z.string().optional(),
});

type BillingFormData = z.infer<typeof billingInfoSchema>;

export default function StripePaymentForm({ id }: { id: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isLoadingBillingInfo, setIsLoadingBillingInfo] = useState(true);
  const {
    data: planData,
    error: planError,
    isLoading: isLoadingPlan,
  } = useGetSinglePlansQuery(id);
  console.log("Plan ddata", planData);

  const dispatch = useDispatch();
  const [userBillingInfo, setUserBillingInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    additionalInfo: "",
  });

  const stripe = useStripe();
  const elements = useElements();

  // Get subscription data from Redux store
  const subData: any = useSelector((state: RootState) => state.subscription);

  // Get current billing data from Redux store for debugging
  const currentBillingData = useSelector(
    (state: RootState) => state.billing.billingInfo
  );

  const clientSecretId = subData?.clientSecret;
  const paymentIntentId = subData?.paymentIntentId;
  console.log("Redux Data:", clientSecretId, paymentIntentId);

  // Get refetch function for subscription data
  const { refetch: refetchSubscriptionData } = useGetCurrentPlansQuery({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingInfoSchema),
  });

  // Fetch existing billing info from API and populate form
  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        setIsLoadingBillingInfo(true);
        console.log("🔍 Fetching existing billing info...");

        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No token found, skipping billing info fetch");
          setIsLoadingBillingInfo(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/billing/info`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ Billing info API response:", response.data);

        if (response.data.success && response.data.data) {
          const billingInfo = response.data.data.billingInfo;
          const userData = response.data.data.user;

          if (billingInfo) {
            console.log("✅ Found existing billing info, populating form...");

            // Populate form fields with existing billing info
            setValue("firstName", userData.firstName || "");
            setValue("lastName", userData.lastName || "");
            setValue("email", billingInfo.email || userData.email || "");
            setValue("phone", billingInfo.phone || "");
            setValue("address", billingInfo.address || "");
            setValue("city", billingInfo.city || "");
            setValue("state", billingInfo.state || "");
            setValue("zipCode", billingInfo.postalCode || "");
            setValue("country", billingInfo.country || "");
            setValue("additionalInfo", billingInfo.additionalInfo || "");

            console.log("✅ Form populated with existing billing info:", {
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: billingInfo.email || userData.email,
              phone: billingInfo.phone,
              address: billingInfo.address,
              city: billingInfo.city,
              state: billingInfo.state,
              zipCode: billingInfo.postalCode,
              country: billingInfo.country,
            });
          } else {
            console.log(
              "ℹ️ No existing billing info found, form will remain empty"
            );
            // At least populate with user data from API response
            if (userData) {
              setValue("firstName", userData.firstName || "");
              setValue("lastName", userData.lastName || "");
              setValue("email", userData.email || "");
              console.log("✅ Populated form with user data only:", {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
              });
            }
          }
        } else {
          console.log(
            "ℹ️ No billing info or user data found, form will remain empty"
          );
        }
      } catch (error: any) {
        console.error("❌ Error fetching billing info:", error);
        // Don't show error to user, just log it
        // The form will remain empty if fetching fails
      } finally {
        setIsLoadingBillingInfo(false);
      }
    };

    fetchBillingInfo();
  }, []); // Empty dependency array - only run once on mount

  const onSubmit = async (billingData: BillingFormData) => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    // Store billing info in Redux when submit button is clicked
    const billingInfo: BillingInfo = {
      firstName: billingData.firstName,
      lastName: billingData.lastName,
      phone: billingData.phone,
      email: billingData.email,
      country: billingData.country,
      address: billingData.address,
      city: billingData.city,
      state: billingData.state,
      zipCode: billingData.zipCode,
      additionalInfo: billingData.additionalInfo || "",
    };

    dispatch(setBillingInfo(billingInfo));
    console.log(
      "✅ Billing info stored in Redux on form submission:",
      billingInfo
    );

    try {
      // Check if we have clientSecret and paymentIntentId from Redux
      if (!clientSecretId || !paymentIntentId) {
        throw new Error("Payment intent not found. Please try again.");
      }
      const { error: submitError } = await elements.submit();

      if (submitError) {
        console.error("❌ PaymentElement submit error:", submitError);
        setPaymentError(submitError.message || "Payment validation failed");
        setIsProcessing(false);
        return;
      }

      console.log("✅ PaymentElement submitted successfully");

      // Create payment method using Stripe Elements (exactly like sample-code-base)
      const paymentElement = elements.getElement(PaymentElement);
      if (!paymentElement) {
        setPaymentError(
          "Payment element not found. Please refresh and try again."
        );
        setIsProcessing(false);
        return;
      }

      const { paymentMethod, error: stripeError } =
        await stripe.createPaymentMethod({
          elements,
          params: {
            billing_details: {
              name: `${billingData.firstName} ${billingData.lastName}`,
              email: billingData.email,
              phone: billingData.phone,
              address: {
                country: billingData.country,
                line1: billingData.address,
                city: billingData.city,
                state: billingData.state,
                postal_code: billingData.zipCode,
              },
            },
          },
        });

      if (stripeError) {
        setPaymentError(
          stripeError.message || "Failed to create payment method"
        );
        setIsProcessing(false);
        return;
      }

      if (!paymentMethod) {
        setPaymentError("Failed to create payment method");
        setIsProcessing(false);
        return;
      }

      const { id }: any = paymentMethod;
      console.log("Payment Method ID:", id);

      // Confirm payment using Stripe API (exactly like sample-code-base)
      console.log("🔍 Confirming payment with Stripe API...");

      // Note: We should use backend API instead of direct Stripe API call
      // Frontend should not call Stripe API directly for security
      console.log(
        "⚠️ Warning: Direct Stripe API call from frontend is not secure"
      );

      // Use stripe.confirmPayment (secure method)
      console.log("🔍 Using stripe.confirmPayment...");

      try {
        // Use stripe.confirmPayment with clientSecret
        const { error: confirmError } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            payment_method: id,
            return_url: `${window.location.origin}/payment-success`,
          },
          clientSecret: clientSecretId, // Add clientSecret here
        });

        if (confirmError) {
          console.error("❌ Payment confirmation error:", confirmError);
          throw new Error(
            confirmError.message || "Payment confirmation failed"
          );
        }

        // Payment successful - now call backend to update status
        console.log("✅ Payment confirmed successfully");
        const Info = {
          phone: billingData.phone,
          location: `${billingData.city}, ${billingData.state}, ${billingData.country} - ${billingData.zipCode}`,
          email: billingData.email,
          address: billingData.address,
          additionalInfo: billingData.additionalInfo,
        };
        try {
          // Call backend to update payment status
          console.log("🔍 Updating payment status in backend...");
          console.log("🔍 DEBUG: API Body Data:", {
            subscriptionId: subData?.subscriptionId,
            status: "PAID",
            subData: subData,
          });
          const statusUpdateRes = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/billing/info`,
            Info,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          console.log("Backend Status Update Response:", statusUpdateRes.data);

          if (statusUpdateRes.data.success) {
            // Complete success
            toast.success("Payment successful! Subscription activated.");

            // Refresh subscription data in Redux store
            try {
              await refetchSubscriptionData();
              console.log("✅ Subscription data refreshed successfully");
            } catch (refreshError) {
              console.warn(
                "⚠️ Subscription data refresh failed:",
                refreshError
              );
            }

            reset();
            setIsProcessing(false);

            // if (onSuccess) {
            //   onSuccess({
            //     status: "succeeded",
            //     subscriptionId: subData?.subscriptionId,
            //   });
            // }
          } else {
            throw new Error(
              statusUpdateRes.data.message ||
                "Failed to update subscription status"
            );
          }
        } catch (statusError: any) {
          console.error("❌ Backend status update error:", statusError);
          // Payment succeeded but status update failed
          toast.warning(
            "Payment successful but subscription activation failed. Please contact support."
          );
          reset();
          setIsProcessing(false);

          // if (onSuccess) {
          //   onSuccess({
          //     status: "succeeded",
          //     subscriptionId: subData?.subscriptionId,
          //   });
          // }
        }
      } catch (confirmError: any) {
        console.error("❌ Payment confirmation error:", confirmError);
        throw new Error(confirmError.message || "Payment confirmation failed");
      }
    } catch (error: any) {
      console.error("❌ Payment error:", error);

      const errorMessage =
        error.response?.data?.message || error.message || "Payment failed";
      setPaymentError(errorMessage);
      // onError?.(errorMessage);
      toast.error(`Payment failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };
  if (isLoadingPlan) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Complete Your Subscription
            </h1>
            {/* {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            )} */}
          </div>

          {/* Plan Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Selected Plan:</span>
              {planData?.data && (
                <span className="font-semibold text-blue-900">
                  {planData.data.publicName}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Amount:</span>
              {planData?.data && (
                <span className="font-bold text-lg text-blue-900">
                  {planData.data.currency}
                  {planData.data.price}
                </span>
              )}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Left Column - Billing Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl lg:text-3xl font-semibold text-gray-900 mb-6">
              Billing Information
            </h2>

            {/* Loading indicator for billing info */}
            {isLoadingBillingInfo && (
              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <p className="text-blue-600 text-sm">
                    Loading your billing information...
                  </p>
                </div>
              </div>
            )}

            {/* Info message */}
            {!isLoadingBillingInfo && (
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <p className="text-gray-600 text-sm">
                  📝 Your existing billing information has been loaded. You can
                  update any field as needed.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    {...register("firstName")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+1234567890"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  {...register("country")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="BD">Bangladesh</option>
                  <option value="IN">India</option>
                  <option value="AU">Australia</option>
                  <option value="LY">Libya</option>
                </select>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  {...register("address")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    {...register("city")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    {...register("state")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    {...register("zipCode")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="10001"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  {...register("additionalInfo")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any additional information..."
                />
              </div>
            </div>
          </div>

          {/* Right Column - Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
            <h2 className="text-xl lg:text-3xl font-semibold text-gray-900 mb-6">
              Payment Method
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Information
                </label>
                <PaymentElement
                  options={{
                    layout: "tabs",
                    fields: {
                      billingDetails: {
                        address: {
                          country: "never",
                        },
                      },
                    },
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary cursor-pointer hover:bg-green-800 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 mt-6"
              >
                {isProcessing
                  ? "Processing..."
                  : `Pay ${planData.data.price} ${planData.data.currency}`}
              </button>

              {/* Error Display */}
              {paymentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{paymentError}</p>
                </div>
              )}

              {/* Test Card Info */}
              {/* <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-600">
                <p className="font-medium mb-2">🧪 Test Card Details:</p>
                <p>Card: 4242 4242 4242 4242</p>
                <p>Expiry: Any future date</p>
                <p>CVC: Any 3 digits</p>
              </div> */}

              {/* Security Notice */}
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>🔒 Your payment information is secure and encrypted</p>
                <p>Powered by Stripe</p>
              </div>

              {/* Debug: Show current billing data in Redux (remove in production) */}
              {/* {process.env.NODE_ENV === "development" && currentBillingData && (
                <div className="bg-yellow-50 p-3 rounded-md text-xs mt-4">
                  <p className="font-medium text-yellow-800 mb-2">
                    🔍 Debug - Current Billing Data in Redux:
                  </p>
                  <p className="text-yellow-700">
                    Name: {currentBillingData.firstName}{" "}
                    {currentBillingData.lastName}
                  </p>
                  <p className="text-yellow-700">
                    Email: {currentBillingData.email}
                  </p>
                  <p className="text-yellow-700">
                    Phone: {currentBillingData.phone}
                  </p>
                  <p className="text-yellow-700">
                    Location: {currentBillingData.city},{" "}
                    {currentBillingData.state}
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGeneratePlanMutation } from "@/redux/api/plans/generatePlanApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  useBusinessGenerateMutation,
  useBusinessDraftMutation,
} from "@/redux/api/businessPlan/businessPlanApi";
import { useRouter } from "next/navigation";
import Loading from "../Others/Loading";
import { useGetUserProfileQuery } from "@/redux/api/auth/authApi";

export default function S10ReviewPlan() {
  const {
    prevStep,
    nextStep,
    goToStep,
    formData,
    setGeneratedPlan,
    setIsGeneratingPlan,
    isGeneratingPlan,
  } = useSmartForm();

  const { user } = useSelector((state: any) => state.user);
  const router = useRouter();
  const { getAggregatedData, logFormData, exportFormDataAsJSON } =
    useSmartForm();
  const [businessGenerate, { isLoading: isBusinessGenerating }] =
    useBusinessGenerateMutation();
  const [businessDraft, { isLoading: isBusinessDrafting }] =
    useBusinessDraftMutation();
  // Get all form data in the required format
  const data = getAggregatedData();

  // Get user profile data to check subscription status
  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !user?.token,
  });

  console.log("Aggregated form data:", data);

  const handleGeneratePlan = async () => {
    try {
      console.log("Generating business plan with data:", data);
      const result = await businessGenerate(data);

      console.log("Business plan generated:", result);

      if (result?.data?.success) {
        toast.success(
          result?.data?.message || "Business plan generated successfully!"
        );
        // Navigate to S13UnderExpertReview on success (step index 12)
        goToStep(12);
      } else {
        toast.error(
          result?.data?.message || "Failed to generate business plan"
        );
      }
    } catch (error: any) {
      console.error("Error generating business plan:", error);
      toast.error("An error occurred while generating the business plan");
    }
  };

  const handleSubscriptionPlan = async () => {
    try {
      console.log("Aggregated form data:", data);

      // Call useBusinessDraftMutation with the aggregated data
      const draftResult = await businessDraft(data);

      console.log("Business draft result:", draftResult);

      if (draftResult?.data?.success) {
        toast.success(
          draftResult?.data?.message || "Draft saved successfully!"
        );
      } else if (draftResult?.error) {
        toast.error("Failed to save draft");
      }

      // Navigate to S11SubscriptionPlan (step index 10)
      goToStep(10);
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast.error("An error occurred while saving the draft");
      // Still navigate even if draft fails
      goToStep(10);
    }
  };
  const token = Cookies.get("token") || localStorage.getItem("token");
  console.log("Fetched token:", token);
  const [isSubscribed, setIsSubscribed] = useState<string | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/v1/billing/subscription-status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res) {
          console.log("=== SUBSCRIPTION DEBUG ===");
          console.log("Full API response:", res.data);
          console.log("Response structure:", JSON.stringify(res.data, null, 2));
          console.log(
            "Status from res.data?.data?.status:",
            res.data?.data?.status
          );
          console.log("Status from res.data?.status:", res.data?.status);
          console.log("Status type:", typeof res.data?.data?.status);
          console.log("Status length:", res.data?.data?.status?.length);

          const finalStatus =
            res.data?.data?.status || res.data?.status || "INACTIVE";
          console.log("Final status to set:", finalStatus);
          console.log("Final status type:", typeof finalStatus);
          console.log("Final status === 'ACTIVE':", finalStatus === "ACTIVE");

          setIsSubscribed(finalStatus);
          console.log("isSubscribed state set to:", finalStatus);
          console.log("=== END SUBSCRIPTION DEBUG ===");
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        setIsSubscribed("INACTIVE");
      } finally {
        setIsSubscriptionLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  // Send to API
  // const response = await fetch("/api/endpoint", {
  //   method: "POST",
  //   body: JSON.stringify(data),
  // });

  if (isBusinessGenerating || isBusinessDrafting) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center p-2 md:p-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8">
          {/* Step Info */}
          <p className="text-center text-[1rem] font-medium mb-2">
            Step 10 out of 10
          </p>

          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium">Review Plan</h2>
          </div>

          {/* Form */}
          <div className="p-4 md:p-8 relative">
            {/* Top Right Decorative Image */}
            <div className="absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48">
              <img
                src="/images/dotted-top.png"
                alt="Decorative pattern"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className="bg-white rounded-2xl p-4 m-2 md:p-8 md:m-8 shadow-lg relative"
              style={{
                boxShadow:
                  "0 10px 15px -3px #4F46E540, 0 4px 6px -4px #4F46E540",
              }}
            >
              <div className="space-y-6">
                {/* Review Message */}
                <div className="text-center">
                  <p className="text-[1rem] font-normal text-accent leading-relaxed">
                    Note: Please review all your inputs carefully. After
                    clicking "Generate Plan," changes will be <br /> no longer
                    be possible.
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col md:flex-row gap-4 mt-8 max-w-lg mx-auto justify-center">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full  px-8 py-3 cursor-pointer bg-white border border-[#888888] text-accent text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Back
                  </button>
                  {(() => {
                    console.log("=== BUTTON RENDER DEBUG ===");
                    console.log(
                      "isSubscriptionLoading:",
                      isSubscriptionLoading
                    );
                    console.log("Current isSubscribed value:", isSubscribed);
                    console.log("isSubscribed type:", typeof isSubscribed);
                    console.log(
                      "isSubscribed === 'ACTIVE':",
                      isSubscribed === "ACTIVE"
                    );
                    console.log(
                      "isSubscribed == 'ACTIVE':",
                      isSubscribed == "ACTIVE"
                    );
                    console.log(
                      "Will show subscription flow:",
                      isSubscribed !== "ACTIVE"
                    );
                    console.log("=== END BUTTON RENDER DEBUG ===");

                    if (isSubscriptionLoading) {
                      return (
                        <button
                          type="button"
                          disabled
                          className="w-full px-8 py-3 cursor-not-allowed bg-gray-300 text-gray-500 text-[1rem] font-semibold rounded-lg"
                        >
                          Loading...
                        </button>
                      );
                    }

                    return isSubscribed === "ACTIVE" ? (
                      <button
                        type="button"
                        onClick={handleGeneratePlan}
                        disabled={isGeneratingPlan || isBusinessGenerating}
                        className="w-full px-8 py-3 cursor-pointer bg-primary text-white text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPlan || isBusinessGenerating
                          ? "Generating Plan..."
                          : "Generate Plan"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubscriptionPlan}
                        className="w-full px-8 py-3 cursor-pointer bg-primary text-white text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Generate Plan
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Bottom Left Decorative Image */}
            <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 z-[-1] md:z-0">
              <img
                src="/images/dotted-down.png"
                alt="Decorative pattern"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

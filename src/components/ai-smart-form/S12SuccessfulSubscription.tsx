"use client";

import { useState } from "react";
import SmartNavbar from "./SmartNavbar";
import { useSmartForm } from "./SmartFormContext";
import { useGeneratePlanMutation } from "@/redux/api/plans/generatePlanApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useBusinessGenerateMutation,
  useBusinessSyncDraftMutation,
  useGetDraftBusinessPlanQuery,
} from "@/redux/api/businessPlan/businessPlanApi";
import Loading from "../Others/Loading";

export default function S12SuccessfulSubscription() {
  const {
    prevStep,
    nextStep,
    goToStep,
    formData,
    setGeneratedPlan,
    setIsGeneratingPlan,
    isGeneratingPlan,
  } = useSmartForm();

  const { getAggregatedData, logFormData, exportFormDataAsJSON } =
    useSmartForm();

  const [businessSyncDraft, { isLoading: isBusinessGenerating }] =
    useBusinessSyncDraftMutation();
  const data = getAggregatedData();

  const { user } = useSelector((state: any) => state.user);
  const { data: draftData, isLoading: isDraftLoading } =
    useGetDraftBusinessPlanQuery({});
  console.log("Draft data:", draftData?.data);

  const handleGeneratePlan = async () => {
    try {
      console.log("Generating business plan with data:", draftData);
      const result = await businessSyncDraft({});

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
  if (isBusinessGenerating || isDraftLoading) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen">
      <SmartNavbar />
      <div className="bg-white flex flex-col items-center justify-center p-2 md:p-8 py-12">
        <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-[2rem] text-accent font-medium">
              Thank you for <br />
              your subscription
            </h2>
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
                    We’re excited to have you on board <br />
                    your journey to smarter planning starts now.
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

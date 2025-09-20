"use client";
import React, { useState, useEffect, useRef } from "react";
import GeneratedBusinessPlanforUser from "@/components/consultant/GeneratedBusinessPlanforUser";
import { useParams } from "next/navigation";
import { useGetSingleBusinessPlanQuery } from "@/redux/api/businessPlan/businessPlanApi";
import { useSubmitExpertReviewMutation } from "@/redux/api/expertReview/expertReviewApi";
import Navbar from "@/components/shared/Navbar/Navbar";
import FinancialDashboard from "@/components/generated-plans-graph/FinancialHighlights";
import MarketingDashboard from "@/components/generated-plans-graph/Marketing";
import OperationsDashboard from "@/components/generated-plans-graph/OperationPlan";
import DebtDashboard from "@/components/generated-plans-graph/DebtStructure";
import BalanceSheet from "@/components/generated-plans-graph/BalanceSheet";
import FinancialAnalysis from "@/components/generated-plans-graph/FinancalAnalysis";
import ProductionSalesForecast from "@/components/generated-plans-graph/ProductionSalesForecast";
import RatiosAnalysis from "@/components/generated-plans-graph/RatiosAnalysis";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

const ApprovedAiPlanPage = () => {
  const { id } = useParams();
  const { data: planInfo } = useGetSingleBusinessPlanQuery(id);
  const [submitExpertReview, { isLoading: isSubmitting }] =
    useSubmitExpertReviewMutation();
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);

  // Check if request was already submitted (from localStorage)
  useEffect(() => {
    if (id) {
      const requestKey = `expert_review_request_${id}`;
      const wasSubmitted = localStorage.getItem(requestKey);
      if (wasSubmitted === "true") {
        setIsRequestSubmitted(true);
      }
    }
  }, [id]);

  // State for countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Use useRef to store end time so it doesn't get recalculated on every render
  const endTimeRef = useRef<Date | null>(null);

  // Countdown effect
  useEffect(() => {
    // Only proceed if we have plan data
    if (!planInfo?.data?.createdAt) return;

    // Create a unique key for this plan's timer
    const timerKey = `plan_timer_${id}`;

    // Check if we already have a stored end time for this plan
    const storedEndTime = localStorage.getItem(timerKey);

    if (storedEndTime) {
      // Use the stored end time
      endTimeRef.current = new Date(storedEndTime);
      // console.log("Using stored end time:", endTimeRef.current.toLocaleString());
    } else {
      // Calculate end time from plan creation time (2 days from creation)
      const startTime = new Date(planInfo.data.createdAt);
      const endTime = new Date(startTime.getTime() + 48 * 60 * 60 * 1000); // 48 hours in milliseconds
      endTimeRef.current = endTime;

      // Store the end time in localStorage for persistence
      localStorage.setItem(timerKey, endTime.toISOString());
      // console.log("Stored new end time:", endTime.toLocaleString());
    }

    const timer = setInterval(() => {
      if (!endTimeRef.current) return;

      const now = new Date().getTime();
      const distance = endTimeRef.current.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });

        // Debug log every 10 seconds
        if (seconds % 10 === 0) {
          // console.log("Countdown:", { days, hours, minutes, seconds });
        }
      } else {
        // Time's up
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);

        // Clear the stored timer data when countdown finishes
        const timerKey = `plan_timer_${id}`;
        localStorage.removeItem(timerKey);
        // console.log("Countdown finished and timer data cleared!");
      }
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [planInfo?.data?.createdAt, id]); // Re-run if plan creation time or id changes

  // Handle expert review request
  const handleExpertReviewRequest = async () => {
    if (!id) {
      toast.error("Plan ID is missing. Please try again.");
      return;
    }

    if (isRequestSubmitted) {
      toast.info("Expert review request has already been submitted!");
      return;
    }

    try {
      const result = await submitExpertReview(id as string).unwrap();
      toast.success("Expert review request submitted successfully!");
      console.log("Expert review submitted:", result);
      setIsRequestSubmitted(true);

      // Store in localStorage to persist across page refreshes
      const requestKey = `expert_review_request_${id}`;
      localStorage.setItem(requestKey, "true");
    } catch (error: any) {
      console.error("Error submitting expert review:", error);
      toast.error(
        error?.data?.message || "Failed to submit expert review request"
      );
    }
  };

  const {
    balanceSheet = [],
    businessModel = "",
    businessOverview = "",
    cashFlowAnalysis = [],
    createdAt = "",
    debtStructure = [],
    executiveSummary = "",
    financialHighlights = [],
    fundingSources = "",
    id: planId = "",
    keyRatios = [],
    marketAnalysis = "",
    marketingSalesStrategy = "",
    netFinancialPosition = [],
    operatingCostBreakdown = [],
    operationsPlan = "",
    profitLossProjection = [],
    sectorStrategy = "",
    status = "",
    subscriptionType = "",
    updatedAt = "",
    userId = "",
    managementTeam = "",
    financialAnalysis = [],
    ratiosAnalysis = [],
    productionSalesForecast = [],
  } = planInfo?.data || {}; // default to empty object if `data` is undefined

  return (
    <div>
      <Navbar />
      <div id="businessplan" className="max-w-[1440px] mx-4 xl:mx-auto">
        {/* Header Section */}
        <header className="  px-4 py-6 sm:px-6 lg:px-8 pt-28">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="text-xl sm:text-2xl text-center font-semibold text-[#015BE9] mb-2">
              ✨ Congratulations! Your Business Plan Is Ready!
            </h2>
          </div>
        </header>

        {/* Expert Review Section */}
        <section className=" ">
          <div className="max-w-[1440px] mx-auto border-b border-gray-300">
            <div className="  px-4 py-8 md:px-4  ">
              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-6">
                {/* Left Content */}
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Expert's Review
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                    Reviewed by industry professionals to ensure accuracy,
                    strategy, and <br /> investor readiness. Actionable insights
                    included.
                  </p>
                  <button
                    onClick={handleExpertReviewRequest}
                    disabled={isSubmitting || isRequestSubmitted}
                    className={`px-6 py-3 rounded-lg transition-colors font-medium  ${
                      isSubmitting || isRequestSubmitted
                        ? "bg-primary/70 cursor-not-allowed text-white"
                        : "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                    }`}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : isRequestSubmitted
                      ? "Request Submitted ✓"
                      : "View Expert Review"}
                  </button>
                </div>

                {/* Right Icon */}
                <div className="flex-shrink-0">
                  <div className="w-44 h-44  rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                      <Image
                        src="/images/approve.png"
                        alt="Expert"
                        width={200}
                        height={200}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <GeneratedBusinessPlanforUser
          executiveSummary={executiveSummary}
          businessOverview={businessOverview}
          marketAnalysis={marketAnalysis}
          businessModel={businessModel}
          marketingSalesStrategy={marketingSalesStrategy}
          sectorStrategy={sectorStrategy}
          fundingSources={fundingSources}
          operationsPlan={operationsPlan}
          managementTeam={managementTeam}
          financialHighlights={financialHighlights}
          cashFlowAnalysis={cashFlowAnalysis}
          profitLossProjection={profitLossProjection}
          balanceSheet={balanceSheet}
          netFinancialPosition={netFinancialPosition}
          debtStructure={debtStructure}
          keyRatios={keyRatios}
          operatingCostBreakdown={operatingCostBreakdown}
          financialAnalysis={financialAnalysis}
          ratiosAnalysis={ratiosAnalysis}
          productionSalesForecast={productionSalesForecast}
        />
        <FinancialDashboard
          financialHighlights={financialHighlights}
          businessModel={businessModel}
          cashFlowAnalysis={cashFlowAnalysis}
        />
        <MarketingDashboard
          marketingSalesStrategy={marketingSalesStrategy}
          profitLossProjection={profitLossProjection}
          sectorStrategy={sectorStrategy}
        />
        <BalanceSheet
          balanceSheet={balanceSheet}
          netFinancialPosition={netFinancialPosition}
        />
        <DebtDashboard
          debtStructure={debtStructure}
          fundingSources={fundingSources}
        />
        <OperationsDashboard
          operationsPlan={operationsPlan}
          keyRatios={keyRatios}
          operatingCostBreakdown={operatingCostBreakdown}
        />
        
        {/* Financial Analysis Section */}
        {financialAnalysis && financialAnalysis.length > 0 && (
          <FinancialAnalysis financialAnalysis={financialAnalysis} />
        )}

        {/* Ratios Analysis Section */}
        {ratiosAnalysis && ratiosAnalysis.length > 0 && (
          <RatiosAnalysis ratiosAnalysis={ratiosAnalysis} />
        )}

        {/* Production Sales Forecast Section */}
        {productionSalesForecast && productionSalesForecast.length > 0 && (
          <ProductionSalesForecast 
            productionSalesForecast={productionSalesForecast}
            managementTeam={managementTeam}
          />
        )}
        
        <p className="text-base font-normal text-[#B6BEC8] text-center py-10">
          This plan document is generated and secured by [BusinessplanAI].{" "}
          <br />
          Unauthorized sharing or reproduction is strictly prohibited.
        </p>
      </div>
    </div>
  );
};

export default ApprovedAiPlanPage;

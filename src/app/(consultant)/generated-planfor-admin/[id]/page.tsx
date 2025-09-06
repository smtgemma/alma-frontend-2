"use client";
import React, { useState, useEffect, useRef } from "react";
import GeneratedBusinessPlanforAdmin, {
  demoBusinessPlanData,
} from "@/components/consultant/GeneratedBusinessPlanforAdmin";
import { useParams } from "next/navigation";
import { useAdminGetSingleBusinessPlanQuery } from "@/redux/api/admin/adminAPI";
import Navbar from "@/components/shared/Navbar/Navbar";
import FinancialDashboard from "@/components/generated-plans-graph/FinancialHighlights";
import FinancialDashboard2 from "@/components/generated-plans-graph/BalanceSheet";
import MarketingDashboard from "@/components/generated-plans-graph/Marketing";
import OperationsDashboard from "@/components/generated-plans-graph/OperationPlan";
import DebtDashboard from "@/components/generated-plans-graph/DebtStructure";
import BalanceSheet from "@/components/generated-plans-graph/BalanceSheet";

const GeneratedPlanForAdminPage = () => {
  const { id } = useParams();
  const {
    data: planInfo,
    error,
    isLoading,
  } = useAdminGetSingleBusinessPlanQuery(id);

  // State for countdown timer - MUST be at the top level
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Use useRef to store end time so it doesn't get recalculated on every render - MUST be at the top level
  const endTimeRef = useRef<Date | null>(null);

  // Countdown effect - MUST be at the top level
  useEffect(() => {
    // Calculate end time only once (2 days from now)
    if (!endTimeRef.current) {
      let startTime: Date;

      // If we have plan creation time, use that as start time
      if (planInfo?.data?.createdAt) {
        startTime = new Date(planInfo.data.createdAt);
        // console.log("Using plan creation time:", startTime.toLocaleString());
      } else {
        // Fallback to current time
        startTime = new Date();
        // console.log(
        //   "Using current time as fallback:",
        //   startTime.toLocaleString()
        // );
      }

      const endTime = new Date(startTime.getTime() + 48 * 60 * 60 * 1000); // 48 hours in milliseconds
      endTimeRef.current = endTime;
      // console.log("Countdown started, end time:", endTime.toLocaleString());
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
        // console.log("Countdown finished!");
      }
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [planInfo?.data?.createdAt]); // Re-run if plan creation time changes

  // Extract data from planInfo - MUST be at the top level
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
  } = planInfo?.data || {}; // default to empty object if `data` is undefined

  // Render loading state
  if (isLoading) {
    return (
      <div>
        {/* <Navbar /> */}
        <div className="max-w-[1440px] mx-4 xl:mx-auto pt-28">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading business plan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div>
        {/* <Navbar /> */}
        <div className="max-w-[1440px] mx-4 xl:mx-auto pt-28">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Error Loading Plan
              </h2>
              <p className="text-gray-600 mb-4">
                Failed to load business plan data. Please try again.
              </p>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render main content
  return (
    <div>
      <Navbar />
      <div id="businessplan" className="max-w-[1440px] mx-4 xl:mx-auto">
        <header className="   py-6 ">
          <div className="">
            <div className="flex justify-between mt-14">
              {/* Subtitle and Note */}
              <div className="mt-4 sm:mt-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                  Generated web version only for admin to view
                </h2>
                <p className="text-red-600 text-sm font-medium">
                  *The users will only be able to view it after your approval*
                </p>
              </div>

              {/* Time Left Section */}
              <div className="flex flex-col items-start space-x-4 space-y-2 mt-4 ">
                <div>
                  <span className="text-xl font-medium text-primary-text">
                    Time Left
                  </span>
                </div>
                <div className="flex space-x-2">
                  <div className="flex items-center">
                    <div className="border-b-2 border-red-500 px-1 py-2">
                      <span className="text-lg font-semibold text-gray-800 bg-gray-100 px-3 py-2 rounded-lg ">
                        {timeLeft.days.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600 ml-2">
                      Days
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="border-b-2 border-red-500 px-1 py-2">
                      <span className="text-lg font-semibold text-gray-800 bg-gray-100 px-3 py-2 rounded-lg ">
                        {timeLeft.hours.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600 ml-2">
                      Hours
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="border-b-2 border-red-500 px-1 py-2">
                      <span className="text-lg font-semibold text-gray-800 bg-gray-100 px-3 py-2 rounded-lg ">
                        {timeLeft.minutes.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600 ml-2">
                      Minutes
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="border-b-2 border-red-500 px-1 py-2">
                      <span className="text-lg font-semibold text-gray-800 bg-gray-100 px-3 py-2 rounded-lg ">
                        {timeLeft.seconds.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600 ml-2">
                      Seconds
                    </span>
                    {/* Will delete this later */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <GeneratedBusinessPlanforAdmin
          executiveSummary={executiveSummary}
          businessOverview={businessOverview}
          marketAnalysis={marketAnalysis}
          businessModel={businessModel}
          marketingSalesStrategy={marketingSalesStrategy}
          sectorStrategy={sectorStrategy}
          fundingSources={fundingSources}
          operationsPlan={operationsPlan}
          planId={planId}
          onPlanUpdate={(updatedData) => {
            // Handle plan update if needed
            console.log("Plan updated:", updatedData);
          }}
          financialHighlights={financialHighlights}
          cashFlowAnalysis={cashFlowAnalysis}
          profitLossProjection={profitLossProjection}
          balanceSheet={balanceSheet}
          netFinancialPosition={netFinancialPosition}
          debtStructure={debtStructure}
          keyRatios={keyRatios}
          operatingCostBreakdown={operatingCostBreakdown}
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
        <p className="text-base font-normal text-[#B6BEC8] text-center py-10">
          This plan document is generated and secured by [BusinessplanAI].{" "}
          <br />
          Unauthorized sharing or reproduction is strictly prohibited.
        </p>
      </div>
    </div>
  );
};

export default GeneratedPlanForAdminPage;
// this
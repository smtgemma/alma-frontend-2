"use client";
import React, { useState, useEffect, useRef } from "react";
import GeneratedBusinessPlanforUser from "@/components/consultant/GeneratedBusinessPlanforUser";
import { useParams } from "next/navigation";
import { useGetSingleBusinessPlanQuery } from "@/redux/api/businessPlan/businessPlanApi";
import Navbar from "@/components/shared/Navbar/Navbar";
import FinancialDashboard from "@/components/generated-plans-graph/FinancialHighlights";
import MarketingDashboard from "@/components/generated-plans-graph/Marketing";
import OperationsDashboard from "@/components/generated-plans-graph/OperationPlan";
import DebtDashboard from "@/components/generated-plans-graph/DebtStructure";
import BalanceSheet from "@/components/generated-plans-graph/BalanceSheet";
import Image from "next/image";
import Link from "next/link";

const ApprovedAiPlanPage = () => {
  const { id } = useParams();
  const { data: planInfo } = useGetSingleBusinessPlanQuery(id);

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
                  <Link href="/request-consultation">
                    <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                      View Expert Review
                    </button>
                  </Link>
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

export default ApprovedAiPlanPage;

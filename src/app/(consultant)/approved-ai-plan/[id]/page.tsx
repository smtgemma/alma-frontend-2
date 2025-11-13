"use client";
import React, { useState, useEffect, useRef } from "react";
import GeneratedBusinessPlanforUser from "@/components/consultant/GeneratedBusinessPlanforUser";
import { useParams } from "next/navigation";
import { useGetSingleBusinessPlanQuery } from "@/redux/api/businessPlan/businessPlanApi";
import { useSubmitExpertReviewMutation } from "@/redux/api/expertReview/expertReviewApi";
import Navbar from "@/components/shared/Navbar/Navbar";
import FinancialDashboard from "@/components/generated-plans-graph/FinancialHighlights";

import OperationsDashboard from "@/components/generated-plans-graph/OperationPlan";
import DebtDashboard from "@/components/generated-plans-graph/DebtStructure";
import BalanceSheet from "@/components/generated-plans-graph/BalanceSheet";
import FinancialAnalysis from "@/components/generated-plans-graph/FinancalAnalysis";
import ProductionSalesForecast from "@/components/generated-plans-graph/ProductionSalesForecast";
import RatiosAnalysis from "@/components/generated-plans-graph/RatiosAnalysis";
import Image from "next/image";
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
      toast.error("ID del piano mancante. Riprova.");
      return;
    }

    if (isRequestSubmitted) {
      toast.info("Richiesta di revisione esperta già inviata!");
      return;
    }

    try {
      const result = await submitExpertReview(id as string).unwrap();
      toast.success("Richiesta di revisione esperta inviata con successo!");
      console.log("Expert review submitted:", result);
      setIsRequestSubmitted(true);

      // Store in localStorage to persist across page refreshes
      const requestKey = `expert_review_request_${id}`;
      localStorage.setItem(requestKey, "true");
    } catch (error: any) {
      console.error("Error submitting expert review:", error);
      toast.error(
        error?.data?.message ||
          "Impossibile inviare la richiesta di revisione esperta"
      );
    }
  };

  const {
    balanceSheet = [],
    balanceSheetAnalysis = "",
    businessModel = "",
    businessOverview = "",
    cashFlowAnalysisData = [],
    cashFlowAnalysis = "",
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

  // Map cashFlowAnalysisData to cashFlowAnalysis for compatibility
  const cashFlowAnalysisArray = cashFlowAnalysisData || [];

  return (
    <div>
      <Navbar />
      <div id="businessplan" className="max-w-[1440px] mx-4 xl:mx-auto">
        {/* Header Section */}
        <header className="  px-4 py-6 sm:px-6 lg:px-8 pt-28">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="text-xl sm:text-2xl text-center font-semibold text-[#015BE9] mb-2">
              ✨ Congratulazioni! Il Tuo Piano Aziendale È Pronto!
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
                    Revisione dell'Esperto
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                    Revisionato da professionisti del settore per garantire
                    precisione, strategia e <br /> preparazione agli
                    investitori. Inclusi approfondimenti pratici.
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
                      ? "Invio in corso..."
                      : isRequestSubmitted
                      ? "Richiesta Inviata ✓"
                      : "Visualizza Revisione Esperta"}
                  </button>
                </div>

                {/* Right Icon */}
                <div className="flex-shrink-0">
                  <div className="w-44 h-44  rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                      <Image
                        src="/images/approve.png"
                        alt="Esperto"
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
          cashFlowAnalysis={cashFlowAnalysisArray}
          profitLossProjection={profitLossProjection}
          balanceSheet={balanceSheet}
          netFinancialPosition={netFinancialPosition}
          debtStructure={debtStructure}
          keyRatios={keyRatios}
          operatingCostBreakdown={operatingCostBreakdown}
          financialAnalysis={financialAnalysis}
          ratiosAnalysis={ratiosAnalysis}
          productionSalesForecast={productionSalesForecast}
          balanceSheetAnalysis={balanceSheetAnalysis}
        />
        <ProductionSalesForecast
          productionSalesForecast={productionSalesForecast}
        />
        <OperationsDashboard
          operationsPlan={operationsPlan}
          keyRatios={keyRatios}
          operatingCostBreakdown={operatingCostBreakdown}
        />

        {balanceSheet?.length > 0 && (
          <BalanceSheet
            balanceSheet={balanceSheet}
            netFinancialPosition={netFinancialPosition}
            balanceSheetAnalysis={balanceSheetAnalysis}
          />
        )}

        <DebtDashboard debtStructure={debtStructure} />
        <FinancialAnalysis financialAnalysis={financialAnalysis} />
        <FinancialDashboard
          financialHighlights={financialHighlights}
          cashFlowAnalysis={cashFlowAnalysisArray}
          cashFlowAnalysisText={cashFlowAnalysis}
        />
        <RatiosAnalysis ratiosAnalysis={ratiosAnalysis} />

        <p className="text-base font-normal text-[#B6BEC8] text-center py-10">
          Questo documento di piano è generato e protetto da [BusinessplanAI].{" "}
          <br />
          La condivisione o riproduzione non autorizzata è severamente vietata.
        </p>
      </div>
    </div>
  );
};

export default ApprovedAiPlanPage;

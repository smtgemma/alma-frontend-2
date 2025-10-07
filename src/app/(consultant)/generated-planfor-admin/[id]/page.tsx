"use client";
import React, { useState, useEffect, useRef } from "react";
import GeneratedBusinessPlanforAdmin, {
  demoBusinessPlanData,
} from "@/components/consultant/GeneratedBusinessPlanforAdmin";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useAdminGetSingleBusinessPlanQuery } from "@/redux/api/admin/adminAPI";
import Navbar from "@/components/shared/Navbar/Navbar";
import FinancialDashboard from "@/components/generated-plans-graph/FinancialHighlights";
import FinancialDashboard2 from "@/components/generated-plans-graph/BalanceSheet";
import MarketingDashboard from "@/components/generated-plans-graph/Marketing";
import OperationsDashboard from "@/components/generated-plans-graph/OperationPlan";
import DebtDashboard from "@/components/generated-plans-graph/DebtStructure";
import BalanceSheet from "@/components/generated-plans-graph/BalanceSheet";
import FinancialAnalysis from "@/components/generated-plans-graph/FinancalAnalysis";
import RatiosAnalysis from "@/components/generated-plans-graph/RatiosAnalysis";
import ProductionSalesForecast from "@/components/generated-plans-graph/ProductionSalesForecast";
import { RiEdit2Fill } from "react-icons/ri";
import { GoDownload } from "react-icons/go";
import { IoIosShareAlt } from "react-icons/io";
import { generateEmpathyPDF } from "@/components/generated-plans-graph/pdf-downloader/PdfDownload";
import { generateWordDocument } from "@/components/consultant/DocDownload";
import DownloadOptionsModal from "@/components/consultant/DownloadOptionsModal";
import SocialShareModal from "@/components/shared/SocialShareModal";
import { SmartFormProvider } from "@/components/ai-smart-form/SmartFormContext";

const GeneratedPlanForAdminPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: planInfo,
    error,
    isLoading,
  } = useAdminGetSingleBusinessPlanQuery(id);

  // Floating button states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSocialShareModalOpen, setIsSocialShareModalOpen] = useState(false);

  // Check if coming from expert review route using URL parameter
  const isFromExpertReview =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("from") === "expert-review";

  // Only show Share/Download if coming from Expert Review
  const shouldShowShareDownload = isFromExpertReview;

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

  // Extract data from planInfo - MUST be at the top level
  const {
    balanceSheet = [],
    businessModel = "",
    businessOverview = "",
    cashFlowAnalysisData = [],
    cashFlowAnalysis = "",
    createdAt = "",
    debtStructure = [],
    executiveSummary = "",
    financialAnalysis = [],
    financialHighlights = [],
    fundingSources = "",
    id: planId = "",
    keyRatios = [],
    managementTeam = "",
    marketAnalysis = "",
    marketingSalesStrategy = "",
    netFinancialPosition = [],
    operatingCostBreakdown = [],
    operationsPlan = "",
    productionSalesForecast = [],
    profitLossProjection = [],
    ratiosAnalysis = [],
    sectorStrategy = "",
    status = "",
    subscriptionType = "",
    updatedAt = "",
    userId = "",
  } = planInfo?.data || {}; // default to empty object if `data` is undefined

  // Map cashFlowAnalysisData to cashFlowAnalysis for compatibility
  const cashFlowAnalysisArray = cashFlowAnalysisData || [];

  // Floating button handlers
  const handleEdit = () => {
    if (planId) {
      router.push(`/update-business-plan?id=${planId}`);
    } else {
      router.push("/update-business-plan");
    }
  };

  const handleDownloadClick = () => {
    setIsModalOpen(true);
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleSocialShareClick = () => {
    setIsSocialShareModalOpen(true);
  };

  const handleDownloadPDF = () => {
    // Use the original PDF download functionality
    generateEmpathyPDF("businessplan");
  };

  const handleDownloadDOC = () => {
    // Use the comprehensive Word document download functionality
    generateWordDocument({
      executiveSummary: executiveSummary,
      businessOverview: businessOverview,
      marketAnalysis: marketAnalysis,
      businessModel: businessModel,
      marketingSalesStrategy: marketingSalesStrategy,
      sectorStrategy: sectorStrategy,
      fundingSources: fundingSources,
      operationsPlan: operationsPlan,
      managementTeam: managementTeam,
      financialHighlights,
      cashFlowAnalysis: cashFlowAnalysisArray,
      profitLossProjection,
      balanceSheet,
      netFinancialPosition,
      debtStructure,
      keyRatios,
      operatingCostBreakdown,
      financialAnalysis,
      ratiosAnalysis,
      productionSalesForecast,
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div>
        {/* <Navbar /> */}
        <div className="max-w-[1440px] mx-4 xl:mx-auto pt-28">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Caricamento piano aziendale...</p>
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
        <div className="max-w-[1440px] mx-auto xl:mx-auto pt-28">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Errore nel Caricamento del Piano
              </h2>
              <p className="text-gray-600 mb-4">
                Impossibile caricare i dati del piano aziendale. Riprova.
              </p>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Torna Indietro
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
      <div
        id="businessplan"
        className="max-w-[1440px] mx-auto xl:mx-auto px-4 md:px-8 overflow-x-hidden"
      >
        <header className="   py-6 ">
          <div className="">
            <div className="flex flex-col lg:flex-row justify-between mt-14">
              {/* Subtitle and Note */}
              <div className="mt-4 sm:mt-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                  Versione web generata solo per la visualizzazione
                  dell'amministratore
                </h2>
                <p className="text-red-600 text-sm font-medium">
                  *Gli utenti potranno visualizzarlo solo dopo la tua
                  approvazione*
                </p>
              </div>

              {/* Time Left Section */}
              <div className="flex flex-col items-start space-y-2 mt-4">
                <div>
                  <span className="text-lg sm:text-xl font-medium text-primary-text">
                    Tempo Rimanente
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center">
                    <div className="border-b-2 border-red-500 px-1 py-1 sm:py-2">
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                        {timeLeft.days.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-600 ml-1 sm:ml-2">
                      Giorni
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="border-b-2 border-red-500 px-1 py-1 sm:py-2">
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                        {timeLeft.hours.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-600 ml-1 sm:ml-2">
                      Ore
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="border-b-2 border-red-500 px-1 py-1 sm:py-2">
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                        {timeLeft.minutes.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-600 ml-1 sm:ml-2">
                      Minuti
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="border-b-2 border-red-500 px-1 py-1 sm:py-2">
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                        {timeLeft.seconds.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-600 ml-1 sm:ml-2">
                      Secondi
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
          managementTeam={managementTeam}
          planId={planId}
          onPlanUpdate={(updatedData) => {
            // Handle plan update if needed
            console.log("Plan updated:", updatedData);
          }}
          financialHighlights={financialHighlights}
          cashFlowAnalysis={cashFlowAnalysisArray}
          cashFlowAnalysisText={cashFlowAnalysis}
          profitLossProjection={profitLossProjection}
          balanceSheet={balanceSheet}
          netFinancialPosition={netFinancialPosition}
          debtStructure={debtStructure}
          keyRatios={keyRatios}
          operatingCostBreakdown={operatingCostBreakdown}
          onEdit={handleEdit}
          onDownload={handleDownloadClick}
          onSocialShare={handleSocialShareClick}
          shouldShowShareDownload={shouldShowShareDownload}
        />
        <ProductionSalesForecast
          productionSalesForecast={productionSalesForecast}
        />
        <OperationsDashboard
          operationsPlan={operationsPlan}
          keyRatios={keyRatios}
          operatingCostBreakdown={operatingCostBreakdown}
        />
        <MarketingDashboard
          marketingSalesStrategy={marketingSalesStrategy}
          profitLossProjection={profitLossProjection}
          sectorStrategy={sectorStrategy}
        />
        <SmartFormProvider>
          <BalanceSheet
            balanceSheet={balanceSheet}
            netFinancialPosition={netFinancialPosition}
          />
        </SmartFormProvider>
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

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 flex justify-end gap-2 sm:gap-4 cursor-pointer z-50">
        {shouldShowShareDownload ? (
          // Share and Download buttons for expert review
          <>
            <button
              onClick={handleSocialShareClick}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center text-white cursor-pointer"
              aria-label="Share business plan"
            >
              <IoIosShareAlt className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleDownloadClick}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center text-white cursor-pointer"
              aria-label="Download business plan"
            >
              <GoDownload className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        ) : (
          // Edit button for other routes
          <button
            onClick={handleEdit}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center text-white cursor-pointer"
            aria-label="Edit business plan"
          >
            <RiEdit2Fill className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Download Options Modal */}
      <DownloadOptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownloadPDF={handleDownloadPDF}
        onDownloadDOC={handleDownloadDOC}
      />

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={isSocialShareModalOpen}
        onClose={() => setIsSocialShareModalOpen(false)}
        url={typeof window !== "undefined" ? window.location.href : ""}
        title="Pianifico Suite"
        description="Check out this amazing business plan generated by AI! This comprehensive plan includes executive summary, market analysis, and financial projections."
      />

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Expert's Review
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Enter expert's email address to send the selected plan for review
              and feedback.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address:
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedPlanForAdminPage;
// this

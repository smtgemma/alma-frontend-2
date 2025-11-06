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
import CountdownTimer from "@/components/common/CountdownTimer";

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

  // End date for countdown
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!planInfo?.data?.createdAt) return;
    const timerKey = `plan_timer_${id}`;
    const storedEndTime = typeof window !== "undefined" ? localStorage.getItem(timerKey) : null;
    if (storedEndTime) {
      setEndDate(new Date(storedEndTime));
    } else {
      const startTime = new Date(planInfo.data.createdAt);
      const endTime = new Date(startTime.getTime() + 48 * 60 * 60 * 1000);
      setEndDate(endTime);
      if (typeof window !== "undefined") {
        localStorage.setItem(timerKey, endTime.toISOString());
      }
    }
  }, [planInfo?.data?.createdAt, id]);

  // Extract data from planInfo - MUST be at the top level
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
    user_input = null, // Add user_input data extraction
  } = planInfo?.data || {}; // default to empty object if `data` is undefined
  
  // Generate enhanced content from user_input data when available
  const generateEnhancedContent = () => {
    if (!user_input?.user_input) return null;
    
    const userInputs = user_input.user_input;
    const findAnswer = (questionKeyword: string): string => {
      const input = userInputs.find((item: any) => 
        item.question.toLowerCase().includes(questionKeyword.toLowerCase())
      );
      return input?.answer || "";
    };
    
    const businessName = findAnswer("business name") || "La nostra azienda";
    const activity = findAnswer("activity") || "attività commerciale";
    const location = findAnswer("state") || findAnswer("city") || findAnswer("located");
    const stage = findAnswer("stage") || findAnswer("currently in");
    const industry = findAnswer("industry") || "settore di riferimento";
    const uniqueValue = findAnswer("unique") || findAnswer("makes your");
    const mission = findAnswer("mission");
    const businessGoals = findAnswer("business goals");
    
    // Enhanced executive summary from form data
    const enhancedExecutiveSummary = `${businessName} rappresenta un'opportunità di business innovativa nel settore ${activity}${location ? `, operante in ${location}` : ''}.

${stage ? `L'azienda si trova attualmente nella fase: ${stage}.` : ''}

${uniqueValue ? `Ciò che ci distingue nel mercato è ${uniqueValue}.` : ''}

${industry ? `Operiamo nel settore ${industry}, ` : ''}con un approccio strategico mirato alla crescita sostenibile e alla creazione di valore per i nostri stakeholder.`;
    
    // Enhanced business overview
    const enhancedBusinessOverview = `${businessName} è un'azienda specializzata in ${activity}${location ? `, con sede in ${location}` : ''}.

${mission ? `La nostra missione è ${mission}.` : ''}

${businessGoals ? `I nostri principali obiettivi aziendali includono: ${businessGoals}.` : ''}

La nostra organizzazione è strutturata per fornire soluzioni di alta qualità, mantenendo sempre al centro le esigenze dei clienti e la sostenibilità del business.`;
    
    // Enhanced market analysis
    const enhancedMarketAnalysis = `${industry ? `La nostra analisi di mercato si concentra sul settore ${industry}.` : 'La nostra analisi di mercato evidenzia opportunità significative nel nostro settore di riferimento.'}

${findAnswer("ideal client") ? `Il nostro target principale è rappresentato da: ${findAnswer("ideal client")}.` : ''}

${findAnswer("marketing plan") || findAnswer("reach them") ? `La strategia di marketing prevede: ${findAnswer("marketing plan") || findAnswer("reach them")}.` : ''}

Il mercato presenta opportunità di crescita che intendiamo sfruttare attraverso la nostra proposta di valore unica e un approccio customer-centric.`;
    
    return {
      enhancedExecutiveSummary,
      enhancedBusinessOverview, 
      enhancedMarketAnalysis,
      userInputs
    };
  };
  
  const enhancedContent = generateEnhancedContent();

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
      balanceSheetAnalysis,
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
              {endDate && <CountdownTimer endDate={endDate} />}
              </div>
            </div>
          </div>
        </header>
        <GeneratedBusinessPlanforAdmin
          executiveSummary={enhancedContent?.enhancedExecutiveSummary || executiveSummary}
          businessOverview={enhancedContent?.enhancedBusinessOverview || businessOverview}
          marketAnalysis={enhancedContent?.enhancedMarketAnalysis || marketAnalysis}
          businessModel={businessModel}
          marketingSalesStrategy={marketingSalesStrategy}
          sectorStrategy={sectorStrategy}
          fundingSources={fundingSources}
          operationsPlan={operationsPlan}
          managementTeam={managementTeam}
          planId={planId}
          // userInputData={enhancedContent?.userInputs} // Pass user input data
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
            balanceSheetAnalysis={balanceSheetAnalysis}
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

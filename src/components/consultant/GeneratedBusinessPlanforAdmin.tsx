"use client";
import React, { useState } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import { GoDownload } from "react-icons/go";
import { IoIosShareAlt } from "react-icons/io";
import { useRouter, usePathname } from "next/navigation";
import SendPlanToExpert from "../dashboard/adminDashboard/SendPlanToExpert";
import AdminEditBusinessPlan from "./AdminEditBusinessPlan";
import { generateEmpathyPDF } from "../generated-plans-graph/pdf-downloader/PdfDownload";
import { generateWordDocument } from "./DocDownload";
import DownloadOptionsModal from "./DownloadOptionsModal";
import SocialShareModal from "../shared/SocialShareModal";
import Link from "next/link";

interface GeneratedBusinessPlanforAdminProps {
  executiveSummary: string;
  businessOverview: string;
  marketAnalysis: string;
  businessModel?: string;
  marketingSalesStrategy?: string;
  sectorStrategy?: string;
  fundingSources?: string;
  operationsPlan?: string;
  managementTeam?: string;
  planId?: string; // Add plan ID for edit functionality
  onPlanUpdate?: (updatedData: any) => void; // Callback for plan updates
  financialHighlights?: any[];
  cashFlowAnalysis?: any[];
  profitLossProjection?: any[];
  balanceSheet?: any[];
  netFinancialPosition?: any[];
  debtStructure?: any[];
  keyRatios?: any[];
  operatingCostBreakdown?: any[];
  financialAnalysis?: any[];
  ratiosAnalysis?: any[];
  productionSalesForecast?: any[];
  cashFlowAnalysisText?: string; // Add missing field
}

const GeneratedBusinessPlanforAdmin = ({
  executiveSummary,
  businessOverview,
  marketAnalysis,
  businessModel = "",
  marketingSalesStrategy = "",
  sectorStrategy = "",
  fundingSources = "",
  operationsPlan = "",
  managementTeam = "",
  planId,
  onPlanUpdate,
  financialHighlights = [],
  cashFlowAnalysis = [],
  profitLossProjection = [],
  balanceSheet = [],
  netFinancialPosition = [],
  debtStructure = [],
  keyRatios = [],
  operatingCostBreakdown = [],
  financialAnalysis = [],
  ratiosAnalysis = [],
  productionSalesForecast = [],
  cashFlowAnalysisText = "",
}: GeneratedBusinessPlanforAdminProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSocialShareModalOpen, setIsSocialShareModalOpen] = useState(false);

  // Check if coming from expert review route using URL parameter
  const isFromExpertReview =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("from") === "expert-review";

  // Only show Share/Download if coming from Expert Review
  const shouldShowShareDownload = isFromExpertReview;
  const [currentPlanData, setCurrentPlanData] = useState({
    executiveSummary,
    businessOverview,
    marketAnalysis,
    businessModel,
    marketingSalesStrategy,
    sectorStrategy,
    fundingSources,
    operationsPlan,
    managementTeam,
  });

  const handleEdit = () => {
    if (planId) {
      router.push(`/update-business-plan?id=${planId}`);
    } else {
      router.push("/update-business-plan");
    }
  };

  const handleUpdate = (updatedData: any) => {
    console.log("Plan updated with data:", updatedData);
    setCurrentPlanData(updatedData);
    setIsEditing(false);
    if (onPlanUpdate) {
      onPlanUpdate(updatedData);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
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
      executiveSummary: currentPlanData.executiveSummary,
      businessOverview: currentPlanData.businessOverview,
      marketAnalysis: currentPlanData.marketAnalysis,
      businessModel: currentPlanData.businessModel,
      marketingSalesStrategy: currentPlanData.marketingSalesStrategy,
      sectorStrategy: currentPlanData.sectorStrategy,
      fundingSources: currentPlanData.fundingSources,
      operationsPlan: currentPlanData.operationsPlan,
      managementTeam: currentPlanData.managementTeam || managementTeam,
      financialHighlights,
      cashFlowAnalysis,
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

  // If editing mode, show edit component
  if (isEditing && planId) {
    return (
      <AdminEditBusinessPlan
        planData={{
          id: planId,
          ...currentPlanData,
        }}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-2 py-8 ">
        <div className="space-y-8">
          {/* Business Overview Section */}
          <section className=" ">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              1. Sintesi
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl text-justify">
                {currentPlanData.executiveSummary}
              </p>
            </div>
          </section>

          {/* Business Origins Section */}
          <section className="">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              2. Panoramica aziendale
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl  text-justify">
                {currentPlanData.businessOverview}
              </p>
            </div>
          </section>

          {/* Management Team */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            3. Management Team
          </h2>
          <div className="">
            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-justify">
              {currentPlanData.managementTeam}
            </p>
          </div>

          {/* Business Model */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            4. Modello di business
          </h2>
          <div className="">
            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-justify">
              {currentPlanData.businessModel}
            </p>
          </div>

          {/* Competitive Advantage Section */}
          <section className="">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              5. Analisi di mercato
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl text-justify">
                {currentPlanData.marketAnalysis}
              </p>
            </div>
          </section>

          {/* Funding Sources */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            6. Fonti di finanziamento
          </h2>
          <div className="">
            <div className="prose max-w-none">
              {(() => {
                // Function to clean and parse corrupted fundingSources data
                const cleanFundingSources = (data: any) => {
                  console.log("🔍 Raw fundingSources data:", data);
                  console.log("🔍 Data type:", typeof data);

                  if (typeof data === "object" && data !== null) {
                    console.log("✅ Data is already an object:", data);
                    return data;
                  }

                  if (typeof data === "string") {
                    console.log("📝 Data is a string, attempting to parse...");
                    try {
                      // Try to parse as JSON first
                      const parsed = JSON.parse(data);
                      if (typeof parsed === "object" && parsed !== null) {
                        console.log("✅ Successfully parsed as JSON:", parsed);
                        return parsed;
                      }
                    } catch (e) {
                      console.log(
                        "❌ JSON parsing failed, checking for corrupted format..."
                      );
                      // If JSON parsing fails, check if it's the corrupted format
                      if (data.includes('"0":') && data.includes('"1":')) {
                        console.log(
                          "🔍 Detected corrupted format, attempting extraction..."
                        );
                        // This is the corrupted format, try to extract the actual data
                        try {
                          // Look for the actual JSON data after the corrupted part
                          // Try to find both initialInvestment and fromHome
                          const jsonMatch = data.match(/\{.*"fromHome":\d+\}/);
                          if (jsonMatch) {
                            console.log("✅ Found JSON match:", jsonMatch[0]);
                            const cleanData = JSON.parse(jsonMatch[0]);
                            console.log("✅ Parsed clean data:", cleanData);
                            return cleanData;
                          }

                          // If that doesn't work, try to extract from the corrupted string directly
                          // Look for the pattern that contains both fields
                          const fullJsonMatch = data.match(
                            /\{.*"initialInvestment".*"fromHome".*\}/
                          );
                          if (fullJsonMatch) {
                            console.log(
                              "✅ Found full JSON match:",
                              fullJsonMatch[0]
                            );
                            const cleanData = JSON.parse(fullJsonMatch[0]);
                            console.log(
                              "✅ Parsed full clean data:",
                              cleanData
                            );
                            return cleanData;
                          }

                          // As a last resort, try to reconstruct the data from the corrupted string
                          // Extract the fromHome value
                          const fromHomeMatch = data.match(/"fromHome":(\d+)/);
                          const fromHome = fromHomeMatch
                            ? parseInt(fromHomeMatch[1])
                            : 0;
                          console.log("🔍 Extracted fromHome:", fromHome);

                          // Try to extract initialInvestment text from the corrupted string
                          // Look for the pattern that shows the actual text
                          const textMatch = data.match(
                            /"initialInvestment":"([^"]+)"/
                          );
                          const initialInvestment = textMatch
                            ? textMatch[1]
                            : "Investment";
                          console.log(
                            "🔍 Extracted initialInvestment:",
                            initialInvestment
                          );

                          const reconstructed = {
                            initialInvestment: initialInvestment,
                            fromHome: fromHome,
                          };
                          console.log("✅ Reconstructed data:", reconstructed);
                          return reconstructed;
                        } catch (e) {
                          console.error(
                            "❌ Failed to parse corrupted fundingSources:",
                            e
                          );
                        }
                      }
                    }
                  }

                  console.log("❌ No valid data found, returning null");
                  return null;
                };

                const cleanData = cleanFundingSources(
                  currentPlanData.fundingSources
                );

                console.log("🎯 Final cleanData:", cleanData);
                console.log("🎯 cleanData type:", typeof cleanData);
                console.log(
                  "🎯 cleanData.initialInvestment:",
                  cleanData?.initialInvestment
                );
                console.log("🎯 cleanData.fromHome:", cleanData?.fromHome);

                if (cleanData && typeof cleanData === "object") {
                  return (
                    <div className="space-y-4">
                      {cleanData.initialInvestment && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Initial Investment Source:
                          </h3>
                          <p className="text-gray-700 text-base">
                            {cleanData.initialInvestment}
                          </p>
                        </div>
                      )}
                      {cleanData.fromHome && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Investment Amount:
                          </h3>
                          <p className="text-gray-700 text-base">
                            ${cleanData.fromHome.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl text-justify">
                      No funding information available
                    </p>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className=" max-w-[1440px] mx-auto fixed bottom-8 right-8 flex justify-end gap-4 cursor-pointer">
        {shouldShowShareDownload ? (
          // Share and Download buttons for expert review
          <>
            <button
              onClick={handleSocialShareClick}
              className="w-14 h-14 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center text-white cursor-pointer"
              aria-label="Share business plan"
            >
              <IoIosShareAlt className="w-6 h-6" />
            </button>
            <button
              onClick={handleDownloadClick}
              className="w-14 h-14 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center text-white cursor-pointer"
              aria-label="Download business plan"
            >
              <GoDownload className="w-6 h-6" />
            </button>
          </>
        ) : (
          // Edit button for other routes
          <button
            onClick={handleEdit}
            className="w-14 h-14 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center text-white cursor-pointer"
            aria-label="Edit business plan"
          >
            <RiEdit2Fill className="w-6 h-6" />
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

export default GeneratedBusinessPlanforAdmin;

// Example usage and demo data
export const demoBusinessPlanData = {
  businessOverview:
    "Our innovative tech startup focuses on revolutionizing the way businesses handle customer relationships through AI-powered automation. We combine cutting-edge machine learning algorithms with intuitive user interfaces to create seamless customer experiences that drive growth and retention.",
  businessOrigins:
    "Founded in 2023 by a team of experienced entrepreneurs and AI researchers, our company emerged from the growing need for businesses to leverage artificial intelligence in customer service. After witnessing the inefficiencies in traditional CRM systems, we set out to create a solution that would transform how companies interact with their customers.",
  competitiveAdvantage:
    "Our unique approach combines proprietary AI algorithms with industry-specific knowledge bases, allowing us to provide personalized solutions that adapt to each business's unique needs. Unlike competitors who offer one-size-fits-all solutions, our platform learns and evolves with your business, continuously improving performance and ROI.",
};

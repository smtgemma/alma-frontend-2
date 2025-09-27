"use client";
import React, { useState } from "react";
import AdminEditBusinessPlan from "./AdminEditBusinessPlan";

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
  // Floating button handlers passed from parent
  onEdit?: () => void;
  onDownload?: () => void;
  onSocialShare?: () => void;
  shouldShowShareDownload?: boolean;
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
  onEdit,
  onDownload,
  onSocialShare,
  shouldShowShareDownload = false,
}: GeneratedBusinessPlanforAdminProps) => {
  const [isEditing, setIsEditing] = useState(false);
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

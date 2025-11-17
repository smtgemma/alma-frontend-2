"use client";
import React, { useState } from "react";
import AdminEditBusinessPlan from "./AdminEditBusinessPlan";
import FundingSources from "../generated-plans-graph/FundingSources";

interface GeneratedBusinessPlanforAdminProps {
  executiveSummary: string;
  businessOverview: string;
  marketAnalysis: string;
  businessModel?: string;
  marketingSalesStrategy?: string;
  sectorStrategy?: string;
  fundingSources?: any;
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
              1. Sintesi esecutiva
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
            3. Team di gestione
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
          <FundingSources fundingSources={currentPlanData.fundingSources} />
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

"use client";
import React, { useState } from "react";
import { GoDownload } from "react-icons/go";
import { generateEmpathyPDF } from "../generated-plans-graph/pdf-downloader/PdfDownload";
import { generateWordDocument } from "./DocDownload";
import DownloadOptionsModal from "./DownloadOptionsModal";

interface GeneratedBusinessPlanforUserProps {
  executiveSummary: string;
  businessOverview: string;
  marketAnalysis: string;
  businessModel?: string;
  marketingSalesStrategy?: string;
  sectorStrategy?: string;
  fundingSources?: string;
  operationsPlan?: string;
  managementTeam?: string;
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
}

const GeneratedBusinessPlanforUser = ({
  executiveSummary,
  businessOverview,
  marketAnalysis,
  businessModel = "",
  marketingSalesStrategy = "",
  sectorStrategy = "",
  fundingSources = "",
  operationsPlan = "",
  managementTeam = "",
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
}: GeneratedBusinessPlanforUserProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownloadClick = () => {
    setIsModalOpen(true);
  };

  const handleDownloadPDF = () => {
    // Use the original PDF download functionality
    generateEmpathyPDF("businessplan");
  };

  const handleDownloadDOC = async () => {
    // Use the comprehensive Word document download functionality
    await generateWordDocument({
      executiveSummary,
      businessOverview,
      marketAnalysis,
      businessModel,
      marketingSalesStrategy,
      sectorStrategy,
      fundingSources,
      operationsPlan,
      managementTeam,
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
                {executiveSummary}
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
                {businessOverview}
              </p>
            </div>
          </section>

          {/* Management Team */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            3. Gruppo dirigente
          </h2>
          <div className="">
            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-justify">
              {managementTeam}
            </p>
          </div>

          {/* Business Model */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            4. Modello di business
          </h2>
          <div className="">
            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-justify">
              {businessModel}
            </p>
          </div>

          {/* Competitive Advantage Section */}
          <section className="">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              5. Analisi di mercato
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl text-justify">
                {marketAnalysis}
              </p>
            </div>
          </section>

          {/* Funding Sources */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            6. Fonti di finanziamento
          </h2>
          <div className="">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl text-justify">
                {typeof fundingSources === "string"
                  ? fundingSources
                  : typeof fundingSources === "object" &&
                    fundingSources !== null
                  ? Object.entries(fundingSources)
                      .map(
                        ([key, value]) =>
                          `${key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}: ${
                            typeof value === "number"
                              ? `$${value.toLocaleString()}`
                              : value
                          }`
                      )
                      .join(", ")
                  : "No funding information available"}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className=" max-w-[1440px] mx-auto fixed bottom-8 right-8 flex justify-end gap-4 cursor-pointer">
        <button
          onClick={handleDownloadClick}
          className="w-14 h-14 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center text-white cursor-pointer"
          aria-label="Download business plan"
        >
          <GoDownload className="w-6 h-6" />
        </button>
      </div>

      {/* Download Options Modal */}
      <DownloadOptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownloadPDF={handleDownloadPDF}
        onDownloadDOC={handleDownloadDOC}
      />
    </div>
  );
};

export default GeneratedBusinessPlanforUser;

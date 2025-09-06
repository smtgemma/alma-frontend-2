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

interface GeneratedBusinessPlanforAdminProps {
  executiveSummary: string;
  businessOverview: string;
  marketAnalysis: string;
  businessModel?: string;
  marketingSalesStrategy?: string;
  sectorStrategy?: string;
  fundingSources?: string;
  operationsPlan?: string;
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
}: GeneratedBusinessPlanforAdminProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
      financialHighlights,
      cashFlowAnalysis,
      profitLossProjection,
      balanceSheet,
      netFinancialPosition,
      debtStructure,
      keyRatios,
      operatingCostBreakdown,
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
              Executive Summary
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
              Business Overview
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl  text-justify">
                {currentPlanData.businessOverview}
              </p>
            </div>
          </section>

          {/* Competitive Advantage Section */}
          <section className="">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              Market Analysis
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl text-justify">
                {currentPlanData.marketAnalysis}
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className=" max-w-[1440px] mx-auto fixed bottom-8 right-8 flex justify-end gap-4 cursor-pointer">
        {shouldShowShareDownload ? (
          // Share and Download buttons for expert review
          <>
            <button
              onClick={handleShareClick}
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

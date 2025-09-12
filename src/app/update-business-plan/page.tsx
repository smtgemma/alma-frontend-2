"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useAdminGetSingleBusinessPlanQuery,
  useAdminUpdateBusinessPlanMutation,
} from "@/redux/api/admin/adminAPI";

const UpdateBusinessPlanPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("id");

  const {
    data: businessPlan,
    isLoading,
    error,
  } = useAdminGetSingleBusinessPlanQuery(planId || "", {
    skip: !planId,
  });

  const [updateBusinessPlan, { isLoading: isUpdating }] =
    useAdminUpdateBusinessPlanMutation();

  // Form state
  const [formData, setFormData] = useState({
    executiveSummary: "",
    businessOverview: "",
    marketAnalysis: "",
    businessModel: "",
    marketingSalesStrategy: "",
    sectorStrategy: "",
    fundingSources: "",
    operationsPlan: "",
    financialHighlights: [] as any[],
    cashFlowAnalysis: [] as any[],
    profitLossProjection: [] as any[],
    balanceSheet: [] as any[],
    netFinancialPosition: [] as any[],
    debtStructure: [] as any[],
    keyRatios: [] as any[],
    operatingCostBreakdown: [] as any[],
    user_input: {
      uploaded_file: [] as any[],
      user_input: [] as any[],
    },
  });

  // Initialize form data when business plan data is loaded
  useEffect(() => {
    if (businessPlan?.data) {
      setFormData({
        executiveSummary: businessPlan.data.executiveSummary || "",
        businessOverview: businessPlan.data.businessOverview || "",
        marketAnalysis: businessPlan.data.marketAnalysis || "",
        businessModel: businessPlan.data.businessModel || "",
        marketingSalesStrategy: businessPlan.data.marketingSalesStrategy || "",
        sectorStrategy: businessPlan.data.sectorStrategy || "",
        fundingSources: businessPlan.data.fundingSources || "",
        operationsPlan: businessPlan.data.operationsPlan || "",
        financialHighlights: businessPlan.data.financialHighlights || [],
        cashFlowAnalysis: businessPlan.data.cashFlowAnalysis || [],
        profitLossProjection: businessPlan.data.profitLossProjection || [],
        balanceSheet: businessPlan.data.balanceSheet || [],
        netFinancialPosition: businessPlan.data.netFinancialPosition || [],
        debtStructure: businessPlan.data.debtStructure || [],
        keyRatios: businessPlan.data.keyRatios || [],
        operatingCostBreakdown: businessPlan.data.operatingCostBreakdown || [],
        user_input: {
          uploaded_file: businessPlan.data.user_input?.uploaded_file || [],
          user_input: businessPlan.data.user_input?.user_input || [],
        },
      });
    }
  }, [businessPlan]);

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle nested object changes (like user_input)
  const handleNestedInputChange = (
    parentField: string,
    childField: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField as keyof typeof prev] as any),
        [childField]: value,
      },
    }));
  };

  // Handle array item changes (like financial data)
  const handleArrayItemChange = (
    field: string,
    index: number,
    itemField: string,
    value: any
  ) => {
    setFormData((prev) => {
      const currentValue = prev[field as keyof typeof prev];
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [field]: currentValue.map((item: any, i: number) =>
            i === index ? { ...item, [itemField]: value } : item
          ),
        };
      }
      return prev;
    });
  };

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  // Show toast function
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Handle update
  const handleUpdate = async () => {
    if (!planId) return;

    try {
      // Send all fields that backend supports for update
      // Based on backend code: text fields, financial arrays, and other fields
      const updateData = {
        // Text fields
        executiveSummary: formData.executiveSummary,
        businessOverview: formData.businessOverview,
        marketAnalysis: formData.marketAnalysis,
        businessModel: formData.businessModel,
        marketingSalesStrategy: formData.marketingSalesStrategy,
        sectorStrategy: formData.sectorStrategy,
        fundingSources: formData.fundingSources,
        operationsPlan: formData.operationsPlan,

        // Financial arrays (JSON fields)
        financialHighlights: formData.financialHighlights,
        cashFlowAnalysis: formData.cashFlowAnalysis,
        profitLossProjection: formData.profitLossProjection,
        balanceSheet: formData.balanceSheet,
        netFinancialPosition: formData.netFinancialPosition,
        debtStructure: formData.debtStructure,
        keyRatios: formData.keyRatios,
        operatingCostBreakdown: formData.operatingCostBreakdown,

        // Other fields
        user_input: formData.user_input,
        // Note: status and subscriptionType are not included in formData
        // as they are not displayed in the form
      };

      await updateBusinessPlan({
        id: planId,
        data: updateData,
      }).unwrap();

      showToast("Business plan updated successfully!", "success");

      // Navigate back to the previous page after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Update failed:", error);
      showToast("Failed to update business plan. Please try again.", "error");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Plan
          </h1>
          <p className="text-gray-600">Failed to load business plan data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Update Business Plan
          </h1>
          {/* {planId && (
            <p className="text-lg text-gray-700">
              Plan ID: <span className="font-bold text-blue-600">{planId}</span>
            </p>
          )} */}
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed top-8 right-8 z-50 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 0 text-black border border-primary rounded-lg  transition-colors font-medium shadow-lg flex items-center gap-2 text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="hidden sm:inline">Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2 text-sm sm:text-base"
          >
            {isUpdating ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="hidden sm:inline">Updating...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="hidden sm:inline">Update</span>
              </>
            )}
          </button>
        </div>

        {/* Business Plan Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {businessPlan?.data && (
            <form className="space-y-6">
              {/* Plan Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Plan ID</h4>
                  <p className="text-gray-600">
                    {businessPlan.data.planId || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">User ID</h4>
                  <p className="text-gray-600">
                    {businessPlan.data.userId || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Status</h4>
                  <p className="text-gray-600">
                    {businessPlan.data.status || "N/A"}
                  </p>
                </div> */}
              </div>

              {/* Created/Updated Dates */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Created At</h4>
                  <p className="text-gray-600">
                    {businessPlan.data.createdAt
                      ? new Date(
                          businessPlan.data.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Updated At</h4>
                  <p className="text-gray-600">
                    {businessPlan.data.updatedAt
                      ? new Date(
                          businessPlan.data.updatedAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div> */}

              {/* Executive Summary */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3">
                  Executive Summary
                </label>
                <textarea
                  value={formData.executiveSummary}
                  onChange={(e) =>
                    handleInputChange("executiveSummary", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter executive summary"
                />
              </div>

              {/* Business Overview */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3">
                  Business Overview
                </label>
                <textarea
                  value={formData.businessOverview}
                  onChange={(e) =>
                    handleInputChange("businessOverview", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter business overview"
                />
              </div>

              {/* Market Analysis */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3">
                  Market Analysis
                </label>
                <textarea
                  value={formData.marketAnalysis}
                  onChange={(e) =>
                    handleInputChange("marketAnalysis", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter market analysis"
                />
              </div>

              {/* Business Model */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3">
                  Business Model
                </label>
                <textarea
                  value={formData.businessModel}
                  onChange={(e) =>
                    handleInputChange("businessModel", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter business model"
                />
              </div>

              {/* Marketing & Sales Strategy */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3">
                  Marketing & Sales Strategy
                </label>
                <textarea
                  value={formData.marketingSalesStrategy}
                  onChange={(e) =>
                    handleInputChange("marketingSalesStrategy", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter marketing & sales strategy"
                />
              </div>

              {/* Sector Strategy */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3">
                  Sector Strategy
                </label>
                <textarea
                  value={formData.sectorStrategy}
                  onChange={(e) =>
                    handleInputChange("sectorStrategy", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter sector strategy"
                />
              </div>

              {/* Funding Sources */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3">
                  Funding Sources
                </label>
                <textarea
                  value={formData.fundingSources}
                  onChange={(e) =>
                    handleInputChange("fundingSources", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter funding sources"
                />
              </div>

              {/* Operations Plan */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3">
                  Operations Plan
                </label>
                <textarea
                  value={formData.operationsPlan}
                  onChange={(e) =>
                    handleInputChange("operationsPlan", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter operations plan"
                />
              </div>

              {/* Financial Highlights */}
              {formData.financialHighlights &&
                formData.financialHighlights.length > 0 && (
                  <div>
                    <label className="block text-xl font-semibold text-gray-800 mb-3">
                      Financial Highlights
                    </label>
                    <div className="space-y-4">
                      {formData.financialHighlights.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year
                              </label>
                              <input
                                type="text"
                                value={item.year || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "financialHighlights",
                                    index,
                                    "year",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Revenue
                              </label>
                              <input
                                type="text"
                                value={item.revenue || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "financialHighlights",
                                    index,
                                    "revenue",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Net Income
                              </label>
                              <input
                                type="text"
                                value={item.net_income || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "financialHighlights",
                                    index,
                                    "net_income",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Capex
                              </label>
                              <input
                                type="text"
                                value={item.capex || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "financialHighlights",
                                    index,
                                    "capex",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Debt Repayment
                              </label>
                              <input
                                type="text"
                                value={item.debt_repayment || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "financialHighlights",
                                    index,
                                    "debt_repayment",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Cash Flow Analysis */}
              {businessPlan?.data?.cashFlowAnalysis &&
                businessPlan.data.cashFlowAnalysis.length > 0 && (
                  <div>
                    <label className="block text-xl font-semibold text-gray-800 mb-3">
                      Cash Flow Analysis
                    </label>
                    <div className="space-y-4">
                      {businessPlan.data.cashFlowAnalysis.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year
                              </label>
                              <input
                                type="text"
                                value={item.year || ""}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Operating
                              </label>
                              <input
                                type="text"
                                value={
                                  item.operating
                                    ? `€${item.operating.toLocaleString()}`
                                    : ""
                                }
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Investing
                              </label>
                              <input
                                type="text"
                                value={
                                  item.investing
                                    ? `€${item.investing.toLocaleString()}`
                                    : ""
                                }
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Financing
                              </label>
                              <input
                                type="text"
                                value={
                                  item.financing
                                    ? `€${item.financing.toLocaleString()}`
                                    : ""
                                }
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Net Cash
                              </label>
                              <input
                                type="text"
                                value={
                                  item.net_cash
                                    ? `€${item.net_cash.toLocaleString()}`
                                    : ""
                                }
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* User Input */}
              {formData.user_input && (
                <div>
                  <label className="block text-xl font-semibold text-gray-800 mb-3">
                    User Input
                  </label>
                  <div className="space-y-4">
                    {formData.user_input.user_input &&
                      formData.user_input.user_input.length > 0 && (
                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-2">
                            Questions & Answers
                          </label>
                          {formData.user_input.user_input.map(
                            (item: any, index: number) => (
                              <div
                                key={index}
                                className="bg-white p-4 rounded-lg mb-2 space-y-2 border border-gray-200"
                              >
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question {index + 1}
                                  </label>
                                  <input
                                    type="text"
                                    value={item.question || ""}
                                    onChange={(e) =>
                                      handleNestedInputChange(
                                        "user_input",
                                        "user_input",
                                        formData.user_input.user_input.map(
                                          (q: any, i: number) =>
                                            i === index
                                              ? {
                                                  ...q,
                                                  question: e.target.value,
                                                }
                                              : q
                                        )
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Answer {index + 1}
                                  </label>
                                  <textarea
                                    value={item.answer || ""}
                                    onChange={(e) =>
                                      handleNestedInputChange(
                                        "user_input",
                                        "user_input",
                                        formData.user_input.user_input.map(
                                          (q: any, i: number) =>
                                            i === index
                                              ? { ...q, answer: e.target.value }
                                              : q
                                        )
                                      )
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {formData.user_input.uploaded_file &&
                      formData.user_input.uploaded_file.length > 0 && (
                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-2">
                            Uploaded Files
                          </label>
                          {formData.user_input.uploaded_file.map(
                            (file: any, index: number) => (
                              <div
                                key={index}
                                className="bg-white p-4 rounded-lg mb-2 space-y-2 border border-gray-200"
                              >
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Document Type
                                  </label>
                                  <input
                                    type="text"
                                    value={file.document_type || ""}
                                    onChange={(e) =>
                                      handleNestedInputChange(
                                        "user_input",
                                        "uploaded_file",
                                        formData.user_input.uploaded_file.map(
                                          (f: any, i: number) =>
                                            i === index
                                              ? {
                                                  ...f,
                                                  document_type: e.target.value,
                                                }
                                              : f
                                        )
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Page Count
                                  </label>
                                  <input
                                    type="text"
                                    value={file.page_count || ""}
                                    onChange={(e) =>
                                      handleNestedInputChange(
                                        "user_input",
                                        "uploaded_file",
                                        formData.user_input.uploaded_file.map(
                                          (f: any, i: number) =>
                                            i === index
                                              ? {
                                                  ...f,
                                                  page_count: e.target.value,
                                                }
                                              : f
                                        )
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                {file.financial_data && (
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Assets
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          file.financial_data.total_assets
                                            ? `€${file.financial_data.total_assets.toLocaleString()}`
                                            : ""
                                        }
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Revenue
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          file.financial_data.total_revenue
                                            ? `€${file.financial_data.total_revenue.toLocaleString()}`
                                            : ""
                                        }
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Net Income
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          file.financial_data.net_income
                                            ? `€${file.financial_data.net_income.toLocaleString()}`
                                            : ""
                                        }
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Additional Financial Data */}
              {businessPlan?.data?.profitLossProjection &&
                businessPlan.data.profitLossProjection.length > 0 && (
                  <div>
                    <label className="block text-xl font-semibold text-gray-800 mb-3">
                      Profit & Loss Projection
                    </label>
                    <div className="space-y-4">
                      {businessPlan.data.profitLossProjection.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year
                              </label>
                              <input
                                type="text"
                                value={item.year || ""}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Revenue
                              </label>
                              <input
                                type="text"
                                value={
                                  item.revenue
                                    ? `€${item.revenue.toLocaleString()}`
                                    : ""
                                }
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                COGS
                              </label>
                              <input
                                type="text"
                                value={
                                  item.cogs
                                    ? `€${item.cogs.toLocaleString()}`
                                    : ""
                                }
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gross Profit
                              </label>
                              <input
                                type="text"
                                value={
                                  item.gross_profit
                                    ? `€${item.gross_profit.toLocaleString()}`
                                    : ""
                                }
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Net Income
                              </label>
                              <input
                                type="text"
                                value={
                                  item.net_income
                                    ? `€${item.net_income.toLocaleString()}`
                                    : ""
                                }
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

            </form>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateBusinessPlanPage;

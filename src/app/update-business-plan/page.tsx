"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useAdminGetSingleBusinessPlanQuery,
  useAdminUpdateBusinessPlanMutation,
} from "@/redux/api/admin/adminAPI";
// src/app/update-business-plan/page.tsx
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
  console.log("Business Plan", businessPlan);

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
    fundingSources: {} as any,
    operationsPlan: "",
    managementTeam: "",
    financialHighlights: [] as any[],
    cashFlowAnalysis: [] as any[],
    profitLossProjection: [] as any[],
    balanceSheet: [] as any[],
    netFinancialPosition: [] as any[],
    debtStructure: [] as any[],
    keyRatios: [] as any[],
    operatingCostBreakdown: [] as any[],
    financialAnalysis: [] as any[],
    ratiosAnalysis: [] as any[],
    productionSalesForecast: [] as any[],
    // Analysis fields
    financialHighlightsAnalysis: "",
    cashFlowAnalysisAnalysis: [] as any[],
    profitLossProjectionAnalysis: "",
    balanceSheetAnalysis: "",
    netFinancialPositionAnalysis: "",
    debtStructureAnalysis: "",
    keyRatiosAnalysis: "",
    ratiosAnalysisAnalysis: "",
    financialAnalysisAnalysis: "",
    productionSalesForecastAnalysis: "",
    kpiAnalysis: {} as any,
    user_input: {
      uploaded_file: [] as any[],
      user_input: [] as any[],
      language: "English",
      currency: "English",
    },
  });

  // Initialize form data when business plan data is loaded
  useEffect(() => {
    if (businessPlan?.data) {
      console.log("Business plan data received:", businessPlan.data);
      console.log("Business plan data keys:", Object.keys(businessPlan.data));

      setFormData({
        executiveSummary: businessPlan.data.executiveSummary || "",
        businessOverview: businessPlan.data.businessOverview || "",
        marketAnalysis: businessPlan.data.marketAnalysis || "",
        businessModel: businessPlan.data.businessModel || "",
        marketingSalesStrategy: businessPlan.data.marketingSalesStrategy || "",
        sectorStrategy: businessPlan.data.sectorStrategy || "",
        fundingSources: businessPlan.data.fundingSources || {},
        operationsPlan: businessPlan.data.operationsPlan || "",
        managementTeam: businessPlan.data.managementTeam || "",
        financialHighlights: businessPlan.data.financialHighlights || [],
        cashFlowAnalysis: businessPlan.data.cashFlowAnalysis || [],
        profitLossProjection: businessPlan.data.profitLossProjection || [],
        balanceSheet: businessPlan.data.balanceSheet || [],
        netFinancialPosition: businessPlan.data.netFinancialPosition || [],
        debtStructure: businessPlan.data.debtStructure || [],
        keyRatios: businessPlan.data.keyRatios || [],
        operatingCostBreakdown: businessPlan.data.operatingCostBreakdown || [],
        financialAnalysis: businessPlan.data.financialAnalysis || [],
        ratiosAnalysis: businessPlan.data.ratiosAnalysis || [],
        productionSalesForecast:
          businessPlan.data.productionSalesForecast || [],
        // Analysis fields
        financialHighlightsAnalysis:
          businessPlan.data.financialHighlightsAnalysis || "",
        cashFlowAnalysisAnalysis: businessPlan.data.cashFlowAnalysisData || [],
        profitLossProjectionAnalysis:
          businessPlan.data.profitLossProjectionAnalysis || "",
        balanceSheetAnalysis: businessPlan.data.balanceSheetAnalysis || "",
        netFinancialPositionAnalysis:
          businessPlan.data.netFinancialPositionAnalysis || "",
        debtStructureAnalysis: businessPlan.data.debtStructureAnalysis || "",
        keyRatiosAnalysis: businessPlan.data.keyRatiosAnalysis || "",
        ratiosAnalysisAnalysis: businessPlan.data.ratiosAnalysisAnalysis || "",
        financialAnalysisAnalysis:
          businessPlan.data.financialAnalysisAnalysis || "",
        productionSalesForecastAnalysis:
          businessPlan.data.productionSalesForecastAnalysis || "",
        kpiAnalysis: businessPlan.data.kpiAnalysis || {},
        user_input: {
          uploaded_file: businessPlan.data.user_input?.uploaded_file || [],
          user_input: businessPlan.data.user_input?.user_input || [],
          language: businessPlan.data.user_input?.language || "English",
          currency: businessPlan.data.user_input?.currency || "English",
        } as any,
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
      // Log the form data before sending
      console.log("Form data to be sent:", formData);
      console.log("Plan ID:", planId);

      // Simple approach: Send only non-empty fields to reduce payload size
      const updateData = {
        // Send only non-empty financial arrays
        ...(formData.financialHighlights &&
          formData.financialHighlights.length > 0 && {
            financialHighlights: formData.financialHighlights,
          }),
        ...(formData.ratiosAnalysis &&
          formData.ratiosAnalysis.length > 0 && {
            ratiosAnalysis: formData.ratiosAnalysis,
          }),
        ...(formData.productionSalesForecast &&
          formData.productionSalesForecast.length > 0 && {
            productionSalesForecast: formData.productionSalesForecast,
          }),
        ...(formData.profitLossProjection &&
          formData.profitLossProjection.length > 0 && {
            profitLossProjection: formData.profitLossProjection,
          }),
        ...(formData.financialAnalysis &&
          formData.financialAnalysis.length > 0 && {
            financialAnalysis: formData.financialAnalysis,
          }),
        ...(formData.cashFlowAnalysisAnalysis &&
          formData.cashFlowAnalysisAnalysis.length > 0 && {
            cashFlowAnalysisData: formData.cashFlowAnalysisAnalysis,
          }),

        // Text fields - only if non-empty
        ...(formData.executiveSummary && {
          executiveSummary: formData.executiveSummary,
        }),
        ...(formData.businessOverview && {
          businessOverview: formData.businessOverview,
        }),
        ...(formData.marketAnalysis && {
          marketAnalysis: formData.marketAnalysis,
        }),
        ...(formData.businessModel && {
          businessModel: formData.businessModel,
        }),
        ...(formData.marketingSalesStrategy && {
          marketingSalesStrategy: formData.marketingSalesStrategy,
        }),

        // Analysis fields - only if non-empty
        ...(formData.fundingSources &&
          Object.keys(formData.fundingSources).length > 0 && {
            fundingSources: formData.fundingSources,
          }),
        ...(formData.managementTeam && {
          managementTeam: formData.managementTeam,
        }),
        ...(formData.financialHighlightsAnalysis && {
          financialHighlightsAnalysis: formData.financialHighlightsAnalysis,
        }),
        ...(formData.profitLossProjectionAnalysis && {
          profitLossProjectionAnalysis: formData.profitLossProjectionAnalysis,
        }),
        ...(formData.balanceSheetAnalysis && {
          balanceSheetAnalysis: formData.balanceSheetAnalysis,
        }),
        ...(formData.netFinancialPositionAnalysis && {
          netFinancialPositionAnalysis: formData.netFinancialPositionAnalysis,
        }),
        ...(formData.debtStructureAnalysis && {
          debtStructureAnalysis: formData.debtStructureAnalysis,
        }),
        ...(formData.keyRatiosAnalysis && {
          keyRatiosAnalysis: formData.keyRatiosAnalysis,
        }),
        ...(formData.ratiosAnalysisAnalysis && {
          ratiosAnalysisAnalysis: formData.ratiosAnalysisAnalysis,
        }),
        ...(formData.financialAnalysisAnalysis && {
          financialAnalysisAnalysis: formData.financialAnalysisAnalysis,
        }),
        ...(formData.productionSalesForecastAnalysis && {
          productionSalesForecastAnalysis:
            formData.productionSalesForecastAnalysis,
        }),

        // User input field
        ...(formData.user_input &&
          (formData.user_input.user_input?.length > 0 ||
            formData.user_input.uploaded_file?.length > 0) && {
            user_input: formData.user_input,
          }),
      };

      console.log("Update data being sent:", updateData);

      console.log("Full update data:", updateData);

      const result = await updateBusinessPlan({
        id: planId,
        data: updateData,
      }).unwrap();

      console.log("Update successful:", result);
      showToast("Piano aziendale aggiornato con successo!", "success");

      // Navigate back to the previous page after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Update failed:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));

      // Extract more detailed error information
      let errorMessage = "Impossibile aggiornare il piano aziendale. Riprova.";
      if (error && typeof error === "object") {
        if ("data" in error && error.data) {
          console.error("Error data:", error.data);
          if (
            typeof error.data === "object" &&
            error.data &&
            "message" in error.data
          ) {
            errorMessage = String((error.data as any).message);
          } else if (typeof error.data === "string") {
            errorMessage = error.data;
          }
        } else if ("message" in error) {
          errorMessage = String((error as any).message);
        }
      }

      showToast(errorMessage, "error");
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
          <p className="mt-4 text-gray-600 ">Caricamento in corso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4 ">Errore</h1>
          <p className="text-gray-600 ">Impossibile caricare i dati</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 ">
            Aggiorna Piano Aziendale
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
            <span className="hidden sm:inline ">Annulla</span>
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
                <span className="hidden sm:inline ">Aggiornamento...</span>
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
                <span className="hidden sm:inline ">Aggiorna</span>
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
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Sintesi esecutiva
                </label>
                <textarea
                  value={formData.executiveSummary}
                  onChange={(e) =>
                    handleInputChange("executiveSummary", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci il riassunto esecutivo"
                />
              </div>

              {/* Business Overview */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Panoramica aziendal
                </label>
                <textarea
                  value={formData.businessOverview}
                  onChange={(e) =>
                    handleInputChange("businessOverview", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci la panoramica aziendale"
                />
              </div>

              {/* Management Team */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Team di gestione
                </label>
                <textarea
                  value={formData.managementTeam}
                  onChange={(e) =>
                    handleInputChange("managementTeam", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci le informazioni del team di gestione"
                />
              </div>

              {/* Business Model */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Modello di Business
                </label>
                <textarea
                  value={formData.businessModel}
                  onChange={(e) =>
                    handleInputChange("businessModel", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci il modello di business"
                />
              </div>

              {/* Market Analysis */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Analisi di Mercato
                </label>
                <textarea
                  value={formData.marketAnalysis}
                  onChange={(e) =>
                    handleInputChange("marketAnalysis", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci l'analisi di mercato"
                />
              </div>

              {/* Funding Sources */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Fonti di Finanziamento
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ">
                      Da Casa (Importo)
                    </label>
                    <input
                      type="number"
                      value={formData.fundingSources?.fromHome || ""}
                      onChange={(e) =>
                        handleInputChange("fundingSources", {
                          ...formData.fundingSources,
                          fromHome: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Inserisci l'importo del finanziamento da casa"
                    />
                  </div>
                </div>
              </div>

              {/* Profit Loss Projection Analysis */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Proiezione di Profitti e Perdite
                </label>
                <textarea
                  value={formData.profitLossProjectionAnalysis}
                  onChange={(e) =>
                    handleInputChange(
                      "profitLossProjectionAnalysis",
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci l'analisi della proiezione di profitti e perdite"
                />
              </div>

              {/* Profit Loss Projection */}
              {formData.profitLossProjection &&
                Array.isArray(formData.profitLossProjection) &&
                formData.profitLossProjection.length > 0 && (
                  <div>
                    <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                      8.1 Proiezione di Profitti e Perdite
                    </label>
                    <div className="space-y-4">
                      {formData.profitLossProjection.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Anno
                              </label>
                              <input
                                type="number"
                                value={item.year || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "profitLossProjection",
                                    index,
                                    "year",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ricavi
                              </label>
                              <input
                                type="number"
                                value={item.revenue || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "profitLossProjection",
                                    index,
                                    "revenue",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Costo delle Merci Vendute
                              </label>
                              <input
                                type="number"
                                value={item.cogs || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "profitLossProjection",
                                    index,
                                    "cogs",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Profitto Lordo
                              </label>
                              <input
                                type="number"
                                value={item.gross_profit || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "profitLossProjection",
                                    index,
                                    "gross_profit",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Spese Operative
                              </label>
                              <input
                                type="number"
                                value={item.operating_expenses || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "profitLossProjection",
                                    index,
                                    "operating_expenses",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                EBITDA
                              </label>
                              <input
                                type="number"
                                value={item.ebitda || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "profitLossProjection",
                                    index,
                                    "ebitda",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ammortamento e Svalutazione
                              </label>
                              <input
                                type="number"
                                value={item.depreciation_amortization || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "profitLossProjection",
                                    index,
                                    "depreciation_amortization",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                EBIT
                              </label>
                              <input
                                type="number"
                                value={item.ebit || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "profitLossProjection",
                                    index,
                                    "ebit",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interessi
                              </label>
                              <input
                                type="number"
                                value={item.interest || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "profitLossProjection",
                                    index,
                                    "interest",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tasse
                              </label>
                              <input
                                type="number"
                                value={item.taxes || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "profitLossProjection",
                                    index,
                                    "taxes",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reddito Netto
                              </label>
                              <input
                                type="number"
                                value={item.net_income || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "profitLossProjection",
                                    index,
                                    "net_income",
                                    parseFloat(e.target.value) || 0
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

              {/* Marketing & Sales Strategy */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Strategia di Marketing e Vendite
                </label>
                <textarea
                  value={formData.marketingSalesStrategy}
                  onChange={(e) =>
                    handleInputChange("marketingSalesStrategy", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci la strategia di marketing e vendite"
                />
              </div>

              {/* Sector Strategy */}
              {/* <div>
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
              </div> */}

              {/* Operations Plan */}
              {/* <div>
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
              </div> */}

              {/* Financial Highlights Analysis */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Analisi degli Evidenziatori Finanziari
                </label>
                <textarea
                  value={formData.financialHighlightsAnalysis}
                  onChange={(e) =>
                    handleInputChange(
                      "financialHighlightsAnalysis",
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci l'analisi degli evidenziatori finanziari"
                />
              </div>

              {/* Cash Flow Analysis */}
              {formData.cashFlowAnalysis &&
                Array.isArray(formData.cashFlowAnalysis) &&
                formData.cashFlowAnalysis.length > 0 && (
                  <div>
                    <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                      Analisi del Flusso di Cassa
                    </label>
                    <div className="space-y-4">
                      {formData.cashFlowAnalysis.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Anno
                              </label>
                              <input
                                type="number"
                                value={item.year || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "cashFlowAnalysis",
                                    index,
                                    "year",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Operativo
                              </label>
                              <input
                                type="number"
                                value={item.operating || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "cashFlowAnalysis",
                                    index,
                                    "operating",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Investimento
                              </label>
                              <input
                                type="number"
                                value={item.investing || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "cashFlowAnalysis",
                                    index,
                                    "investing",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Finanziamento
                              </label>
                              <input
                                type="number"
                                value={item.financing || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "cashFlowAnalysis",
                                    index,
                                    "financing",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cassa Netta
                              </label>
                              <input
                                type="number"
                                value={item.net_cash || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "cashFlowAnalysis",
                                    index,
                                    "net_cash",
                                    parseFloat(e.target.value) || 0
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

              {/* Balance Sheet Analysis */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Stato Patrimoniale
                </label>
                <textarea
                  value={formData.balanceSheetAnalysis}
                  onChange={(e) =>
                    handleInputChange("balanceSheetAnalysis", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci l'analisi dello stato patrimoniale"
                />
              </div>

              {/* Net Financial Position Analysis */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Posizione Finanziaria Netta
                </label>
                <textarea
                  value={formData.netFinancialPositionAnalysis}
                  onChange={(e) =>
                    handleInputChange(
                      "netFinancialPositionAnalysis",
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci l'analisi della posizione finanziaria netta"
                />
              </div>

              {/* Debt Structure Analysis */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Struttura del Debito
                </label>
                <textarea
                  value={formData.debtStructureAnalysis}
                  onChange={(e) =>
                    handleInputChange("debtStructureAnalysis", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci l'analisi della struttura del debito"
                />
              </div>

              {/* Financial Analysis */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Analisi Finanziaria
                </label>
                <textarea
                  value={formData.financialAnalysisAnalysis}
                  onChange={(e) =>
                    handleInputChange(
                      "financialAnalysisAnalysis",
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci l'analisi finanziaria"
                />
              </div>

              {/* Key Ratios Analysis */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Analisi dei Rapporti Chiave
                </label>
                <textarea
                  value={formData.keyRatiosAnalysis}
                  onChange={(e) =>
                    handleInputChange("keyRatiosAnalysis", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci l'analisi dei rapporti chiave"
                />
              </div>

              {/* Ratios Analysis */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Analisi dei Rapporti
                </label>
                <textarea
                  value={formData.ratiosAnalysisAnalysis}
                  onChange={(e) =>
                    handleInputChange("ratiosAnalysisAnalysis", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci l'analisi dei rapporti"
                />
              </div>

              {/* Production Sales Forecast Analysis */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                  Analisi della Previsione di Produzione e Vendite
                </label>
                <textarea
                  value={formData.productionSalesForecastAnalysis}
                  onChange={(e) =>
                    handleInputChange(
                      "productionSalesForecastAnalysis",
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci l'analisi della previsione di produzione e vendite"
                />
              </div>

              {/* KPI Analysis */}
              {formData.kpiAnalysis &&
                Object.keys(formData.kpiAnalysis).length > 0 && (
                  <div>
                    <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                      Analisi KPI
                    </label>
                    <div className="space-y-4">
                      {Object.entries(formData.kpiAnalysis).map(
                        ([year, data]: [string, any]) => (
                          <div
                            key={year}
                            className="border border-gray-200 rounded-lg p-4 bg-white"
                          >
                            <h4 className="font-semibold text-gray-700 mb-3 ">
                              Anno {year}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 ">
                                  Punteggio Complessivo
                                </label>
                                <input
                                  type="number"
                                  value={data.overallScore || ""}
                                  onChange={(e) =>
                                    handleInputChange("kpiAnalysis", {
                                      ...formData.kpiAnalysis,
                                      [year]: {
                                        ...data,
                                        overallScore:
                                          parseFloat(e.target.value) || 0,
                                      },
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 ">
                                  Avvisi (separati da virgola)
                                </label>
                                <input
                                  type="text"
                                  value={data.warnings?.join(", ") || ""}
                                  onChange={(e) =>
                                    handleInputChange("kpiAnalysis", {
                                      ...formData.kpiAnalysis,
                                      [year]: {
                                        ...data,
                                        warnings: e.target.value
                                          .split(",")
                                          .map((w) => w.trim())
                                          .filter((w) => w),
                                      },
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Inserisci gli avvisi separati da virgole"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1 ">
                                  Raccomandazioni (separate da virgola)
                                </label>
                                <input
                                  type="text"
                                  value={data.recommendations?.join(", ") || ""}
                                  onChange={(e) =>
                                    handleInputChange("kpiAnalysis", {
                                      ...formData.kpiAnalysis,
                                      [year]: {
                                        ...data,
                                        recommendations: e.target.value
                                          .split(",")
                                          .map((r) => r.trim())
                                          .filter((r) => r),
                                      },
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Inserisci le raccomandazioni separate da virgole"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Financial Highlights */}
              {formData.financialHighlights &&
                Array.isArray(formData.financialHighlights) &&
                formData.financialHighlights.length > 0 && (
                  <div>
                    <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                      Evidenziatori Finanziari
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
                                Anno
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
                                Ricavi
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
                                Reddito Netto
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
                                Spese in Conto Capitale
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
                                Rimborso del Debito
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

              {/* Cash Flow Analysis Data*/}
              {formData.cashFlowAnalysisAnalysis &&
                Array.isArray(formData.cashFlowAnalysisAnalysis) &&
                formData.cashFlowAnalysisAnalysis.length > 0 && (
                  <div>
                    <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                      Dati dell'Analisi del Flusso di Cassa
                    </label>
                    <div className="space-y-4">
                      {formData.cashFlowAnalysisAnalysis.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Anno
                              </label>
                              <input
                                type="number"
                                value={item.year || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "cashFlowAnalysisAnalysis",
                                    index,
                                    "year",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Operativo
                              </label>
                              <input
                                type="number"
                                value={item.operating || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "cashFlowAnalysisAnalysis",
                                    index,
                                    "operating",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Investimento
                              </label>
                              <input
                                type="number"
                                value={item.investing || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "cashFlowAnalysisAnalysis",
                                    index,
                                    "investing",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Finanziamento
                              </label>
                              <input
                                type="number"
                                value={item.financing || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "cashFlowAnalysisAnalysis",
                                    index,
                                    "financing",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cassa Netta
                              </label>
                              <input
                                type="number"
                                value={item.net_cash || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "cashFlowAnalysisAnalysis",
                                    index,
                                    "net_cash",
                                    parseFloat(e.target.value) || 0
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

              {/* User Input */}
              {formData.user_input && (
                <div>
                  <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                    Input dell'Utente
                  </label>
                  <div className="space-y-4">
                    {formData.user_input.user_input &&
                      formData.user_input.user_input.length > 0 && (
                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-2 ">
                            Domande e Risposte
                          </label>
                          {formData.user_input.user_input.map(
                            (item: any, index: number) => (
                              <div
                                key={index}
                                className="bg-white p-4 rounded-lg mb-2 space-y-2 border border-gray-200"
                              >
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 ">
                                    Domanda {index + 1}
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
                                  <label className="block text-sm font-medium text-gray-700 mb-1 ">
                                    Risposta {index + 1}
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
                          <label className="block text-lg font-medium text-gray-700 mb-2 ">
                            File Caricati
                          </label>
                          {formData.user_input.uploaded_file.map(
                            (file: any, index: number) => (
                              <div
                                key={index}
                                className="bg-white p-4 rounded-lg mb-2 space-y-2 border border-gray-200"
                              >
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1 ">
                                    Tipo di Documento
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
                                  <label className="block text-sm font-medium text-gray-700 mb-1 ">
                                    Numero di Pagine
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
                                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                                        Totale Attività
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          file.financial_data.total_assets
                                            ? `${file.financial_data.total_assets.toLocaleString()}`
                                            : ""
                                        }
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                                        Ricavi Totali
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          file.financial_data.total_revenue
                                            ? `${file.financial_data.total_revenue.toLocaleString()}`
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
                                            ? `${file.financial_data.net_income.toLocaleString()}`
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

              {/* Financial Analysis */}
              {formData.financialAnalysis &&
                Array.isArray(formData.financialAnalysis) &&
                formData.financialAnalysis.length > 0 && (
                  <div>
                    <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                      Analisi Finanziaria
                    </label>
                    <div className="space-y-4">
                      {formData.financialAnalysis.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Anno
                              </label>
                              <input
                                type="number"
                                value={item.year || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "financialAnalysis",
                                    index,
                                    "year",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Flusso di Cassa Netto
                              </label>
                              <input
                                type="number"
                                value={item.net_cash_flow || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "financialAnalysis",
                                    index,
                                    "net_cash_flow",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ricavi delle Vendite
                              </label>
                              <input
                                type="number"
                                value={item.sales_revenue || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "financialAnalysis",
                                    index,
                                    "sales_revenue",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                EBT
                              </label>
                              <input
                                type="number"
                                value={item.ebt || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "financialAnalysis",
                                    index,
                                    "ebt",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reddito Netto
                              </label>
                              <input
                                type="number"
                                value={item.net_income || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "financialAnalysis",
                                    index,
                                    "net_income",
                                    parseFloat(e.target.value) || 0
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

              {/* Ratios Analysis */}
              {formData.ratiosAnalysis &&
                Array.isArray(formData.ratiosAnalysis) &&
                formData.ratiosAnalysis.length > 0 && (
                  <div>
                    <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                      Analisi dei Rapporti
                    </label>
                    <div className="space-y-4">
                      {formData.ratiosAnalysis.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Anno
                              </label>
                              <input
                                type="number"
                                value={item.year || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "ratiosAnalysis",
                                    index,
                                    "year",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ROI (%)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={item.roi || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "ratiosAnalysis",
                                    index,
                                    "roi",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ROE (%)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={item.roe || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "ratiosAnalysis",
                                    index,
                                    "roe",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rapporto Corrente
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={item.current_ratio || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "ratiosAnalysis",
                                    index,
                                    "current_ratio",
                                    parseFloat(e.target.value) || 0
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

              {/* Production Sales Forecast */}
              {formData.productionSalesForecast &&
                Array.isArray(formData.productionSalesForecast) &&
                formData.productionSalesForecast.length > 0 && (
                  <div>
                    <label className="block text-xl font-semibold text-gray-800 mb-3 ">
                      Previsione di Produzione e Vendite
                    </label>
                    <div className="space-y-4">
                      {formData.productionSalesForecast.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Anno
                              </label>
                              <input
                                type="number"
                                value={item.year || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "productionSalesForecast",
                                    index,
                                    "year",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ricavi delle Vendite
                              </label>
                              <input
                                type="number"
                                value={item.sales_revenue || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "productionSalesForecast",
                                    index,
                                    "sales_revenue",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Crescita dei Ricavi (%)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={item.revenue_growth || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "productionSalesForecast",
                                    index,
                                    "revenue_growth",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unità Vendute
                              </label>
                              <input
                                type="number"
                                value={item.units_sold || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    "productionSalesForecast",
                                    index,
                                    "units_sold",
                                    parseFloat(e.target.value) || 0
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
            </form>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium {
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

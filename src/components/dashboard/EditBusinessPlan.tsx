"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { FiEdit3, FiSave, FiX } from "react-icons/fi";
import { useUpdateBusinessPlanMutation } from "@/redux/api/businessPlan/businessPlanApi";
import FinancialAnalysis from "@/components/generated-plans-graph/FinancalAnalysis";
import ProductionSalesForecast from "@/components/generated-plans-graph/ProductionSalesForecast";
import RatiosAnalysis from "@/components/generated-plans-graph/RatiosAnalysis";

// Type definitions for the new components
interface FinancialAnalysisData {
  year: number;
  gross_operating_cash_flow: number;
  working_capital_change: number;
  current_management_cash_flow: number;
  operating_cash_flow: number;
  debt_service_cash_flow: number;
  shareholders_cash_flow: number;
  net_cash_flow: number;
  sales_revenue: number;
  production_value: number;
  gross_operating_margin: number;
  ebit: number;
  ebt: number;
  net_income: number;
  dividends: number;
  net_tangible_assets: number;
  net_intangible_assets: number;
  financial_assets: number;
  trade_assets: number;
  inventory: number;
  deferred_liquidity: number;
  immediate_liquidity: number;
  equity: number;
  long_term_debt: number;
  short_term_debt: number;
  net_financial_position: number;
  mortgage_loans: number;
  other_financial_debts: number;
  cash_and_banks: number;
}

interface RatiosAnalysisData {
  year: number;
  roi: number;
  roe: number;
  ros: number;
  ebit_margin: number;
  net_debt_to_ebitda: number;
  net_debt_to_equity: number;
  net_debt_to_revenue: number;
  current_ratio: number;
  quick_ratio: number;
  debt_to_equity: number;
  treasury_margin: number;
  structural_margin: number;
  net_working_capital: number;
  altman_z_score: number;
}

interface ProductionSalesForecastData {
  year: number;
  sales_revenue: number;
  revenue_growth: number;
  units_sold: number;
  average_price: number;
  unit_production_cost: number;
  unit_margin: number;
}

interface BusinessPlanData {
  id: string;
  executiveSummary: string;
  businessOverview: string;
  marketAnalysis: string;
  businessModel: string;
  marketingSalesStrategy: string;
  sectorStrategy: string;
  fundingSources: string;
  operationsPlan: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  // New fields for the additional components
  managementTeam?: string;
  financialAnalysis?: FinancialAnalysisData[];
  ratiosAnalysis?: RatiosAnalysisData[];
  productionSalesForecast?: ProductionSalesForecastData[];
}

interface EditBusinessPlanProps {
  planData: BusinessPlanData;
  onUpdate?: (data: BusinessPlanData) => Promise<void>;
  isLoading?: boolean;
}

export default function EditBusinessPlan({
  planData,
  onUpdate,
  isLoading = false,
}: EditBusinessPlanProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BusinessPlanData>(planData);
  const [updateBusinessPlan, { isLoading: isUpdating }] =
    useUpdateBusinessPlanMutation();

  useEffect(() => {
    setFormData(planData);
  }, [planData]);

  const handleInputChange = (
    field: keyof Pick<
      BusinessPlanData,
      | "executiveSummary"
      | "businessOverview"
      | "marketAnalysis"
      | "businessModel"
      | "marketingSalesStrategy"
      | "sectorStrategy"
      | "fundingSources"
      | "operationsPlan"
      | "managementTeam"
    >,
    value: string
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      // Extract only the editable fields for API call
      const updateData = {
        executiveSummary: formData.executiveSummary,
        businessOverview: formData.businessOverview,
        marketAnalysis: formData.marketAnalysis,
        businessModel: formData.businessModel,
        marketingSalesStrategy: formData.marketingSalesStrategy,
        sectorStrategy: formData.sectorStrategy,
        fundingSources: formData.fundingSources,
        operationsPlan: formData.operationsPlan,
        managementTeam: formData.managementTeam,
      };

      // Call the API
      const result = await updateBusinessPlan({
        id: planData.id,
        data: updateData,
      }).unwrap();

      if (result.success) {
        toast.success("Business plan updated successfully!");
        setIsEditing(false);

        // If onUpdate callback is provided, call it with updated data
        if (onUpdate) {
          await onUpdate({ ...planData, ...updateData });
        }
      } else {
        toast.error("Failed to update business plan");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update business plan");
    }
  };

  const handleCancel = () => {
    setFormData(planData);
    setIsEditing(false);
  };

  const renderField = (
    title: string,
    field: keyof Pick<
      BusinessPlanData,
      | "executiveSummary"
      | "businessOverview"
      | "marketAnalysis"
      | "businessModel"
      | "marketingSalesStrategy"
      | "sectorStrategy"
      | "fundingSources"
      | "operationsPlan"
      | "managementTeam"
    >,
    placeholder: string
  ) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
        {title}
      </h2>
      {isEditing ? (
        <textarea
          value={(formData[field] as string) || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder={placeholder}
        />
      ) : (
        <p className="text-gray-700 leading-relaxed text-lg">
          {(formData[field] as string) ||
            `No ${title.toLowerCase()} available.`}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Business Plan
          </h1>
          <p className="text-gray-600 mt-2">
            Plan ID: {planData.id} | Created:{" "}
            {new Date(planData.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiEdit3 className="w-5 h-5" />
              Edit Plan
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FiSave className="w-5 h-5" />
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <FiX className="w-5 h-5" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Business Plan Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 space-y-8">
          {/* Executive Summary */}
          {renderField(
            "Executive Summary",
            "executiveSummary",
            "Enter executive summary..."
          )}

          {/* Business Overview */}
          {renderField(
            "Business Overview",
            "businessOverview",
            "Enter business overview..."
          )}

          {/* Market Analysis */}
          {renderField(
            "Market Analysis",
            "marketAnalysis",
            "Enter market analysis..."
          )}

          {/* Business Model */}
          {renderField(
            "Business Model",
            "businessModel",
            "Enter business model..."
          )}

          {/* Marketing & Sales Strategy */}
          {renderField(
            "Marketing & Sales Strategy",
            "marketingSalesStrategy",
            "Enter marketing and sales strategy..."
          )}

          {/* Sector Strategy */}
          {/* {renderField(
            "Sector Strategy",
            "sectorStrategy",
            "Enter sector strategy..."
          )} */}

          {/* Funding Sources */}
          {renderField(
            "Funding Sources",
            "fundingSources",
            "Enter funding sources..."
          )}

          {/* Operations Plan */}
          {/* {renderField(
            "Operations Plan",
            "operationsPlan",
            "Enter operations plan..."
          )} */}

          {/* Management Team */}
          {renderField(
            "Management Team",
            "managementTeam",
            "Enter management team information..."
          )}
        </div>
      </div>

      {/* Financial Analysis Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Financial Analysis
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Comprehensive financial metrics and analysis data
            </p>
          </div>
          <FinancialAnalysis
            financialAnalysis={
              formData.financialAnalysis &&
              formData.financialAnalysis.length > 0
                ? formData.financialAnalysis
                : [
                    {
                      year: 1,
                      gross_operating_cash_flow: 0,
                      working_capital_change: 0,
                      current_management_cash_flow: 0,
                      operating_cash_flow: 0,
                      debt_service_cash_flow: 0,
                      shareholders_cash_flow: 0,
                      net_cash_flow: 0,
                      sales_revenue: 0,
                      production_value: 0,
                      gross_operating_margin: 0,
                      ebit: 0,
                      ebt: 0,
                      net_income: 0,
                      dividends: 0,
                      net_tangible_assets: 0,
                      net_intangible_assets: 0,
                      financial_assets: 0,
                      trade_assets: 0,
                      inventory: 0,
                      deferred_liquidity: 0,
                      immediate_liquidity: 0,
                      equity: 0,
                      long_term_debt: 0,
                      short_term_debt: 0,
                      net_financial_position: 0,
                      mortgage_loans: 0,
                      other_financial_debts: 0,
                      cash_and_banks: 0,
                    },
                    {
                      year: 2,
                      gross_operating_cash_flow: 0,
                      working_capital_change: 0,
                      current_management_cash_flow: 0,
                      operating_cash_flow: 0,
                      debt_service_cash_flow: 0,
                      shareholders_cash_flow: 0,
                      net_cash_flow: 0,
                      sales_revenue: 0,
                      production_value: 0,
                      gross_operating_margin: 0,
                      ebit: 0,
                      ebt: 0,
                      net_income: 0,
                      dividends: 0,
                      net_tangible_assets: 0,
                      net_intangible_assets: 0,
                      financial_assets: 0,
                      trade_assets: 0,
                      inventory: 0,
                      deferred_liquidity: 0,
                      immediate_liquidity: 0,
                      equity: 0,
                      long_term_debt: 0,
                      short_term_debt: 0,
                      net_financial_position: 0,
                      mortgage_loans: 0,
                      other_financial_debts: 0,
                      cash_and_banks: 0,
                    },
                    {
                      year: 3,
                      gross_operating_cash_flow: 0,
                      working_capital_change: 0,
                      current_management_cash_flow: 0,
                      operating_cash_flow: 0,
                      debt_service_cash_flow: 0,
                      shareholders_cash_flow: 0,
                      net_cash_flow: 0,
                      sales_revenue: 0,
                      production_value: 0,
                      gross_operating_margin: 0,
                      ebit: 0,
                      ebt: 0,
                      net_income: 0,
                      dividends: 0,
                      net_tangible_assets: 0,
                      net_intangible_assets: 0,
                      financial_assets: 0,
                      trade_assets: 0,
                      inventory: 0,
                      deferred_liquidity: 0,
                      immediate_liquidity: 0,
                      equity: 0,
                      long_term_debt: 0,
                      short_term_debt: 0,
                      net_financial_position: 0,
                      mortgage_loans: 0,
                      other_financial_debts: 0,
                      cash_and_banks: 0,
                    },
                  ]
            }
          />
        </div>
      </div>

      {/* Ratios Analysis Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Ratios Analysis
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Financial ratios and performance indicators
            </p>
          </div>
          <RatiosAnalysis
            ratiosAnalysis={
              formData.ratiosAnalysis && formData.ratiosAnalysis.length > 0
                ? formData.ratiosAnalysis
                : [
                    {
                      year: 1,
                      roi: 0,
                      roe: 0,
                      ros: 0,
                      ebit_margin: 0,
                      net_debt_to_ebitda: 0,
                      net_debt_to_equity: 0,
                      net_debt_to_revenue: 0,
                      current_ratio: 0,
                      quick_ratio: 0,
                      debt_to_equity: 0,
                      treasury_margin: 0,
                      structural_margin: 0,
                      net_working_capital: 0,
                      altman_z_score: 0,
                    },
                    {
                      year: 2,
                      roi: 0,
                      roe: 0,
                      ros: 0,
                      ebit_margin: 0,
                      net_debt_to_ebitda: 0,
                      net_debt_to_equity: 0,
                      net_debt_to_revenue: 0,
                      current_ratio: 0,
                      quick_ratio: 0,
                      debt_to_equity: 0,
                      treasury_margin: 0,
                      structural_margin: 0,
                      net_working_capital: 0,
                      altman_z_score: 0,
                    },
                    {
                      year: 3,
                      roi: 0,
                      roe: 0,
                      ros: 0,
                      ebit_margin: 0,
                      net_debt_to_ebitda: 0,
                      net_debt_to_equity: 0,
                      net_debt_to_revenue: 0,
                      current_ratio: 0,
                      quick_ratio: 0,
                      debt_to_equity: 0,
                      treasury_margin: 0,
                      structural_margin: 0,
                      net_working_capital: 0,
                      altman_z_score: 0,
                    },
                  ]
            }
          />
        </div>
      </div>

      {/* Production Sales Forecast Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Production & Sales Forecast
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Production metrics, sales forecasts, and management team
              information
            </p>
          </div>
          <ProductionSalesForecast
            profitLossProjection={
              (formData as any).profitLossProjection &&
              (formData as any).profitLossProjection.length > 0
                ? (formData as any).profitLossProjection
                : formData.productionSalesForecast &&
                  formData.productionSalesForecast.length > 0
                ? formData.productionSalesForecast.map((item: any) => ({
                    year: item.year || 0,
                    ricavi_vendite_prestazioni: item.sales_revenue || 0,
                    acquisti_merci: 0,
                    acquisti_servizi: 0,
                    godimento_beni_terzi: 0,
                    valore_aggiunto: 0,
                    costi_personale: 0,
                    margine_operativo_lordo: 0,
                    ammortamenti_immateriali: 0,
                    ammortamenti_materiali: 0,
                    risultato_operativo: 0,
                    oneri_finanziari: 0,
                    risultato_prima_imposte: 0,
                    imposte_reddito: 0,
                    utile_netto: 0,
                  }))
                : [
                    {
                      year: 1,
                      ricavi_vendite_prestazioni: 0,
                      acquisti_merci: 0,
                      acquisti_servizi: 0,
                      godimento_beni_terzi: 0,
                      valore_aggiunto: 0,
                      costi_personale: 0,
                      margine_operativo_lordo: 0,
                      ammortamenti_immateriali: 0,
                      ammortamenti_materiali: 0,
                      risultato_operativo: 0,
                      oneri_finanziari: 0,
                      risultato_prima_imposte: 0,
                      imposte_reddito: 0,
                      utile_netto: 0,
                    },
                    {
                      year: 2,
                      sales_revenue: 0,
                      revenue_growth: 0,
                      units_sold: 0,
                      average_price: 0,
                      unit_production_cost: 0,
                      unit_margin: 0,
                    },
                    {
                      year: 3,
                      sales_revenue: 0,
                      revenue_growth: 0,
                      units_sold: 0,
                      average_price: 0,
                      unit_production_cost: 0,
                      unit_margin: 0,
                    },
                  ]
            }
          />
        </div>
      </div>

      {/* Status Information */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Plan Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <span
              className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                planData.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {planData.status}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Created:</span>
            <span className="ml-2 text-gray-600">
              {new Date(planData.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Last Updated:</span>
            <span className="ml-2 text-gray-600">
              {new Date(planData.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

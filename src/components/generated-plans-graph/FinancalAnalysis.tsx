"use client";

import { IFinancialAnalysis } from "@/redux/types";

export default function FinancialAnalysis({
  financialAnalysis,
}: IFinancialAnalysis) {
  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return "$0";
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Define the metrics to display in rows
  const metrics = [
    { key: 'sales_revenue', label: 'Sales Revenue' },
    { key: 'production_value', label: 'Production Value' },
    { key: 'gross_operating_margin', label: 'Gross Operating Margin' },
    { key: 'ebit', label: 'EBIT' },
    { key: 'ebt', label: 'EBT' },
    { key: 'net_income', label: 'Net Income' },
    { key: 'gross_operating_cash_flow', label: 'Gross Operating Cash Flow' },
    { key: 'working_capital_change', label: 'Working Capital Change' },
    { key: 'current_management_cash_flow', label: 'Current Management Cash Flow' },
    { key: 'operating_cash_flow', label: 'Operating Cash Flow' },
    { key: 'debt_service_cash_flow', label: 'Debt Service Cash Flow' },
    { key: 'shareholders_cash_flow', label: 'Shareholders Cash Flow' },
    { key: 'net_cash_flow', label: 'Net Cash Flow' },
    { key: 'net_tangible_assets', label: 'Net Tangible Assets' },
    { key: 'net_intangible_assets', label: 'Net Intangible Assets' },
    { key: 'financial_assets', label: 'Financial Assets' },
    { key: 'trade_assets', label: 'Trade Assets' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'deferred_liquidity', label: 'Deferred Liquidity' },
    { key: 'immediate_liquidity', label: 'Immediate Liquidity' },
    { key: 'equity', label: 'Equity' },
    { key: 'long_term_debt', label: 'Long Term Debt' },
    { key: 'short_term_debt', label: 'Short Term Debt' },
    { key: 'net_financial_position', label: 'Net Financial Position' },
    { key: 'mortgage_loans', label: 'Mortgage Loans' },
    { key: 'other_financial_debts', label: 'Other Financial Debts' },
    { key: 'cash_and_banks', label: 'Cash & Banks' },
    { key: 'dividends', label: 'Dividends' },
  ];

  return (
    <div className="mx-auto space-y-10 mt-10">
      {/* Comprehensive Financial Analysis Table */}
      <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">
        Financial Analysis
      </h2>
      <div className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E6D8FF]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  Metrics
                </th>
                {financialAnalysis.map((item) => (
                  <th 
                    key={item.year} 
                    className="px-4 py-3 text-left text-sm font-medium text-[#121417]"
                  >
                    {item.year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr
                  key={metric.key}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b border-b-gray-200`}
                >
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {metric.label}
                  </td>
                  {financialAnalysis.map((item) => (
                    <td 
                      key={`${item.year}-${metric.key}`} 
                      className="px-4 py-3 text-sm font-normal text-[#61758A]"
                    >
                      {formatCurrency(item[metric.key as keyof typeof item] as number)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

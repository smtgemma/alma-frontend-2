'use client';

import React, { useMemo } from 'react';
import SmartNavbar from './SmartNavbar';
import { formatEuro } from '@/utils/euFormat';
import { useSmartForm } from './SmartFormContext';

interface GeneratedPlanOutputProps {
  planContent: string;
  planId?: string;
  generatedAt?: string;
  onBack?: () => void;
}

interface FinancialData {
  year: number;
  revenue?: number;
  net_income?: number;
  capex?: number;
  debt_repayment?: number;
  operating?: number;
  investing?: number;
  financing?: number;
  net_cash?: number;
  cogs?: number;
  gross_profit?: number;
  operating_expenses?: number;
  ebitda?: number;
  depreciation_amortization?: number;
  ebit?: number;
  interest?: number;
  taxes?: number;
  assets?: number;
  current_assets?: number;
  non_current_assets?: number;
  liabilities?: number;
  current_liabilities?: number;
  non_current_liabilities?: number;
  equity?: number;
  net_position?: number;
  repayment?: number;
  interest_rate?: number;
  outstanding_debt?: number;
  roi?: number;
  roe?: number;
  debt_to_equity?: number;
  gross_margin?: number;
  ebitda_margin?: number;
  net_margin?: number;
  current_ratio?: number;
  quick_ratio?: number;
  asset_turnover?: number;
  employee_costs?: number;
  marketing?: number;
  rent?: number;
  administration?: number;
  amortization?: number;
  other_expenses?: number;
  interest_expenses?: number;
  tax?: number;
}

interface BusinessPlanData {
  id?: string;
  executive_summary?: string;
  business_overview?: string;
  market_analysis?: string;
  business_model?: string;
  marketing_and_sales_strategy?: string;
  financial_highlights?: FinancialData[];
  cash_flow_analysis?: FinancialData[];
  profit_and_loss_projection?: FinancialData[];
  balance_sheet?: FinancialData[];
  net_financial_position?: FinancialData[];
  debt_structure?: FinancialData[];
  key_ratios?: FinancialData[];
  operating_cost_breakdown?: FinancialData[];
  sector_strategy?: string;
  funding_sources?: string;
  operations_plan?: string;
}

export default function GeneratedPlanOutput({ 
  planContent, 
  planId, 
  generatedAt, 
  onBack 
}: GeneratedPlanOutputProps) {
  const { getFormData } = useSmartForm();
  const step1 = getFormData('step1') as any;
  console.log('=== GENERATED PLAN OUTPUT RENDERED ===');
  console.log('Plan content received:', planContent);
  console.log('Plan content length:', planContent?.length);
  console.log('Plan ID:', planId);
  console.log('Generated at:', generatedAt);
  
  // Add a visual indicator if content is empty
  if (!planContent || planContent.trim() === '') {
    console.error('WARNING: Plan content is empty or null!');
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Plan Content Not Available</h2>
          <p className="text-gray-700 mb-4">The generated plan content is empty or null. Please try regenerating the plan.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Try to parse the plan content as JSON first
  let businessPlanData: BusinessPlanData | null = null;
  try {
    businessPlanData = JSON.parse(planContent);
  } catch (error) {
    console.log('Plan content is not JSON, treating as text');
  }

  // Derive Year 0 for Profit & Loss from extracted financial data if present
  const profitAndLossWithYear0 = useMemo(() => {
    const base = businessPlanData?.profit_and_loss_projection || [];
    try {
      const fin = (step1?.balanceSheetExtractions || [])[0]?.financial_data || {};
      const year0: any = { year: 0 };
      if (typeof fin.revenue === 'number') year0.revenue = fin.revenue;
      if (typeof fin.cogs === 'number') year0.cogs = fin.cogs;
      if (typeof fin.operating_expenses === 'number') year0.operating_expenses = fin.operating_expenses;
      if (typeof fin.amortization === 'number' || typeof fin.depreciation_amortization === 'number') {
        year0.depreciation_amortization = fin.depreciation_amortization ?? fin.amortization;
      }
      if (typeof fin.net_income === 'number') year0.net_income = fin.net_income;
      // Only prepend if we have at least one numeric field
      const hasAny = ['revenue','cogs','operating_expenses','depreciation_amortization','net_income'].some(k => typeof year0[k as keyof typeof year0] === 'number');
      if (hasAny) return [year0, ...base];
    } catch {}
    return base;
  }, [businessPlanData?.profit_and_loss_projection, step1?.balanceSheetExtractions]);

  // Format currency (EU)
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return formatEuro(amount, { decimals: 2, withSymbol: true });
  };

  // Format percentage
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(1)}%`;
  };

  // Format ratio
  const formatRatio = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return value.toFixed(2);
  };

  // Render financial table
  const renderFinancialTable = (data: FinancialData[] | undefined, title: string, columns: string[]) => {
    if (!data || data.length === 0) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                {columns.map((column) => (
                  <th key={column} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{row.year}</td>
                  {columns.map((column) => {
                    const key = column.toLowerCase().replace(/\s+/g, '_') as keyof FinancialData;
                    const value = row[key];
                    if (typeof value === 'number') {
                      if (column.includes('Revenue') || column.includes('Income') || column.includes('Profit') || 
                          column.includes('Assets') || column.includes('Liabilities') || column.includes('Equity') ||
                          column.includes('Cash') || column.includes('Debt') || column.includes('Costs') ||
                          column.includes('Expenses') || column.includes('Tax') || column.includes('Capex') ||
                          column.includes('Repayment')) {
                        return (
                          <td key={column} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(value)}
                          </td>
                        );
                      } else if (column.includes('Rate') || column.includes('Ratio') || column.includes('Turnover')) {
                        return (
                          <td key={column} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {formatRatio(value)}
                          </td>
                        );
                      } else {
                        return (
                          <td key={column} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {formatPercentage(value)}
                          </td>
                        );
                      }
                    }
                    return (
                      <td key={column} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {value || 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render text section
  const renderTextSection = (title: string, content: string | undefined) => {
    if (!content) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="prose max-w-none text-gray-700 leading-relaxed">
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph.trim() || '\u00A0'}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <SmartNavbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-400 rounded-sm mr-3"></div>
            <h1 className="text-xl font-semibold text-gray-900">Business AI Plan</h1>
          </div>
          {businessPlanData?.id && (
            <div className="text-sm text-gray-500">ID: {businessPlanData.id}</div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-800 font-medium">Generated web version only for admin to view.</p>
          <p className="text-red-600 text-sm mt-1">*The users will only be able to view it after your approval*</p>
        </div>
      </div>

      {/* Plan Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Profile Section (from Visura Camerale if available) */}
          {(step1?.extractedCompanyName || step1?.extractedCompanyId || step1?.extractedFounders || step1?.extractedEstablishmentDate) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profilo Aziendale</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                {step1?.extractedCompanyName && (
                  <div>
                    <div className="text-sm text-gray-500">Ragione sociale</div>
                    <div className="font-medium">{step1.extractedCompanyName}</div>
                  </div>
                )}
                {step1?.extractedCompanyId && (
                  <div>
                    <div className="text-sm text-gray-500">ID Impresa (P.IVA / CF)</div>
                    <div className="font-medium">{step1.extractedCompanyId}</div>
                  </div>
                )}
                {step1?.extractedEstablishmentDate && (
                  <div>
                    <div className="text-sm text-gray-500">Data di costituzione</div>
                    <div className="font-medium">{step1.extractedEstablishmentDate}</div>
                  </div>
                )}
                {step1?.extractedFounders && (
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500">Soci / Fondatori</div>
                    <div className="font-medium">{step1.extractedFounders}</div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Executive Summary */}
          {renderTextSection('Executive Summary', businessPlanData?.executive_summary)}

          {/* Business Overview */}
          {renderTextSection('Business Overview', businessPlanData?.business_overview)}

          {/* Market Analysis */}
          {renderTextSection('Market Analysis', businessPlanData?.market_analysis)}

          {/* Business Model */}
          {renderTextSection('Business Model', businessPlanData?.business_model)}

          {/* Marketing and Sales Strategy */}
          {renderTextSection('Marketing and Sales Strategy', businessPlanData?.marketing_and_sales_strategy)}

          {/* Financial Highlights */}
          {renderFinancialTable(businessPlanData?.financial_highlights, 'Financial Highlights', ['Revenue', 'Net Income', 'Capex', 'Debt Repayment'])}

          {/* Cash Flow Analysis */}
          {renderFinancialTable(businessPlanData?.cash_flow_analysis, 'Cash Flow Analysis', ['Operating', 'Investing', 'Financing', 'Net Cash'])}

          {/* Profit and Loss Projection (with Year 0 if available) */}
          {renderFinancialTable(profitAndLossWithYear0, 'Profit and Loss Projection', ['Revenue', 'COGS', 'Gross Profit', 'Operating Expenses', 'EBITDA', 'Net Income'])}

          {/* Balance Sheet */}
          {renderFinancialTable(businessPlanData?.balance_sheet, 'Balance Sheet', ['Assets', 'Current Assets', 'Non-Current Assets', 'Liabilities', 'Current Liabilities', 'Non-Current Liabilities', 'Equity'])}

          {/* Net Financial Position */}
          {renderFinancialTable(businessPlanData?.net_financial_position, 'Net Financial Position', ['Net Position'])}

          {/* Debt Structure */}
          {renderFinancialTable(businessPlanData?.debt_structure, 'Debt Structure', ['Repayment', 'Interest Rate', 'Outstanding Debt'])}

          {/* Key Ratios */}
          {renderFinancialTable(businessPlanData?.key_ratios, 'Key Ratios', ['ROI', 'ROE', 'Debt to Equity', 'Gross Margin', 'EBITDA Margin', 'Net Margin', 'Current Ratio', 'Quick Ratio', 'Asset Turnover'])}

          {/* Operating Cost Breakdown */}
          {renderFinancialTable(businessPlanData?.operating_cost_breakdown, 'Operating Cost Breakdown', ['Revenue', 'COGS', 'Employee Costs', 'Marketing', 'Rent', 'Administration', 'Other Expenses', 'Interest Expenses', 'Tax'])}

          {/* Sector Strategy */}
          {/* {renderTextSection('Sector Strategy', businessPlanData?.sector_strategy)} */}

          {/* Funding Sources */}
          {renderTextSection('Funding Sources', businessPlanData?.funding_sources)}

          {/* Operations Plan */}
          {/* {renderTextSection('Operations Plan', businessPlanData?.operations_plan)} */}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Form
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              console.log('=== DOWNLOAD BUTTON CLICKED ===');
              console.log('Plan content to download:', planContent);
              console.log('Plan content length:', planContent?.length);
              
              const blob = new Blob([planContent || ''], { type: 'text/plain' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `business-plan-${planId || Date.now()}.txt`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }}
            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Download Plan
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('=== TEST PLAN CONTENT ===');
              console.log('Current plan content:', planContent);
              console.log('Content length:', planContent?.length);
              alert(`Plan content length: ${planContent?.length || 0} characters\nFirst 100 chars: ${planContent?.substring(0, 100) || 'No content'}`);
            }}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Plan Content
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}

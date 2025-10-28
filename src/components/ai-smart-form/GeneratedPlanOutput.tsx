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
  const { getFormData, getAggregatedData } = useSmartForm();
  const step1 = getFormData('step1') as any;
  const step2 = getFormData('step2') as any;
  const step3 = getFormData('step3') as any;
  const step4 = getFormData('step4') as any;
  const step5 = getFormData('step5') as any;
  const step6 = getFormData('step6') as any;
  const step7 = getFormData('step7') as any;
  const step8 = getFormData('step8') as any;
  const step9 = getFormData('step9') as any;
  const aggregatedData = getAggregatedData();
  console.log('=== GENERATED PLAN OUTPUT RENDERED ===');
  console.log('Plan content received:', planContent);
  console.log('Plan content length:', planContent?.length);
  console.log('Plan ID:', planId);
  console.log('Generated at:', generatedAt);
  console.log('Form data:', { step1, step2, step3, step4, step5, step6, step7, step8, step9 });
  
  // Generate business plan content from form data
  const generateBusinessOverview = () => {
    const businessName = step1?.businessName || 'La nostra azienda';
    const activity = step1?.activity || 'attività commerciale';
    const location = step1?.location || 'il nostro territorio';
    const productService = step2?.productService === 'Product' ? 'prodotti' : 'servizi';
    const stage = step2?.businessStage || 'fase di sviluppo';
    
    return `${businessName} è un'azienda specializzata in ${activity}, operante in ${location}. 
La nostra organizzazione si concentra sulla fornitura di ${productService} di alta qualità, posizionandosi attualmente nella ${stage}.

La nostra missione è ${step4?.mission || 'fornire soluzioni innovative ai nostri clienti'}, mentre la nostra visione a lungo termine prevede ${step4?.longTermVision || 'una crescita sostenibile nel mercato di riferimento'}.

I nostri obiettivi aziendali includono ${step4?.businessGoals || 'l\'espansione del business e il miglioramento continuo dei nostri servizi'}.`;
  };
  
  const generateMarketAnalysis = () => {
    const industry = step5?.industry || 'il nostro settore di riferimento';
    const idealClient = step5?.idealClient || 'clienti target';
    const marketingPlan = step5?.marketingPlan || 'strategie di marketing mirate';
    
    return `La nostra analisi di mercato si concentra su ${industry}, dove identifichiamo ${idealClient} come nostro target principale.

La strategia di marketing prevede ${marketingPlan} per raggiungere efficacemente il nostro pubblico di riferimento.

Il mercato presenta opportunità significative di crescita, e la nostra posizione competitiva ci permette di sfruttare al meglio queste opportunità attraverso la nostra proposta di valore unica.`;
  };
  
  const generateBusinessModel = () => {
    const deliveryMethod = step2?.deliveryMethod || 'canali di distribuzione ottimizzati';
    const uniqueValue = step3?.uniqueValue || 'il nostro valore unico';
    const valueAdd = step3?.valueAddSupport || 'supporto aggiuntivo ai clienti';
    
    return `Il nostro modello di business si basa su ${deliveryMethod} per garantire la migliore esperienza cliente.

Ciò che ci distingue nel mercato è ${uniqueValue}, supportato da ${valueAdd} che aggiunge valore concreto per i nostri clienti.

Il modello operativo è progettato per massimizzare l'efficienza e garantire la sostenibilità economica a lungo termine.`;
  };
  
  const generateFundingSources = () => {
    const ownEquity = formatCurrency(parseFloat(step9?.yourOwnEquity?.replace(/[^0-9.-]/g, '') || '0'));
    const bankLoan = formatCurrency(parseFloat(step9?.bankingSystem?.replace(/[^0-9.-]/g, '') || '0'));
    const otherInvestors = formatCurrency(parseFloat(step9?.otherInvestors?.replace(/[^0-9.-]/g, '') || '0'));
    
    return `Le fonti di finanziamento per il progetto includono:\n
• Capitale proprio: ${ownEquity}\n• Finanziamento bancario: ${bankLoan}\n• Altri investitori: ${otherInvestors}

Questa diversificazione delle fonti di finanziamento garantisce una struttura finanziaria solida e sostenibile per lo sviluppo del business.`;
  };
  
  const generateExecutiveSummary = () => {
    const businessName = step1?.businessName || 'La nostra azienda';
    const activity = step1?.activity || 'attività commerciale';
    const expectedRevenue = step7?.revenueStreams?.reduce((total: number, stream: any) => total + parseFloat(stream.amount?.replace(/[^0-9.-]/g, '') || '0'), 0) || 0;
    
    return `${businessName} rappresenta un'opportunità di business innovativa nel settore ${activity}.

Con ricavi previsti di ${formatCurrency(expectedRevenue)} per il primo anno, l'azienda si posiziona strategicamente per catturare quote di mercato significative.

Il piano finanziario robusto e la strategia di mercato ben definita supportano una crescita sostenibile e profittevole nel medio-lungo termine.`;
  };
  
  // Generate financial data from form inputs
  const generateFormBasedFinancialData = () => {
    const expectedRevenue = step7?.revenueStreams?.reduce((total: number, stream: any) => 
      total + parseFloat(stream.amount?.replace(/[^0-9.-]/g, '') || '0'), 0
    ) || 0;
    
    const operatingCosts = step8?.operatingCostItems?.reduce((total: number, item: any) => 
      total + parseFloat(item.totalCost?.replace(/[^0-9.-]/g, '') || '0'), 0
    ) || 0;
    
    const netIncome = expectedRevenue - operatingCosts;
    
    // Generate basic financial highlights
    const financialHighlights: FinancialData[] = [
      {
        year: 1,
        revenue: expectedRevenue,
        net_income: netIncome,
        capex: step6?.fixedInvestments?.reduce((total: number, inv: any) => 
          total + parseFloat(inv.amount?.replace(/[^0-9.-]/g, '') || '0'), 0
        ) || 0,
        debt_repayment: 0
      }
    ];
    
    // Generate investment breakdown
    const investmentBreakdown: FinancialData[] = step6?.fixedInvestments
      ?.filter((inv: any) => inv.amount && parseFloat(inv.amount.replace(/[^0-9.-]/g, '') || '0') > 0)
      ?.map((inv: any, index: number) => ({
        year: index,
        assets: parseFloat(inv.amount.replace(/[^0-9.-]/g, '') || '0'),
        // Add investment category as a property that can be displayed
        ...(inv.label && { category: inv.label })
      })) || [];
    
    return {
      financial_highlights: financialHighlights,
      investment_breakdown: investmentBreakdown,
      funding_summary: {
        own_equity: parseFloat(step9?.yourOwnEquity?.replace(/[^0-9.-]/g, '') || '0'),
        bank_loan: parseFloat(step9?.bankingSystem?.replace(/[^0-9.-]/g, '') || '0'),
        other_investors: parseFloat(step9?.otherInvestors?.replace(/[^0-9.-]/g, '') || '0')
      }
    };
  };
  
  const formFinancialData = generateFormBasedFinancialData();
  
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
          {renderTextSection('Executive Summary', businessPlanData?.executive_summary || generateExecutiveSummary())}

          {/* Business Overview */}
          {renderTextSection('Business Overview', businessPlanData?.business_overview || generateBusinessOverview())}

          {/* Market Analysis */}
          {renderTextSection('Market Analysis', businessPlanData?.market_analysis || generateMarketAnalysis())}

          {/* Business Model */}
          {renderTextSection('Business Model', businessPlanData?.business_model || generateBusinessModel())}

          {/* Marketing and Sales Strategy */}
          {renderTextSection('Marketing and Sales Strategy', businessPlanData?.marketing_and_sales_strategy || generateMarketAnalysis())}

          {/* Financial Highlights */}
          {renderFinancialTable(
            businessPlanData?.financial_highlights || formFinancialData.financial_highlights, 
            'Evidenze Finanziarie (Financial Highlights)', 
            ['Revenue', 'Net Income', 'Capex', 'Debt Repayment']
          )}
          
          {/* Investment Breakdown (from form data) */}
          {formFinancialData.investment_breakdown.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Dettaglio Investimenti</h3>
              <div className="space-y-3">
                {formFinancialData.investment_breakdown.map((inv: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">{(inv as any).category || `Investimento ${index + 1}`}</span>
                    <span className="text-gray-900 font-semibold">{formatCurrency(inv.assets || 0)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 font-bold text-lg border-t-2 border-gray-300">
                  <span>Totale Investimenti</span>
                  <span>{formatCurrency(formFinancialData.investment_breakdown.reduce((sum: number, inv: any) => sum + (inv.assets || 0), 0))}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Funding Summary (from form data) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Riepilogo Finanziamenti</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Capitale Proprio</span>
                <span className="text-gray-900 font-semibold">{formatCurrency(formFinancialData.funding_summary.own_equity)}</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Finanziamento Bancario</span>
                <span className="text-gray-900 font-semibold">{formatCurrency(formFinancialData.funding_summary.bank_loan)}</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Altri Investitori</span>
                <span className="text-gray-900 font-semibold">{formatCurrency(formFinancialData.funding_summary.other_investors)}</span>
              </div>
              <div className="flex justify-between items-center p-3 font-bold text-lg border-t-2 border-gray-300">
                <span>Totale Finanziamenti</span>
                <span>{formatCurrency(formFinancialData.funding_summary.own_equity + formFinancialData.funding_summary.bank_loan + formFinancialData.funding_summary.other_investors)}</span>
              </div>
            </div>
          </div>

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
          {renderTextSection('Fonti di Finanziamento', businessPlanData?.funding_sources || generateFundingSources())}

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
              
              // Generate comprehensive business plan content
              const businessPlanText = `
🏢 PIANO AZIENDALE - ${step1?.businessName || 'Business Plan'}
${'='.repeat(60)}

Generato il: ${new Date().toLocaleDateString('it-IT')}
ID Piano: ${planId || 'N/A'}

📋 SOMMARIO ESECUTIVO
${'='.repeat(60)}
${generateExecutiveSummary()}

🏢 PANORAMICA AZIENDALE  
${'='.repeat(60)}
${generateBusinessOverview()}

📊 ANALISI DI MERCATO
${'='.repeat(60)}
${generateMarketAnalysis()}

💼 MODELLO DI BUSINESS
${'='.repeat(60)}
${generateBusinessModel()}

💰 FONTI DI FINANZIAMENTO
${'='.repeat(60)}
${generateFundingSources()}

📈 DATI FINANZIARI
${'='.repeat(60)}
Ricavi Previsti Anno 1: ${formatCurrency(formFinancialData.financial_highlights[0]?.revenue || 0)}
Utile Netto Anno 1: ${formatCurrency(formFinancialData.financial_highlights[0]?.net_income || 0)}
Investimenti Totali: ${formatCurrency(formFinancialData.investment_breakdown.reduce((sum: number, inv: any) => sum + (inv.assets || 0), 0))}

💼 DETTAGLIO INVESTIMENTI
${'='.repeat(60)}
${formFinancialData.investment_breakdown.map((inv: any, index: number) => 
  `• ${(inv as any).category || `Investimento ${index + 1}`}: ${formatCurrency(inv.assets || 0)}`
).join('\n')}

🏦 RIEPILOGO FINANZIAMENTI
${'='.repeat(60)}
• Capitale Proprio: ${formatCurrency(formFinancialData.funding_summary.own_equity)}
• Finanziamento Bancario: ${formatCurrency(formFinancialData.funding_summary.bank_loan)}
• Altri Investitori: ${formatCurrency(formFinancialData.funding_summary.other_investors)}
• Totale Finanziamenti: ${formatCurrency(formFinancialData.funding_summary.own_equity + formFinancialData.funding_summary.bank_loan + formFinancialData.funding_summary.other_investors)}

📊 DATI MODULO
${'='.repeat(60)}
${aggregatedData.user_input.map(input => `${input.question}: ${input.answer}`).join('\n')}

${'='.repeat(60)}
Piano generato da: AI Smart Form
Data: ${new Date().toISOString()}
              `;
              
              console.log('Generated business plan content:', businessPlanText);
              
              const blob = new Blob([businessPlanText], { type: 'text/plain; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `piano-aziendale-${step1?.businessName?.replace(/[^a-zA-Z0-9]/g, '-') || 'business-plan'}-${Date.now()}.txt`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }}
            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Scarica Piano
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

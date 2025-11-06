"use client";

import { IBalanceSheet } from "@/redux/types";
import { useSmartForm } from "@/components/ai-smart-form/SmartFormContext";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Label,
} from "recharts";
// src/components/generated-plans-graph/BalanceSheet.tsx
// Default pie chart data (fallback)
const defaultPieChartData = [
  { name: "Attività", value: 40, fill: "#8B5CF6" },
  { name: "Passività", value: 40, fill: "#1E1B4B" },
  { name: "Patrimonio netto", value: 20, fill: "#EF4444" },
];

import { formatEuro } from "@/utils/euFormat";
// Format currency for display (EU)
const formatCurrency = (value: number) => {
  if (value === undefined || value === null || isNaN(value)) return "€ 0,00";
  return formatEuro(Number(value), { decimals: 2, withSymbol: true });
};

// Custom label component for pie chart - values inside segments with names
const CustomLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;

  if (!percent || percent < 0.01) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <text
        x={x}
        y={y - 8}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="16"
        fontWeight="bold"
        style={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
          pointerEvents: "none",
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text
        x={x}
        y={y + 8}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fontWeight="normal"
        style={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
          pointerEvents: "none",
        }}
      >
        {name}
      </text>
    </g>
  );
};

// Extract balance sheet components from your exact data structure
const extractBalanceSheetComponents = (item: any) => {
  if (!item || typeof item !== 'object') {
    return { assets: 0, liabilities: 0, equity: 0 };
  }
  
  // Use your exact data structure fields
  // Assets: Use invested_capital (represents total capital invested)
  const assets = item.invested_capital || item.sources_of_financing || 0;
  
  // Equity: Use net_equity (represents shareholders' equity)
  const equity = item.net_equity || 0;
  
  // Liabilities: For balance sheet visualization, we can use net_financial_debt
  // as it represents the debt/liability portion, or calculate as Assets - Equity
  const netFinancialDebt = item.net_financial_debt || 0;
  const calculatedLiabilities = Math.max(0, assets - equity);
  
  // Use the larger of the two liability calculations
  const liabilities = Math.max(netFinancialDebt, calculatedLiabilities);
  
  // Debug: Log extracted values for verification
  if (assets > 0 || liabilities > 0 || equity > 0) {
    console.log('✅ Successfully extracted:', {
      year: item.year,
      assets,
      liabilities, 
      equity,
      source_invested_capital: item.invested_capital,
      source_net_equity: item.net_equity,
      source_net_financial_debt: item.net_financial_debt
    });
  }
  
  return { assets, liabilities, equity };
};

export default function BalanceSheet({
  balanceSheet,
  netFinancialPosition,
  balanceSheetAnalysis,
}: IBalanceSheet) {
  // Debug: Log the incoming data and test extraction (only once)
  if (balanceSheet?.length > 0) {
    console.log("📊 BalanceSheet received:", balanceSheetAnalysis, "items");
 
    const testItem = balanceSheet[balanceSheet.length - 1];
    const testExtraction = extractBalanceSheetComponents(testItem);
    console.log('🎯 Test extraction result:', testExtraction);
  }
  // Inject Year 0 from Balance Sheet extractions (if available)
  let step1: any = null;
  try {
    const { getFormData } = useSmartForm();
    step1 = getFormData("step1") as any;
  } catch (e) {
    // If SmartFormProvider is not present, gracefully skip using step1 context
    step1 = null;
  }

  let enhancedBalanceSheet = balanceSheet;
  try {
    const bsExtra = (step1?.balanceSheetExtractions || [])[0];
    const fin = bsExtra?.financial_data || {};
    // Try to derive assets/liabilities/equity from financial_data keys if present
    const year0: any = { year: 0 };
    
    // Map extracted financial data to your balance sheet structure if available
    if (fin.assets || fin.current_assets || fin.non_current_assets) {
      const assets = fin.assets ?? (fin.current_assets || 0) + (fin.non_current_assets || 0);
      const liabilities = fin.liabilities ?? (fin.current_liabilities || 0) + (fin.non_current_liabilities || 0);
      const equity = fin.equity ?? fin.net_equity ?? (typeof assets === "number" && typeof liabilities === "number" ? assets - liabilities : undefined);
      
      // Map to your structure
      if (typeof assets === "number") year0.invested_capital = assets;
      if (typeof equity === "number") year0.net_equity = equity;
      if (typeof liabilities === "number") year0.net_financial_debt = liabilities;
      year0.sources_of_financing = assets;
    }

    if (year0.invested_capital || year0.net_equity || year0.net_financial_debt) {
      enhancedBalanceSheet = [year0, ...balanceSheet];
    }
  } catch (e) {
    // fail-safe: do nothing
  }
  // Helper: safely extract possible fields from API item (supports legacy and new backend keys)
  const getFieldValue = (item: any, key: string) => {
    if (!item) {
      return 0;
    }
    
    // Support alternative backend field names
    const fieldAliases: Record<string, string[]> = {
      invested_capital: [
        "total_invested_capital",
        "net_invested_capital",
        "total_funding_sources",
        "total_funding_sources_eur",
        "total_funding_sources_amount",
        "total_funding_sources_value",
        "total_funding_sources"
      ],
      net_equity: [
        "total_equity",
        "equity",
      ],
      net_fixed_assets: [
        "total_fixed_assets",
        "fixed_assets",
      ],
      net_operating_working_capital: [
        "net_operating_current_assets",
        "net_working_capital",
      ],
      cash_and_banks: [
        "cash_bank_accounts",
        "cash_bank",
        "cash_and_bank",
      ],
      net_financial_debt: [
        "net_financial_debt",
      ],
    };

    let value = item[key];
    if (value === undefined && fieldAliases[key]) {
      for (const alias of fieldAliases[key]) {
        if (item[alias] !== undefined && item[alias] !== null) {
          value = item[alias];
          break;
        }
      }
    }
    
    // Handle numeric values
    if (typeof value === "number") {
      return value;
    }
    
    // Handle string values
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    
    // Return 0 for undefined, null, or invalid values
    return 0;
  };


  // Determine which columns to show in the table: pick two fields that actually have values
  const italianLabels: Record<string, string> = {
    // Computed fields
    assets: "Attività Totali",
    liabilities: "Passività Totali", 
    equity: "Patrimonio Netto",
    // Italian field names (from your console logs)
    totale_attivita: "Totale Attività",
    attivita_correnti: "Attività Correnti",
    attivita_non_correnti: "Attività Non Correnti",
    passivita_correnti: "Passività Correnti",
    // English field names (original structure)
    net_equity: "Patrimonio Netto",
    invested_capital: "Capitale Investito",
    net_fixed_assets: "Attività Fisse Nette",
    net_operating_working_capital: "Capitale Circolante Netto Operativo",
    net_financial_debt: "Indebitamento Finanziario Netto",
    share_capital: "Capitale Sociale",
    reserves: "Riserve",
    profit_loss: "Utile/Perdita",
    sources_of_financing: "Fonti di Finanziamento",
    intangible_assets: "Attività Immateriali",
    tangible_assets: "Attività Materiali",
    financial_assets: "Attività Finanziarie",
    inventories: "Rimanenze",
    net_receivables_from_customers: "Crediti Netti verso Clienti",
    cash_and_banks: "Cassa e Banche",
    current_assets: "Attività Correnti",
    non_current_assets: "Attività Non Correnti",
    current_liabilities: "Passività Correnti",
    non_current_liabilities: "Passività Non Correnti",
    short_term_bank_debts: "Debiti Bancari a Breve Termine",
    long_term_bank_debts: "Debiti Bancari a Lungo Termine",
    payables_to_suppliers: "Debiti verso Fornitori",
    other_operating_payables: "Altri Debiti Operativi",
  };

  const priorityKeys = [
    "invested_capital",
    "net_equity",
    "net_financial_debt",
    "net_fixed_assets",
    "net_operating_working_capital",
    "cash_and_banks",
    "share_capital",
    "reserves",
    "profit_loss",
    "assets",
    "liabilities",
    "equity",
  ];

  const activeKeys = priorityKeys.filter((k) => {
    return balanceSheet?.some((row: any) => {
      if (k === "assets" || k === "liabilities" || k === "equity") {
        const buckets = extractBalanceSheetComponents(row);
        return (buckets as any)[k] !== 0;
      }
      return getFieldValue(row, k) !== 0;
    });
  });

  // Use the actual keys from your data structure
  const combinedKeys = [
    "invested_capital",
    "net_equity", 
    "net_financial_debt",
    "net_fixed_assets",
    "net_operating_working_capital",
    "cash_and_banks"
  ];
  // Generate dynamic pie chart data from balanceSheet - Balance Sheet Components
  const pieChartData = useMemo(() => {
    if (!balanceSheet || balanceSheet.length === 0) {
      return [
        {
          name: "Attività",
          value: 0,
          fill: "#8B5CF6",
          actualValue: 0,
          formattedValue: formatCurrency(0),
        },
        {
          name: "Passività",
          value: 0,
          fill: "#1E1B4B",
          actualValue: 0,
          formattedValue: formatCurrency(0),
        },
        {
          name: "Patrimonio netto",
          value: 0,
          fill: "#EF4444",
          actualValue: 0,
          formattedValue: formatCurrency(0),
        },
      ];
    }

    // Use the latest year item from balanceSheet for pie chart data (last item usually has the most recent data)
    const item = balanceSheet[balanceSheet.length - 1] as any;
    
    // Use the robust extraction function
    const { assets, liabilities, equity } = extractBalanceSheetComponents(item);
    

    // Calculate total for percentage calculation using absolute values
    const absAssets = Math.abs(assets);
    const absLiabilities = Math.abs(liabilities);
    const absEquity = Math.abs(equity);
    const total = absAssets + absLiabilities + absEquity;

    if (total === 0) {
      return [
        {
          name: "Attività",
          value: 0,
          fill: "#8B5CF6",
          actualValue: 0,
          formattedValue: formatCurrency(0),
        },
        {
          name: "Passività",
          value: 0,
          fill: "#1E1B4B",
          actualValue: 0,
          formattedValue: formatCurrency(0),
        },
        {
          name: "Patrimonio netto",
          value: 0,
          fill: "#EF4444",
          actualValue: 0,
          formattedValue: formatCurrency(0),
        },
      ];
    }

    const assetsPercentage = (absAssets / total) * 100;
    const liabilitiesPercentage = (absLiabilities / total) * 100;
    const equityPercentage = (absEquity / total) * 100;

    // Create segments for all three components
    const segments = [
      {
        name: "Attività",
        value: Math.round(assetsPercentage),
        fill: "#8B5CF6",
        actualValue: assets,
        formattedValue: formatCurrency(assets),
      },
      {
        name: "Passività",
        value: Math.round(liabilitiesPercentage),
        fill: "#1E1B4B",
        actualValue: liabilities,
        formattedValue: formatCurrency(liabilities),
      },
      {
        name: "Patrimonio netto",
        value: Math.round(equityPercentage),
        fill: "#EF4444",
        actualValue: equity,
        formattedValue: formatCurrency(equity),
      },
    ];

    return segments;
  }, [balanceSheet]); // Add dependency array to prevent continuous recalculation

  return (
    <div className="mt-10 mx-auto space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        9. Stato Patrimoniale
      </h2>
      {/* Balance Sheet Table */}
      <div className="pdf-no-break">
        <div className="overflow-x-auto">
          <table className="w-full pdf-table">
            <thead>
              <tr className="bg-purple-100">
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  {/* Year */}
                  Anno
                </th>
                {combinedKeys.map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left text-sm font-medium text-[#121417]"
                  >
                    {italianLabels[key] || key}
                  </th>
                ))}
              </tr>
            </thead>
           
            <tbody>
              {balanceSheet?.map((item: any, index) => (
                <tr
                  key={item.year}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    Anno {item.year}
                  </td>
                  {combinedKeys.map((key) => {
                    // compute value per selected key
                    let value = 0;
                    if (
                      key === "assets" ||
                      key === "liabilities" ||
                      key === "equity"
                    ) {
                      const buckets = extractBalanceSheetComponents(item);
                      value = (buckets as any)[key] || 0;
                    } else {
                      value = getFieldValue(item, key);
                    }
                    
                    // Debug: Log the first item's values to verify extraction
                    if (index === 0) {
                      console.log(`🔍 Year ${item.year}, Key: ${key}, Raw value: ${item[key]}, Processed value: ${value}`);
                    }
                    
                    return (
                      <td
                        key={key}
                        className="px-4 py-3 text-sm font-normal text-[#61758A]"
                      >
                        {formatCurrency(value)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Sheet Analysis (replaces graph if provided) */}
      <div className="">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          9.1 Analisi dello stato patrimoniale
        </h2>
        {balanceSheetAnalysis && balanceSheetAnalysis.trim().length > 0 ? (
          <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line text-justify">
              {balanceSheetAnalysis}
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-80 sm:h-96 bg-white rounded-lg shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ backgroundColor: "white" }}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="35%"
                    outerRadius="90%"
                    paddingAngle={2}
                    dataKey="value"
                    label={CustomLabel}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value}% (${ 
                        props.payload.formattedValue ||
                        formatCurrency(props.payload.actualValue || 0)
                      })`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "#333",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
                    Bilancio
                  </div>
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
                    Patrimoniale
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Legend with actual values */}
            <div className="flex flex-col gap-4 mt-4 lg:mt-8 w-full lg:w-auto">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 text-center lg:text-left">
                Componenti dello stato patrimoniale
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {pieChartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg min-w-0 lg:min-w-[250px]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        {item.value}%
                      </span>
                      <span className="text-xs text-gray-600">
                        {item.formattedValue ||
                          formatCurrency(item.actualValue || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Net Financial Position Chart */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        10. Posizione Finanziaria Netta
      </h2>
      <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 pdf-no-break pdf-chart-container">
        <div className="bg-purple-500 text-white px-4 py-2 rounded-t-lg mb-4">
          <h2 className="text-lg font-semibold">
            {/* Net Financial Position */}
            Posizione Finanziaria Netta
          </h2>
        </div>
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">
              {/* Net Position */}
              Posizione netta
            </span>
          </div>
        </div>
        <div className="h-80 pdf-no-break">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={netFinancialPosition}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={(value) =>
                  `${value}${
                    value === 1
                      ? "st"
                      : value === 2
                      ? "nd"
                      : value === 3
                      ? "rd"
                      : "th"
                  } Year`
                }
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={(value) => formatCurrency(value)}
                domain={[0, 200000]}
              />
              <Tooltip
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Posizione netta",
                ]}
                labelFormatter={(label) =>
                  `${label}${
                    label === 1
                      ? "st"
                      : label === 2
                      ? "nd"
                      : label === 3
                      ? "rd"
                      : "th"
                  } Year`
                }
                contentStyle={{
                  backgroundColor: "#3B82F6",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="net_position"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: "#3B82F6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

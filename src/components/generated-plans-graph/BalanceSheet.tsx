"use client";

import { IBalanceSheet } from "@/redux/types";
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

// Format currency for display
const formatCurrency = (value: number) => {
  if (!value || isNaN(value)) return "$0";
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
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

export default function BalanceSheet({
  balanceSheet,
  netFinancialPosition,
}: IBalanceSheet) {
  // Helper: safely extract possible fields from API item (supports legacy and new backend keys)
  const getFieldValue = (item: any, key: string) => {
    // direct
    if (typeof item?.[key] === "number") return item[key] as number;
    return 0;
  };

  // Compute derived buckets compatible with pie-chart: Assets, Liabilities, Equity
  const computeBuckets = (raw: any) => {
    const equity =
      (typeof raw?.equity === "number" ? raw.equity : 0) ||
      (typeof raw?.net_equity === "number" ? raw.net_equity : 0);

    // Sum potential liability components if aggregate not provided
    const liabilitiesAggregate =
      (typeof raw?.liabilities === "number" ? raw.liabilities : 0) +
      getFieldValue(raw, "current_liabilities") +
      getFieldValue(raw, "non_current_liabilities") +
      getFieldValue(raw, "short_term_bank_debts") +
      getFieldValue(raw, "other_short_term_financial_debts") +
      getFieldValue(raw, "long_term_bank_debts") +
      getFieldValue(raw, "other_long_term_financial_debts") +
      getFieldValue(raw, "shareholder_loans") +
      getFieldValue(raw, "leasing_debts") +
      getFieldValue(raw, "payables_to_suppliers") +
      getFieldValue(raw, "payables_to_subsidiaries") +
      getFieldValue(raw, "other_operating_payables") +
      getFieldValue(raw, "accrued_expenses_and_prepaid_income_passive");

    const liabilities = liabilitiesAggregate;

    // Assets either provided, or derived as Liabilities + Equity (basic accounting identity)
    const providedAssets =
      (typeof raw?.assets === "number" ? raw.assets : 0) ||
      getFieldValue(raw, "current_assets") +
        getFieldValue(raw, "non_current_assets");

    const assets = providedAssets || equity + liabilities;

    return { assets, liabilities, equity };
  };

  // Determine which columns to show in the table: pick two fields that actually have values
  const italianLabels: Record<string, string> = {
    assets: "Attività",
    liabilities: "Passività",
    equity: "Patrimonio netto",
    net_equity: "Patrimonio netto",
    share_capital: "Capitale sociale",
    net_financial_debt: "Indebitamento finanziario netto",
    current_assets: "Attività correnti",
    non_current_assets: "Attività non correnti",
    current_liabilities: "Passività correnti",
    non_current_liabilities: "Passività non correnti",
  };

  const priorityKeys = [
    "assets",
    "liabilities",
    "equity",
    "net_equity",
    "share_capital",
    "net_financial_debt",
  ];

  const activeKeys = priorityKeys.filter((k) => {
    return balanceSheet?.some((row: any) => {
      if (k === "assets" || k === "liabilities" || k === "equity") {
        const buckets = computeBuckets(row);
        return (buckets as any)[k] !== 0;
      }
      return getFieldValue(row, k) !== 0;
    });
  });

  const tableKeys = (
    activeKeys.length > 0 ? activeKeys : ["equity", "assets"]
  ).slice(0, 2);

  // Always show the original columns; append the two dynamic ones if different
  const baseKeys = [
    "assets",
    "current_assets",
    "non_current_assets",
    "liabilities",
    "current_liabilities",
    "non_current_liabilities",
    "equity",
  ];

  const combinedKeys = [
    ...baseKeys,
    ...tableKeys.filter((k) => !baseKeys.includes(k)),
  ];
  // Generate dynamic pie chart data from balanceSheet - Balance Sheet Components
  const generatePieChartData = () => {
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

    // Use the first item from balanceSheet for pie chart data
    const item = balanceSheet[0] as any;
    const buckets = computeBuckets(item);
    const assets = buckets.assets || 0;
    const liabilities = buckets.liabilities || 0;
    const equity = buckets.equity || 0;

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
  };

  const pieChartData = generatePieChartData();

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
              {balanceSheet.map((item: any, index) => (
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
                      const buckets = computeBuckets(item);
                      value = (buckets as any)[key] || 0;
                    } else {
                      value = getFieldValue(item, key);
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

      {/* Balance Sheet Pie Chart */}
      <div className="">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          9.1 Analisi dello stato patrimoniale
        </h2>
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
                  {/* Balance */}
                  Bilancio
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
                  {/* Sheet */}
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

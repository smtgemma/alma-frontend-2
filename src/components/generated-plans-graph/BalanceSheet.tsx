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

// Default pie chart data (fallback)
const defaultPieChartData = [
  { name: "Assets", value: 40, fill: "#8B5CF6" },
  { name: "Liabilities", value: 40, fill: "#1E1B4B" },
  { name: "Equity", value: 20, fill: "#EF4444" },
];

// Format currency for display
const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
};

// Custom label component for pie chart - values inside segments
const CustomLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

  if (!percent || percent < 0.05) return null; // Don't show labels for very small segments

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fontWeight="bold"
        style={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
          pointerEvents: "none",
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

export default function BalanceSheet({
  balanceSheet,
  netFinancialPosition,
}: IBalanceSheet) {
  // Generate dynamic pie chart data from balanceSheet
  const generatePieChartData = () => {
    if (!balanceSheet || balanceSheet.length === 0) {
      return defaultPieChartData;
    }

    // Use the first item from balanceSheet for pie chart data
    const item = balanceSheet[0];
    const total = item.assets || 0;

    if (total === 0) {
      return defaultPieChartData;
    }

    // Calculate the percentages for Assets, Liabilities, and Equity
    const assetsPercentage = ((item.assets || 0) / total) * 100;
    const liabilitiesPercentage = ((item.liabilities || 0) / total) * 100;
    const equityPercentage = ((item.equity || 0) / total) * 100;

    return [
      { name: "Assets", value: Math.round(assetsPercentage), fill: "#8B5CF6" },
      {
        name: "Liabilities",
        value: Math.round(liabilitiesPercentage),
        fill: "#1E1B4B",
      },
      { name: "Equity", value: Math.round(equityPercentage), fill: "#EF4444" },
    ];
  };

  const pieChartData = generatePieChartData();

  return (
    <div className="mt-10 mx-auto space-y-8">
      <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">
        Balance Sheet
      </h2>
      {/* Balance Sheet Table */}
      <div className="">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-100">
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  Year
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  Assets
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  Current Assets
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  Non Current Assets
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  Liabilities
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  Current Liabilities
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  Non Current Liabilities
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  Equity
                </th>
              </tr>
            </thead>
            <tbody>
              {balanceSheet.map((item, index) => (
                <tr
                  key={item.year}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    Year {item.year}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(item.assets)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(item.current_assets)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(item.non_current_assets)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(item.liabilities)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(item.current_liabilities)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(item.non_current_liabilities)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(item.equity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Sheet Pie Chart */}
      <div className="">
        <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">
          Balance Sheet
        </h2>
        <div className="flex justify-center items-start gap-8">
          <div className="relative w-96 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={175}
                  paddingAngle={2}
                  dataKey="value"
                  label={CustomLabel}
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  Balance
                </div>
                <div className="text-lg font-semibold text-gray-800">Sheet</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 mt-8">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {item.name}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Net Financial Position Chart */}
      <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="bg-purple-500 text-white px-4 py-2 rounded-t-lg mb-4">
          <h2 className="text-lg font-semibold">Net Financial Position</h2>
        </div>
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Net Position</span>
          </div>
        </div>
        <div className="h-80">
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
                  "Net Position",
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

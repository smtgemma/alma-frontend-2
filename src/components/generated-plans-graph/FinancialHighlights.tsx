"use client";

import { IFinancial } from "@/redux/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function FinancialDashboard({
  financialHighlights,
  cashFlowAnalysisText,
  cashFlowAnalysis,
}: IFinancial) {
  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return "€0";
    return `€${Math.round(value).toLocaleString("it-IT")}`;
  };

  // Prepare chart data with Italian labels
  const chartData = financialHighlights?.map((item) => ({
    year: `Year ${item.year}`,
    redditoNetto: item.net_income || 0,
    ricavi: item.revenue || 0,
  })) || [];

  // Debug: Log chart data
  console.log("Financial Highlights Chart Data:", chartData);
  console.log("Has data:", chartData.length > 0);

  return (
    <div className="mx-auto space-y-10 mt-10 px-2 sm:px-4">

      {/* Financial Highlights Chart */}
      {/* <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Punti salienti finanziari{" "}
            <span className="inline-block px-3 py-1 ml-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm">
              Annuale
            </span>
          </h2>
          <div className="flex items-center space-x-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Reddito netto</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">Ricavi</span>
            </div>
          </div>
        </div>

        {chartData && chartData.length > 0 ? (
          <div className="h-64 sm:h-80 lg:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 30, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  vertical={false} 
                />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    const label = name === "ricavi" ? "Ricavi" : "Reddito netto";
                    return [formatCurrency(Number(value) || 0), label];
                  }}
                  labelStyle={{ color: "#fff" }}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    padding: "8px 12px",
                  }}
                />
                <Bar 
                  dataKey="ricavi" 
                  fill="#9CA3AF" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={60}
                  name="Ricavi"
                >
                  <LabelList
                    dataKey="ricavi"
                    position="top"
                    formatter={(value: any) => formatCurrency(Number(value) || 0)}
                    style={{ fontSize: "10px", fontWeight: "600", fill: "#4B5563" }}
                  />
                </Bar>
                <Bar 
                  dataKey="redditoNetto" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={60}
                  name="Reddito netto"
                >
                  <LabelList
                    dataKey="redditoNetto"
                    position="top"
                    formatter={(value: any) => formatCurrency(Number(value) || 0)}
                    style={{ fontSize: "10px", fontWeight: "600", fill: "#6B21A8" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 sm:h-80 lg:h-96 w-full flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                Nessun dato disponibile per il grafico
              </p>
            </div>
          </div>
        )}
      </div> */}

      {/* Cash Flow Analysis */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        9. Analisi del flusso di cassa
      </h2>
      <div className="mb-6">
        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify">
          {cashFlowAnalysisText}
        </p>
      </div>

      {/* Cash Flow Analysis Data */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        9.1 Dati dell'Analisi del Flusso di Cassa
      </h2>

      {/* Desktop/Tablet View */}
      <div className="hidden md:block rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-[#E6D8FF]">
                <th className="px-3 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium text-[#121417] sticky left-0 bg-[#E6D8FF] z-10">
                  Anno
                </th>
                <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                  Operativo
                </th>
                <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                  Investimenti
                </th>
                <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                  Finanziamento
                </th>
                <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                  Cassa netta
                </th>
              </tr>
            </thead>
            <tbody>
              {cashFlowAnalysis?.map((item, index) => (
                <tr
                  key={item.year}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b border-b-gray-200 hover:bg-gray-100 transition-colors`}
                >
                  <td className={`px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-[#61758A] font-medium sticky left-0 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}>
                    Anno {item.year}
                  </td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap">
                    {formatCurrency(item.operating)}
                  </td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap">
                    {formatCurrency(item.investing)}
                  </td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap">
                    {formatCurrency(item.financing)}
                  </td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap font-semibold">
                    {formatCurrency(item.net_cash)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="md:hidden space-y-4">
        {cashFlowAnalysis?.map((item) => (
          <div
            key={item.year}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="bg-[#E6D8FF] px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-semibold text-[#121417]">
                Anno {item.year}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="px-4 py-3 flex justify-between items-center gap-3">
                <span className="text-xs text-[#61758A] font-normal">
                  Operativo
                </span>
                <span className="text-xs text-[#121417] font-medium whitespace-nowrap">
                  {formatCurrency(item.operating)}
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center gap-3">
                <span className="text-xs text-[#61758A] font-normal">
                  Investimenti
                </span>
                <span className="text-xs text-[#121417] font-medium whitespace-nowrap">
                  {formatCurrency(item.investing)}
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center gap-3">
                <span className="text-xs text-[#61758A] font-normal">
                  Finanziamento
                </span>
                <span className="text-xs text-[#121417] font-medium whitespace-nowrap">
                  {formatCurrency(item.financing)}
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center gap-3 bg-gray-50">
                <span className="text-xs text-[#61758A] font-semibold">
                  Cassa netta
                </span>
                <span className="text-xs text-[#121417] font-bold whitespace-nowrap">
                  {formatCurrency(item.net_cash)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

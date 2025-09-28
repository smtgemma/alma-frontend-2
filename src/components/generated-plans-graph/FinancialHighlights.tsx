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
  // console.log("Tis is ",financialHighlights)

  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return "€0";
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value.toLocaleString()}`;
  };

  // Prepare chart data
  const chartData = financialHighlights.map((item) => ({
    year: `Year ${item.year}`,
    "Net Income": item.net_income,
    Revenue: item.revenue,
  }));

  return (
    <div className="mx-auto space-y-10 mt-10">
      {/* Financial Highlights Table */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        12.1 Punti salienti finanziari
      </h2>
      <div className=" rounded-lg  border border-gray-200 ">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E6D8FF] ">
                <th className="px-4 py-3 text-left text-sm $ font-medium text-[#374151] ">
                  {/* Year */}
                  Anno
                </th>
                <th className="px-4 py-3 text-left text-sm $ font-medium text-[#374151] ">
                  {/* Revenue */}
                  Ricavi
                </th>
                <th className="px-4 py-3 text-left text-sm $ font-medium text-[#374151] ">
                  {/* Net Income */}
                  Reddito netto
                </th>
                <th className="px-4 py-3 text-left text-sm $ font-medium text-[#374151] ">
                  {/* CAPEX */}
                  CAPEX
                </th>
                <th className="px-4 py-3 text-left text-sm $ font-medium text-[#374151] ">
                  {/* Debt Repayment */}
                  Rimborso del debito
                </th>
              </tr>
            </thead>
            <tbody>
              {financialHighlights.map((item, index) => (
                <tr
                  key={item.year}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-50"
                  } border-b border-b-gray-200`}
                >
                  <td className="px-4 py-3 text-base font-normal text-[#374151]">
                    Year {item.year}
                  </td>
                  <td className="px-4 py-3 text-base font-normal text-[#374151]">
                    {formatCurrency(item.revenue)}
                  </td>
                  <td className="px-4 py-3 text-base font-normal text-[#374151]">
                    {formatCurrency(item.net_income)}
                  </td>
                  <td className="px-4 py-3 text-base font-normal text-[#374151]">
                    {formatCurrency(item.capex)}
                  </td>
                  <td className="px-4 py-3 text-base font-normal text-[#374151]">
                    {formatCurrency(item.debt_repayment)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Highlights Chart */}
      <div className="bg-gray-50 rounded-lg  p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {/* FinancialHighlights */}
            Punti salienti finanziari{" "}
            <span className="px-3 py-1 ml-3 bg-purple-100 text-purple-700 rounded-full text-sm">
              {/* Yearly */}
              Annuale
            </span>
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">
                  {/* Net Income */}
                  Reddito netto
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">
                  {/* Revenue */}
                  Ricavi
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: any) => [
                  formatCurrency(Number(value) || 0),
                  "",
                ]}
                labelStyle={{ color: "#333" }}
                contentStyle={{
                  backgroundColor: "#333",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar dataKey="Revenue" fill="#9CA3AF" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="Revenue"
                  position="top"
                  formatter={(value: any) => formatCurrency(Number(value) || 0)}
                  style={{ fontSize: "12px", fontWeight: "bold", fill: "#666" }}
                />
              </Bar>
              <Bar dataKey="Net Income" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="Net Income"
                  position="top"
                  formatter={(value: any) => formatCurrency(Number(value) || 0)}
                  style={{ fontSize: "12px", fontWeight: "bold", fill: "#333" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow Analysis */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        12.2 Analisi del flusso di cassa
      </h2>
      <div className="">
        <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-justify">
          {cashFlowAnalysisText}
        </p>
      </div>

      {/* Cash Flow Analysis Data */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        12.3 Dati dell'Analisi del Flusso di Cassa
      </h2>
      <div className="">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded">
            <thead>
              <tr className="bg-purple-100 ">
                <th className="px-4 py-3 text-left text-sm  font-medium text-[#374151] ">
                  {/* Year */}
                  Anno
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#374151] ">
                  {/* Operating */}
                  Operativo
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#374151] ">
                  {/* Investing */}
                  Investimenti
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#374151] ">
                  {/* Financing */}
                  Finanziamento
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#374151] ">
                  {/* Net Cash */}
                  Cassa netta
                </th>
              </tr>
            </thead>
            <tbody>
              {cashFlowAnalysis.map((item, index) => (
                <tr
                  key={item.year}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-0"
                  } border-b border-gray-200`}
                >
                  <td className="px-4 py-3 text-base font-normal text-[#374151]">
                    Year {item.year}
                  </td>
                  <td className="px-4 py-3 text-base font-normal text-[#374151]">
                    {formatCurrency(item.operating)}
                  </td>
                  <td className="px-4 py-3 text-base font-normal text-[#374151]">
                    {formatCurrency(item.investing)}
                  </td>
                  <td className="px-4 py-3 text-base font-normal text-[#374151]">
                    {formatCurrency(item.financing)}
                  </td>
                  <td className="px-4 py-3 text-base font-normal text-[#374151]">
                    {formatCurrency(item.net_cash)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

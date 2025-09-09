"use client"

import { IFinancial } from "@/redux/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"



export default function FinancialDashboard({financialHighlights,businessModel,cashFlowAnalysis}:IFinancial) {

// console.log("Tis is ",financialHighlights)

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value?.toLocaleString()}`
}

// Prepare chart data
const chartData = financialHighlights.map((item) => ({
  year: `Year ${item.year}`,
  "Net Income": item.net_income,
  Revenue: item.revenue,
}))


  return (
    <div className="mx-auto space-y-10 mt-10">
      {/* Financial Highlights Table */}
        <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">Financial Highlights</h2>
      <div className=" rounded-lg  border border-gray-200 ">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E6D8FF] ">
                <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-medium text-[#374151] ">Year</th>
                <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-medium text-[#374151] ">Revenue</th>
                <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-medium text-[#374151] ">Net Income</th>
                <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-medium text-[#374151] ">CAPEX</th>
                <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-medium text-[#374151] ">Debt Repayment</th>
              </tr>
            </thead>
            <tbody>
              {financialHighlights.map((item, index) => (
                <tr key={item.year} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-50"} border-b border-b-gray-200`}>
                  <td className="px-4 py-3 text-base md:text-lg lg:text-xl font-medium text-[#374151]">Year {item.year}</td>
                  <td className="px-4 py-3 text-base md:text-lg lg:text-xl font-medium text-[#374151]">{formatCurrency(item.revenue)}</td>
                  <td className="px-4 py-3 text-base md:text-lg lg:text-xl font-medium text-[#374151]">{formatCurrency(item.net_income)}</td>
                  <td className="px-4 py-3 text-base md:text-lg lg:text-xl font-medium text-[#374151]">{formatCurrency(item.capex)}</td>
                  <td className="px-4 py-3 text-base md:text-lg lg:text-xl font-medium text-[#374151]">{formatCurrency(item.debt_repayment)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Highlights Chart */}
      <div className="bg-gray-50 rounded-lg  p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">FinancialHighlights     <span className="px-3 py-1 ml-3 bg-purple-100 text-purple-700 rounded-full text-sm">Yearly</span></h2>
          <div className="flex items-center space-x-4">
        
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Net Income</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), ""]}
                labelStyle={{ color: "#333" }}
                contentStyle={{
                  backgroundColor: "#333",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar dataKey="Revenue" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Net Income" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Business Model */}
        <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">Business Model</h2>
      <div className="">
        <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-justify">
          {businessModel}
        </p>
      </div>

      {/* Cash Flow Analysis */}
        <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">Cash Flow Analysis</h2>
      <div className="">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded">
            <thead>
              <tr className="bg-purple-100 ">
                <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-medium text-[#374151] ">Year</th>
                <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-medium text-[#374151] ">Operating</th>
                <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-medium text-[#374151] ">Investing</th>
                <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-medium text-[#374151] ">Financing</th>
                <th className="px-4 py-3 text-left text-sm md:text-base lg:text-lg font-medium text-[#374151] ">Net Cash</th>
              </tr>
            </thead>
            <tbody>
              {cashFlowAnalysis.map((item, index) => (
                <tr key={item.year} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-0"} border-b border-gray-200`}>
                  <td className="px-4 py-3 text-base md:text-lg lg:text-xl font-medium text-[#374151]">Year {item.year}</td>
                  <td className="px-4 py-3 text-base md:text-lg lg:text-xl font-medium text-[#374151]">{formatCurrency(item.operating)}</td>
                  <td className="px-4 py-3 text-base md:text-lg lg:text-xl font-medium text-[#374151]">{formatCurrency(item.investing)}</td>
                  <td className="px-4 py-3 text-base md:text-lg lg:text-xl font-medium text-[#374151]">{formatCurrency(item.financing)}</td>
                  <td className="px-4 py-3 text-base md:text-lg lg:text-xl font-medium text-[#374151]">{formatCurrency(item.net_cash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  )
}

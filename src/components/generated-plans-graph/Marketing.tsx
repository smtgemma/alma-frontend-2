"use client";

import { IMarketing } from "@/redux/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Extended data for 7-year chart visualization

export default function MarketingDashboard({
  marketingSalesStrategy,
  profitLossProjection,
  sectorStrategy,
}: IMarketing) {
  //    console.log("This is the loss",profitLossProjection)

  //    const chartData = [
  //     { year: "1st Year", revenue: 500000, net_income: 50000 },
  //     { year: "2nd Year", revenue: 750000, net_income: 100000 },
  //     { year: "3rd Year", revenue: 1000000, net_income: 150000 },

  // ]

  const chartData = profitLossProjection.map((item) => ({
    year: `${item.year} Year`, // Convert to "1st Year", "2nd Year", etc.
    revenue: item.revenue,
    net_income: Math.abs(item.net_income),
  }));

  //    console.log(chartData)
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-50 p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm font-medium"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-10 space-y-8">
      {/* Marketing Sales Strategy Section */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        8. Proiezione di profitti e perdite
      </h2>
      <div className="">
        <p className="text-gray-600 leading-relaxed text-base md:text-lg lg:text-xl text-justify">
          {marketingSalesStrategy}
        </p>
      </div>

      {/* Profit Loss Projection Table */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        8.1 Proiezione di profitti e perdite
      </h2>
      <div className=" ">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-purple-100">
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417] border-r border-white">
                  {/* Year */}
                  Anno
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417] border-r border-white">
                  {/* COGS */}
                  COGS
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417] border-r border-white">
                  {/* Gross Profit */}
                  Profitto lordo
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417] border-r border-white">
                  {/* Operating Expenses */}
                  Spese operative
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417] border-r border-white">
                  {/* EBITDA */}
                  EBITDA
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417] border-r border-white">
                  {/* Depreciation Amortization */}
                  Ammortamento
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417] border-r border-white">
                  {/* EBIT */}
                  EBIT
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417] border-r border-white">
                  {/* Interest */}
                  Interessi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  {/* Taxes */}
                  Tasse
                </th>
              </tr>
            </thead>
            <tbody>
              {profitLossProjection.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                    Year {String(row.year).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3 ">{formatCurrency(row.cogs)}</td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(row.gross_profit)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(row.operating_expenses)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(row.ebitda)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(row.depreciation_amortization)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(row.ebit)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(row.interest)}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {formatCurrency(row.taxes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profit Loss Projection Chart */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white px-6 py-3 bg-[#A78BFA]">
        8.2 Proiezione di profitti e perdite
      </h2>
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div></div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-normal text-[#61758A]">
                {/* Revenue */}
                Ricavi
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-sm font-normal text-[#61758A]">
                {/* Net Income */}
                Reddito netto
              </span>
            </div>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
              />
              <YAxis
                scale="log"
                domain={["dataMin", "dataMax"]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="net_income"
                stroke="#f87171"
                strokeWidth={3}
                dot={{ fill: "#f87171", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#f87171", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Strategy Section */}
      {/* <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Sector Strategy</h2>
            <div className=" ">
                <p className="text-base md:text-lg lg:text-xl leading-relaxed text-justify">
                   {sectorStrategy}
                </p>
            </div> */}
    </div>
  );
}

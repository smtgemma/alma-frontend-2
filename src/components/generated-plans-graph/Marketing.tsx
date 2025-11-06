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

  const chartData = profitLossProjection
    .map((item) => {
      // Support multiple possible field names coming from backend
      const revenue =
        item.revenue ??
        item.valore_produzione_operativa ??
        item.ricavi_vendite_prestazioni ??
        0;
      const netIncome = item.net_income ?? item.risultato_netto ?? 0;
      return {
        year: `${item.year} Year`,
        revenue,
        net_income: Math.abs(netIncome),
      };
    })
    // Keep only entries where at least one series is non-zero
    .filter((row) => (row.revenue || 0) !== 0 || (row.net_income || 0) !== 0);

  // Compute dynamic max for better axis readability
  const maxValue = chartData.reduce((max, row) => {
    return Math.max(max, row.revenue || 0, row.net_income || 0);
  }, 0);
  const yMax = maxValue > 0 ? Math.ceil(maxValue * 1.1) : 1000;

  //    console.log(chartData)
  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return "€0";
    return `€${value.toLocaleString()}`;
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

      {/* Profit Loss Projection Chart */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white px-6 py-3 bg-[#A78BFA]">
        8.1 Proiezione di profitti e perdite
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
                width={90}
                domain={[0, yMax]}
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

"use client";
import React from "react";

const AdminRevenueChart = ({ chartData }: any) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Debug: Log chart data
  console.log("AdminRevenueChart - chartData:", chartData);

  const soloRevenue = chartData?.soloMonthly || Array(12).fill(0);
  const teamRevenue = chartData?.teamMonthly || Array(12).fill(0);

  console.log("Solo Revenue:", soloRevenue);
  console.log("Team Revenue:", teamRevenue);

  const maxRevenue = Math.max(...soloRevenue, ...teamRevenue, 1);
  const yAxisLabels = [];
  for (let i = 0; i <= 4; i++) {
    yAxisLabels.push(Math.round(((maxRevenue / 4) * i) / 1000) * 1000);
  }

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 md:mb-6">
        <h3 className="text-sm sm:text-md md:text-lg font-semibold text-gray-900">
          Total Revenue {chartData?.year && `(${chartData.year})`}
        </h3>
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-3 h-3 bg-[#31FF50] rounded-full"></div>
            <span className="text-xs md:text-sm text-[#A3A3A3]">Solo</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-3 h-3 bg-[#FF5B5B] rounded-full"></div>
            <span className="text-xs md:text-sm text-[#A3A3A3]">Team</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-48 sm:h-56 md:h-64 w-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] sm:text-xs md:text-sm text-gray-500 pr-1 sm:pr-2">
          {yAxisLabels.reverse().map((label, i) => (
            <span key={i}>€{label.toLocaleString()}</span>
          ))}
        </div>

        {/* Chart */}
        <div className="ml-6 sm:ml-10 md:ml-12 h-full relative">
          {/* Vertical grid */}
          <div className="absolute inset-0 flex justify-between">
            {months.map((_, i) => (
              <div key={i} className="border-l border-gray-200 h-full"></div>
            ))}
          </div>

          {/* Lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="#31FF50"
              strokeWidth="2"
              points={soloRevenue
                .map(
                  (v: number, i: number) =>
                    `${(i / (months.length - 1)) * 100},${
                      100 - (v / maxRevenue) * 100
                    }`
                )
                .join(" ")}
            />
            <polyline
              fill="none"
              stroke="#FF5B5B"
              strokeWidth="2"
              points={teamRevenue
                .map(
                  (v: number, i: number) =>
                    `${(i / (months.length - 1)) * 100},${
                      100 - (v / maxRevenue) * 100
                    }`
                )
                .join(" ")}
            />
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] sm:text-xs md:text-sm text-gray-500">
            {months.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenueChart;

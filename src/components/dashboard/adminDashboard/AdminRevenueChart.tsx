"use client";
import React, { useState } from "react";

const AdminRevenueChart = ({ chartData }: any) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    type: 'solo' | 'team';
    x: number;
    y: number;
    value: number;
  } | null>(null);
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
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg w-full h-full flex flex-col">
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
      <div className="relative flex-1 min-h-48 w-full">
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
            {/* Solo line */}
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
            {/* Team line */}
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
            
            {/* Solo hover points */}
            {soloRevenue.map((value: number, index: number) => {
              const x = (index / (months.length - 1)) * 100;
              const y = 100 - (value / maxRevenue) * 100;
              return (
                <circle
                  key={`solo-${index}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="transparent"
                  stroke="transparent"
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredPoint({
                      index,
                      type: 'solo',
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      value
                    });
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}
            
            {/* Team hover points */}
            {teamRevenue.map((value: number, index: number) => {
              const x = (index / (months.length - 1)) * 100;
              const y = 100 - (value / maxRevenue) * 100;
              return (
                <circle
                  key={`team-${index}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="transparent"
                  stroke="transparent"
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredPoint({
                      index,
                      type: 'team',
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      value
                    });
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] sm:text-xs md:text-sm text-gray-500">
            {months.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: hoveredPoint.x,
            top: hoveredPoint.y - 60,
            transform: 'translateX(-50%)'
          }}
        >
          <div className={`px-3 py-2 rounded-lg shadow-lg text-white text-sm font-medium ${
            hoveredPoint.type === 'solo' ? 'bg-[#31FF50]' : 'bg-[#FF5B5B]'
          }`}>
            <div className="text-center">
              <div className="font-bold">
                €{hoveredPoint.value.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <div className="text-xs opacity-90">
                {months[hoveredPoint.index]} - {hoveredPoint.type === 'solo' ? 'Solo' : 'Team'}
              </div>
            </div>
            {/* Tooltip arrow */}
            <div 
              className={`absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                hoveredPoint.type === 'solo' ? 'border-t-[#31FF50]' : 'border-t-[#FF5B5B]'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRevenueChart;

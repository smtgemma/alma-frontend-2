"use client";
import React, { useEffect, useState } from "react";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { useAdminSummaryQuery } from "@/redux/api/admin/adminAPI";
// src/components/dashboard/adminDashboard/AdminGrowthChart.tsx
interface GrowthData {
  overallPct?: number | string;
  soloUsersPct?: number | string;
  teamUsersPct?: number | string;
}

const AdminGrowthChart = ({ growth }: { growth?: GrowthData }) => {
  const { data: adminSummary } = useAdminSummaryQuery({});
  const [calculatedGrowth, setCalculatedGrowth] = useState({
    overallPct: "0%",
    soloUsersPct: "0%",
    teamUsersPct: "0%",
  });

  // Default values if growth data is not available
  const defaultGrowth = {
    overallPct: "0%",
    soloUsersPct: "0%",
    teamUsersPct: "0%",
  };

  // Calculate average growth based on API data
  useEffect(() => {
    if (adminSummary?.data) {
      const soloUsers = adminSummary.data.cards?.soloPlanUsers || 0;
      const teamUsers = adminSummary.data.cards?.teamPlanUsers || 0;
      const totalUsers = adminSummary.data.cards?.totalRegisteredUsers || 0;
      
      // Calculate growth percentages (this is a placeholder calculation - adjust as needed)
      const soloGrowthPct = soloUsers > 0 ? `+${Math.round((soloUsers / totalUsers) * 100)}%` : "0%";
      const teamGrowthPct = teamUsers > 0 ? `+${Math.round((teamUsers / totalUsers) * 100)}%` : "0%";
      
      // Calculate overall growth (average of solo and team)
      const overallGrowthValue = 
        (parsePct(soloGrowthPct) + parsePct(teamGrowthPct)) / 2;
      const overallGrowthPct = `${overallGrowthValue > 0 ? '+' : ''}${Math.round(overallGrowthValue)}%`;
      
      setCalculatedGrowth({
        overallPct: overallGrowthPct,
        soloUsersPct: soloGrowthPct,
        teamUsersPct: teamGrowthPct,
      });
    }
  }, [adminSummary]);

  // Use calculated growth data if available, otherwise use provided growth or defaults
  const growthData = calculatedGrowth || growth || defaultGrowth;

  // Helper: detect number from percentage string
  const parsePct = (pct: number | string | undefined) => {
    if (pct === undefined || pct === null) return 0;
    return typeof pct === "string"
      ? Number(pct.replace("%", "").replace("+", "")) || 0
      : pct || 0;
  };

  const overallValue = parsePct(growthData.overallPct);
  const soloValue = parsePct(growthData.soloUsersPct);
  const teamValue = parsePct(growthData.teamUsersPct);

  // Dynamic stroke color (green if positive, red if negative)
  const getColor = (value: number) => (value >= 0 ? "#10B981" : "#EF4444");

  // Circle math (circumference = 2πr → 2*π*40 ≈ 251)
  const circumference = 2 * Math.PI * 40;
  const progress = Math.min(Math.abs(overallValue), 22); // cap at 100

  return (
    <div className="bg-white p-6 rounded-lg h-full flex flex-col">
      <div className="flex justify-center">
        {/* Donut Chart */}
        <div className="relative w-40 h-40">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle - light mint green */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#E0F7FA"
              strokeWidth="12"
            />
            {/* Growth segment - vibrant green */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#2ECC71"
              strokeWidth="12"
              strokeDasharray={`${
                (progress / 30) * circumference
              } ${circumference}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">
              {growthData.overallPct || "0%"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 mt-4 text-center">
          Crescita Media <br /> Clienti
        </h3>
        {/* Growth details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-gray-700">
              Utenti Singoli
            </span>
            <div className="flex items-center gap-1">
              {soloValue >= 0 ? (
                <span className="flex items-center gap-1 bg-green-100 text-[#28F647] px-3 py-1 border border-[#28F647] rounded-full text-sm font-semibold">
                  <FaLongArrowAltUp className="text-green-600" />{" "}
                  {growthData.soloUsersPct || "0%"}
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-red-100 text-[#DC2626] px-3 py-1 border border-[#DC2626] rounded-full text-sm font-semibold">
                  <FaLongArrowAltDown className="text-red-600" />{" "}
                  {growthData.soloUsersPct || "0%"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-gray-700">
              Utenti Team
            </span>
            <div className="flex items-center gap-1">
              {teamValue >= 0 ? (
                <span className="flex items-center gap-1 bg-green-100 text-[#28F647] px-3 py-1 border border-[#28F647] rounded-full text-sm font-semibold">
                  <FaLongArrowAltUp className="text-green-600" />{" "}
                  {growthData.teamUsersPct || "0%"}
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-red-100 text-[#DC2626] px-3 py-1 border border-[#DC2626] rounded-full text-sm font-semibold">
                  <FaLongArrowAltDown className="text-red-600" />{" "}
                  {growthData.teamUsersPct || "0%"}
                </span>
              )}
            </div>
          </div>
          
          {/* Add explanation text in Italian */}
          <div className="mt-2 text-xs text-gray-500 italic text-center">
            Calcolato in base al numero di utenti attivi
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGrowthChart;

"use client";

import { IRatiosAnalysis } from "@/redux/types";

export default function RatiosAnalysis({ ratiosAnalysis }: IRatiosAnalysis) {
  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return "€0";
    return `€${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    if (!value || isNaN(value)) return "0%";
    return `${value.toFixed(2)}%`;
  };

  const formatRatio = (value: number) => {
    if (!value || isNaN(value)) return "0";
    return value.toFixed(2);
  };

  const formatNumber = (value: number) => {
    if (!value || isNaN(value)) return "0";
    return value.toLocaleString();
  };

  // Define the metrics to display in rows
  const metrics = [
    {
      key: "roi",
      label: "ROI (Ritorno sull'investimento)",
      format: "percentage",
    },
    {
      key: "roa",
      label: "ROA (Ritorno sugli attivi)",
      format: "percentage",
    },
    { key: "current_ratio", label: "Rapporto corrente", format: "ratio" },
    { key: "quick_ratio", label: "Rapporto rapido", format: "ratio" },
  ];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case "percentage":
        return formatPercentage(value);
      case "currency":
        return formatCurrency(value);
      case "ratio":
        return formatRatio(value);
      case "number":
        return formatNumber(value);
      default:
        return value?.toString() || "0";
    }
  };

  return (
    <div className="mx-auto space-y-10 mt-10">
      {/* Comprehensive Ratios Analysis Table */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        11. Analisi dei rapporti
      </h2>
      <div className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E6D8FF]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  {/* Metrics */}
                  Metriche
                </th>
                {ratiosAnalysis.map((item) => (
                  <th
                    key={item.year}
                    className="px-4 py-3 text-left text-sm font-medium text-[#121417]"
                  >
                    {item.year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr
                  key={metric.key}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b border-b-gray-200`}
                >
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {metric.label}
                  </td>
                  {ratiosAnalysis.map((item) => (
                    <td
                      key={`${item.year}-${metric.key}`}
                      className="px-4 py-3 text-sm font-normal text-[#61758A]"
                    >
                      {formatValue(
                        item[metric.key as keyof typeof item] as number,
                        metric.format
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { IProductionSalesForecast } from "@/redux/types";

export default function ProductionSalesForecast({
  productionSalesForecast,
}: IProductionSalesForecast) {
  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return "$0";
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    if (!value || isNaN(value)) return "0%";
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    if (!value || isNaN(value)) return "0";
    return value.toLocaleString();
  };

  const formatDecimal = (value: number) => {
    if (!value || isNaN(value)) return "0.00";
    return value.toFixed(2);
  };

  // Define the metrics to display in rows
  const metrics = [
    { key: "sales_revenue", label: "Ricavi delle vendite", format: "currency" },
    {
      key: "revenue_growth",
      label: "Crescita dei ricavi",
      format: "percentage",
    },
    { key: "units_sold", label: "Unità vendute", format: "number" },
    { key: "average_price", label: "Prezzo medio", format: "currency" },
    {
      key: "unit_production_cost",
      label: "Costo di produzione unitario",
      format: "currency",
    },
    { key: "unit_margin", label: "Margine unitario", format: "currency" },
  ];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case "percentage":
        return formatPercentage(value);
      case "currency":
        return formatCurrency(value);
      case "number":
        return formatNumber(value);
      case "decimal":
        return formatDecimal(value);
      default:
        return value?.toString() || "0";
    }
  };

  return (
    <div className="mx-auto space-y-10 mt-10">
      {/* Production Sales Forecast Table */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        7. Conto economico a valore aggiunto
      </h2>
      <div className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E6D8FF]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  Metriche
                </th>
                {productionSalesForecast.map((item) => (
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
                  {productionSalesForecast.map((item) => (
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

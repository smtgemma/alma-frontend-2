"use client";

import { IProductionSalesForecast } from "@/redux/types";

export default function ProductionSalesForecast({
  productionSalesForecast,
  managementTeam,
}: IProductionSalesForecast) {
  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return "$0";
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
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
    { key: 'sales_revenue', label: 'Sales Revenue', format: 'currency' },
    { key: 'revenue_growth', label: 'Revenue Growth', format: 'percentage' },
    { key: 'units_sold', label: 'Units Sold', format: 'number' },
    { key: 'average_price', label: 'Average Price', format: 'currency' },
    { key: 'unit_production_cost', label: 'Unit Production Cost', format: 'currency' },
    { key: 'unit_margin', label: 'Unit Margin', format: 'currency' },
  ];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'percentage':
        return formatPercentage(value);
      case 'currency':
        return formatCurrency(value);
      case 'number':
        return formatNumber(value);
      case 'decimal':
        return formatDecimal(value);
      default:
        return value?.toString() || '0';
    }
  };

  return (
    <div className="mx-auto space-y-10 mt-10">
      {/* Management Team */}
      <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">
        Management Team
      </h2>
      <div className="">
        <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-justify">
          {managementTeam}
        </p>
      </div>

      {/* Production Sales Forecast Table */}
      <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">
        Production Sales Forecast
      </h2>
      <div className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E6D8FF]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[#121417]">
                  Metrics
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
                      {formatValue(item[metric.key as keyof typeof item] as number, metric.format)}
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

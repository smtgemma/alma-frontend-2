"use client";

import { IDebt } from "@/redux/types";

// Format currency with Italian locale
const formatCurrency = (value: number) => {
  if (value === undefined || value === null || isNaN(value)) return "€0,00";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Format percentage
const formatPercentage = (value: number) => {
  if (value === undefined || value === null || isNaN(value)) return "0%";
  // If value is already a percentage (e.g., 5 for 5%), use it directly
  // If value is a decimal (e.g., 0.05 for 5%), multiply by 100
  const percentValue = value > 1 ? value : value * 100;
  return `${percentValue.toFixed(1)}%`;
};

interface DebtStructureItem {
  year: number;
  short_term_debt?: number;
  long_term_debt?: number;
  total_debt?: number;
  debt_to_equity?: number;
  repayment?: number;
  interest_rate?: number;
  outstanding_debt?: number;
}

export default function DebtDashboard({ debtStructure }: IDebt) {
  // Define metrics with Italian labels
  const metrics = [
    { key: "year", label: "Anno", format: "year" },
    { key: "short_term_debt", label: "Debito a breve termine", format: "currency" },
    { key: "long_term_debt", label: "Debito a lungo termine", format: "currency" },
    { key: "total_debt", label: "Debito totale", format: "currency" },
    { key: "debt_to_equity", label: "Debt to equity", format: "ratio" },
  ];

  const formatValue = (value: any, format: string) => {
    switch (format) {
      case "year":
        return `Anno ${value}`;
      case "percentage":
        return formatPercentage(value);
      case "currency":
        return formatCurrency(value);
      case "ratio":
        return value !== undefined ? value.toFixed(4) : "0.0000";
      default:
        return value?.toString() || "0";
    }
  };

  return (
    <div className="mt-10 mx-auto space-y-6 px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        8. Struttura del debito
      </h2>

      {/* Desktop/Tablet View */}
      <div className="hidden md:block rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-[#E6D8FF]">
                <th className="px-3 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium text-[#121417] sticky left-0 bg-[#E6D8FF] z-10">
                  Anno
                </th>
                <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                  Debito a breve termine
                </th>
                <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                  Debito a lungo termine
                </th>
                <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                  Debito totale
                </th>
                <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                  Debt to equity
                </th>
              </tr>
            </thead>
            <tbody>
              {debtStructure?.map((item: DebtStructureItem, index: number) => (
                <tr
                  key={item.year}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b border-b-gray-200 hover:bg-gray-100 transition-colors`}
                >
                  <td className={`px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-[#61758A] font-medium sticky left-0 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}>
                    Anno {item.year}
                  </td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap">
                    {formatCurrency(item.short_term_debt || 0)}
                  </td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap">
                    {formatCurrency(item.long_term_debt || 0)}
                  </td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap font-semibold">
                    {formatCurrency(item.total_debt || 0)}
                  </td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap">
                    {item.debt_to_equity !== undefined ? item.debt_to_equity.toFixed(4) : "0.0000"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="md:hidden space-y-4">
        {debtStructure?.map((item: DebtStructureItem) => (
          <div
            key={item.year}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="bg-[#E6D8FF] px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-semibold text-[#121417]">
                Anno {item.year}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="px-4 py-3 flex justify-between items-center gap-3">
                <span className="text-xs text-[#61758A] font-normal">
                  Debito a breve termine
                </span>
                <span className="text-xs text-[#121417] font-medium whitespace-nowrap">
                  {formatCurrency(item.short_term_debt || 0)}
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center gap-3">
                <span className="text-xs text-[#61758A] font-normal">
                  Debito a lungo termine
                </span>
                <span className="text-xs text-[#121417] font-medium whitespace-nowrap">
                  {formatCurrency(item.long_term_debt || 0)}
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center gap-3 bg-gray-50">
                <span className="text-xs text-[#61758A] font-semibold">
                  Debito totale
                </span>
                <span className="text-xs text-[#121417] font-bold whitespace-nowrap">
                  {formatCurrency(item.total_debt || 0)}
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center gap-3">
                <span className="text-xs text-[#61758A] font-normal">
                  Debt to equity
                </span>
                <span className="text-xs text-[#121417] font-medium whitespace-nowrap">
                  {item.debt_to_equity !== undefined ? item.debt_to_equity.toFixed(4) : "0.0000"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info note */}
      {/* {debtStructure && debtStructure.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                La struttura del debito mostra il piano di rimborso previsto per i prossimi{" "}
                {debtStructure.length} anni, con il tasso di interesse applicato e il debito residuo per ogni anno.
              </p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

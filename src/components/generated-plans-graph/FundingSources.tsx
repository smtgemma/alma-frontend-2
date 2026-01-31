"use client";

interface FixedInvestment {
  key: string;
  label: string;
  amortizationRate: number;
  category?: string;
  amount: number;
  annualAmortization: number;
}

interface FundingSourcesData {
  initialInvestment?: number;
  fromHome?: number;
  bankLoan?: number;
  totalInvestment?: number;
  fixedInvestments?: FixedInvestment[];
}

interface FundingSourcesProps {
  fundingSources: FundingSourcesData | string;
}

const formatCurrency = (value: number) => {
  if (value === undefined || value === null || isNaN(value)) return "€0,00";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercentage = (value: number) => {
  if (value === undefined || value === null || isNaN(value)) return "0%";
  return `${(value * 100).toFixed(1)}%`;
};

export default function FundingSources({
  fundingSources,
}: FundingSourcesProps) {
  // Handle string type (legacy)
  if (typeof fundingSources === "string") {
    return (
      <div className="mt-10 mx-auto space-y-6 px-2 sm:px-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          4. Fonti di finanziamento
        </h2>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
            {fundingSources}
          </p>
        </div>
      </div>
    );
  }

  // Handle object type (new structure)
  if (typeof fundingSources !== "object" || fundingSources === null) {
    return (
      <div className="mt-10 mx-auto space-y-6 px-2 sm:px-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          4. Fonti di finanziamento
        </h2>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-sm sm:text-base text-gray-500 text-center">
            Nessuna informazione disponibile sulle fonti di finanziamento
          </p>
        </div>
      </div>
    );
  }

  const data = fundingSources as FundingSourcesData;

  return (
    <div className="mt-10 mx-auto space-y-8 px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        4. Fonti di finanziamento
      </h2>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.initialInvestment !== undefined && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow-sm">
            <p className="text-xs sm:text-sm text-blue-700 font-medium mb-1">
              Investimento iniziale
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
              {formatCurrency(data.initialInvestment)}
            </p>
          </div>
        )}
        {data.fromHome !== undefined && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow-sm">
            <p className="text-xs sm:text-sm text-green-700 font-medium mb-1">
              Capitale proprio
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
              {formatCurrency(data.fromHome)}
            </p>
          </div>
        )}
        {data.bankLoan !== undefined && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 shadow-sm">
            <p className="text-xs sm:text-sm text-purple-700 font-medium mb-1">
              Prestito bancario
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">
              {formatCurrency(data.bankLoan)}
            </p>
          </div>
        )}
        {data.totalInvestment !== undefined && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-300 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-700 font-medium mb-1">
              Investimento totale
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              {formatCurrency(data.totalInvestment)}
            </p>
          </div>
        )}
      </div>

      {/* Fixed Investments Table */}
      {data.fixedInvestments && data.fixedInvestments.length > 0 && (
        <>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-8 mb-4">
            4.1 Investimenti fissi
          </h3>

          {/* Desktop/Tablet View */}
          <div className="hidden md:block rounded-lg border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="bg-[#E6D8FF]">
                    <th className="px-3 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium text-[#121417] sticky left-0 bg-[#E6D8FF] z-10 min-w-[250px]">
                      Descrizione
                    </th>
                    <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                      Categoria
                    </th>
                    <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                      Importo
                    </th>
                    <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                      Tasso ammortamento
                    </th>
                    <th className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap">
                      Ammortamento annuale
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.fixedInvestments.map((investment, index) => (
                    <tr
                      key={investment.key}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } border-b border-b-gray-200 hover:bg-gray-100 transition-colors`}
                    >
                      <td
                        className={`px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-[#61758A] sticky left-0 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        {investment.label}
                      </td>
                      <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap capitalize">
                        {investment.category || "-"}
                      </td>
                      <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap font-medium">
                        {formatCurrency(investment.amount)}
                      </td>
                      <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap">
                        {formatPercentage(investment.amortizationRate)}
                      </td>
                      <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap font-semibold">
                        {formatCurrency(investment.annualAmortization)}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-gray-200 border-t-2 border-gray-400 font-bold">
                    <td className="px-3 lg:px-4 py-3 text-xs lg:text-sm text-gray-900 sticky left-0 bg-gray-200">
                      TOTALE
                    </td>
                    <td className="px-3 lg:px-4 py-3 text-xs lg:text-sm text-center text-gray-900">
                      -
                    </td>
                    <td className="px-3 lg:px-4 py-3 text-xs lg:text-sm text-center text-gray-900">
                      {formatCurrency(
                        data.fixedInvestments.reduce(
                          (sum, inv) => sum + inv.amount,
                          0
                        )
                      )}
                    </td>
                    <td className="px-3 lg:px-4 py-3 text-xs lg:text-sm text-center text-gray-900">
                      -
                    </td>
                    <td className="px-3 lg:px-4 py-3 text-xs lg:text-sm text-center text-gray-900">
                      {formatCurrency(
                        data.fixedInvestments.reduce(
                          (sum, inv) => sum + inv.annualAmortization,
                          0
                        )
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View - Card Layout */}
          <div className="md:hidden space-y-4">
            {data.fixedInvestments.map((investment) => (
              <div
                key={investment.key}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="bg-[#E6D8FF] px-4 py-3 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-[#121417]">
                    {investment.label}
                  </h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {investment.category && (
                    <div className="px-4 py-3 flex justify-between items-center gap-3">
                      <span className="text-xs text-[#61758A] font-normal">
                        Categoria
                      </span>
                      <span className="text-xs text-[#121417] font-medium capitalize">
                        {investment.category}
                      </span>
                    </div>
                  )}
                  <div className="px-4 py-3 flex justify-between items-center gap-3">
                    <span className="text-xs text-[#61758A] font-normal">
                      Importo
                    </span>
                    <span className="text-xs text-[#121417] font-bold whitespace-nowrap">
                      {formatCurrency(investment.amount)}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex justify-between items-center gap-3">
                    <span className="text-xs text-[#61758A] font-normal">
                      Tasso ammortamento
                    </span>
                    <span className="text-xs text-[#121417] font-medium whitespace-nowrap">
                      {formatPercentage(investment.amortizationRate)}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex justify-between items-center gap-3 bg-gray-50">
                    <span className="text-xs text-[#61758A] font-semibold">
                      Ammortamento annuale
                    </span>
                    <span className="text-xs text-[#121417] font-bold whitespace-nowrap">
                      {formatCurrency(investment.annualAmortization)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Total Card */}
            <div className="bg-gray-100 rounded-lg border-2 border-gray-300 shadow-sm overflow-hidden">
              <div className="bg-gray-200 px-4 py-3 border-b border-gray-300">
                <h4 className="text-sm font-bold text-gray-900">TOTALE</h4>
              </div>
              <div className="divide-y divide-gray-300">
                <div className="px-4 py-3 flex justify-between items-center gap-3">
                  <span className="text-xs text-gray-700 font-semibold">
                    Importo totale
                  </span>
                  <span className="text-xs text-gray-900 font-bold whitespace-nowrap">
                    {formatCurrency(
                      data.fixedInvestments.reduce(
                        (sum, inv) => sum + inv.amount,
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center gap-3">
                  <span className="text-xs text-gray-700 font-semibold">
                    Ammortamento annuale totale
                  </span>
                  <span className="text-xs text-gray-900 font-bold whitespace-nowrap">
                    {formatCurrency(
                      data.fixedInvestments.reduce(
                        (sum, inv) => sum + inv.annualAmortization,
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}

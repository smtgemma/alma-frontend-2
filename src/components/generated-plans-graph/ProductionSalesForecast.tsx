"use client";

interface ProfitLossProjectionItem {
  year: number;
  ricavi_vendite_prestazioni: number;
  acquisti_merci: number;
  acquisti_servizi: number;
  godimento_beni_terzi: number;
  valore_aggiunto: number;
  costi_personale: number;
  margine_operativo_lordo: number;
  ammortamenti_immateriali: number;
  ammortamenti_materiali: number;
  risultato_operativo: number;
  oneri_finanziari: number;
  risultato_prima_imposte: number;
  imposte_reddito: number;
  utile_netto: number;
}

interface ProfitLossProjectionProps {
  profitLossProjection: ProfitLossProjectionItem[];
}

export default function ProductionSalesForecast({
  profitLossProjection,
}: ProfitLossProjectionProps) {
  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return "€0";
    return `€${value.toLocaleString()}`;
  };

  // Define the metrics to display in rows based on the Italian structure
  const metrics = [
    { key: "ricavi_vendite_prestazioni", label: "RICAVI DELLE VENDITE E DELLE PRESTAZIONI" },
    { key: "acquisti_merci", label: "Acquisti di materie prime, sussidiarie, di consumo e merci (CDGS 30%)" },
    { key: "acquisti_servizi", label: "Costi per servizi (marketing, amministrazione, manutenzioni, utenze, consulenze, ecc.)" },
    { key: "godimento_beni_terzi", label: "Godimento di beni di terzi (affitti e noleggi)" },
    { key: "valore_aggiunto", label: "VALORE AGGIUNTO" },
    { key: "costi_personale", label: "Costo del personale" },
    { key: "margine_operativo_lordo", label: "MARGINE OPERATIVO LORDO (EBITDA)" },
    { key: "ammortamenti_immateriali", label: "Ammortamenti immateriali" },
    { key: "ammortamenti_materiali", label: "Ammortamenti materiali" },
    { key: "risultato_operativo", label: "RISULTATO OPERATIVO (EBIT)" },
    { key: "oneri_finanziari", label: "Oneri finanziari (da piano ammortamento mutuo)" },
    { key: "risultato_prima_imposte", label: "RISULTATO PRIMA DELLE IMPOSTE (EBT)" },
    { key: "imposte_reddito", label: "Imposte sul reddito (IRES 24%)" },
    { key: "utile_netto", label: "UTILE NETTO D'ESERCIZIO" },
  ];

  return (
    <div className="mx-auto space-y-6 mt-10 px-2 sm:px-4">
      {/* Profit Loss Projection Table */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        7. Conto economico a valore aggiunto
      </h2>
      
      {/* Desktop/Tablet View */}
      <div className="hidden md:block rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-[#E6D8FF]">
                <th className="px-3 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium text-[#121417] sticky left-0 bg-[#E6D8FF] z-10">
                  Voci
                </th>
                {profitLossProjection?.map((item) => (
                  <th
                    key={item.year}
                    className="px-3 lg:px-4 py-3 text-center text-xs lg:text-sm font-medium text-[#121417] whitespace-nowrap"
                  >
                    Anno {item.year} (€)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => {
                const isBold = [
                  "ricavi_vendite_prestazioni",
                  "valore_aggiunto",
                  "margine_operativo_lordo",
                  "risultato_operativo",
                  "risultato_prima_imposte",
                  "utile_netto"
                ].includes(metric.key);

                return (
                  <tr
                    key={metric.key}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-b border-b-gray-200 hover:bg-gray-100 transition-colors`}
                  >
                    <td className={`px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-[#61758A] sticky left-0 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } ${isBold ? "font-bold" : "font-normal"}`}>
                      {metric.label}
                    </td>
                    {profitLossProjection?.map((item) => (
                      <td
                        key={`${item.year}-${metric.key}`}
                        className={`px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-center text-[#61758A] whitespace-nowrap ${isBold ? "font-bold" : "font-normal"}`}
                      >
                        {formatCurrency(item[metric.key as keyof ProfitLossProjectionItem])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="md:hidden space-y-4">
        {profitLossProjection?.map((yearData) => (
          <div key={yearData.year} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#E6D8FF] px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-semibold text-[#121417]">
                Anno {yearData.year}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {metrics.map((metric) => {
                const isBold = [
                  "ricavi_vendite_prestazioni",
                  "valore_aggiunto",
                  "margine_operativo_lordo",
                  "risultato_operativo",
                  "risultato_prima_imposte",
                  "utile_netto"
                ].includes(metric.key);
                
                const value = yearData[metric.key as keyof ProfitLossProjectionItem];

                return (
                  <div
                    key={metric.key}
                    className={`px-4 py-3 flex justify-between items-start gap-3 ${
                      isBold ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <span className={`text-xs text-[#61758A] flex-1 ${isBold ? "font-bold" : "font-normal"}`}>
                      {metric.label}
                    </span>
                    <span className={`text-xs text-[#121417] font-medium whitespace-nowrap ${isBold ? "font-bold" : "font-normal"}`}>
                      {formatCurrency(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint for desktop/tablet */}
      {/* {profitLossProjection && profitLossProjection.length > 3 && (
        <p className="hidden md:block text-xs text-gray-500 text-center mt-2">
          💡 Scorri orizzontalmente per visualizzare tutti gli anni
        </p>
      )} */}
    </div>
  );
}

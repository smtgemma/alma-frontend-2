"use client";

import { IFinancialAnalysis } from "@/redux/types";

export default function FinancialAnalysis({
  financialAnalysis,
}: IFinancialAnalysis) {
  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return "$0";
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Define the metrics to display in rows
  const metrics = [
    { key: "sales_revenue", label: "Ricavi delle vendite" },
    { key: "production_value", label: "Valore della produzione" },
    { key: "gross_operating_margin", label: "Margine operativo lordo" },
    { key: "ebit", label: "EBIT" },
    { key: "ebt", label: "EBT" },
    { key: "net_income", label: "Reddito netto" },
    {
      key: "gross_operating_cash_flow",
      label: "Flusso di cassa operativo lordo",
    },
    {
      key: "working_capital_change",
      label: "Variazione del capitale circolante",
    },
    {
      key: "current_management_cash_flow",
      label: "Flusso di cassa di gestione corrente",
    },
    { key: "operating_cash_flow", label: "Flusso di cassa operativo" },
    {
      key: "debt_service_cash_flow",
      label: "Flusso di cassa per il servizio del debito",
    },
    { key: "shareholders_cash_flow", label: "Flusso di cassa degli azionisti" },
    { key: "net_cash_flow", label: "Flusso di cassa netto" },
    { key: "net_tangible_assets", label: "Attività materiali nette" },
    { key: "net_intangible_assets", label: "Attività immateriali nette" },
    { key: "financial_assets", label: "Attività finanziarie" },
    { key: "trade_assets", label: "Attività commerciali" },
    { key: "inventory", label: "Inventario" },
    { key: "deferred_liquidity", label: "Liquidità differita" },
    { key: "immediate_liquidity", label: "Liquidità immediata" },
    { key: "equity", label: "Patrimonio netto" },
    { key: "long_term_debt", label: "Debito a lungo termine" },
    { key: "short_term_debt", label: "Debito a breve termine" },
    { key: "net_financial_position", label: "Posizione finanziaria netta" },
    { key: "mortgage_loans", label: "Mutui ipotecari" },
    { key: "other_financial_debts", label: "Altri debiti finanziari" },
    { key: "cash_and_banks", label: "Cassa e banche" },
    { key: "dividends", label: "Dividendi" },
  ];

  return (
    <div className="mx-auto space-y-10 mt-10">
      {/* Comprehensive Financial Analysis Table */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        12. Analisi Finanziaria
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
                {financialAnalysis.map((item) => (
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
                  {financialAnalysis.map((item) => (
                    <td
                      key={`${item.year}-${metric.key}`}
                      className="px-4 py-3 text-sm font-normal text-[#61758A]"
                    >
                      {formatCurrency(
                        item[metric.key as keyof typeof item] as number
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

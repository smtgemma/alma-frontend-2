"use client";

import { IBalanceSheet } from "@/redux/types";
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Format currency for display (EU)
const formatCurrency = (value: number) => {
  if (value === undefined || value === null || isNaN(value)) return "€0,00";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Custom label component for pie chart
const CustomLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
  if (!percent || percent < 0.01) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <text
        x={x}
        y={y - 8}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="16"
        fontWeight="bold"
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9)" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text
        x={x}
        y={y + 8}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9)" }}
      >
        {name}
      </text>
    </g>
  );
};

interface BalanceSheetItem {
  year: number;
  // ATTIVO (Assets)
  immobilizzazioni_immateriali?: number;
  tot_immob_immateriali_nette?: number;
  terreni_e_fabbricati?: number;
  impianti_e_macchinari?: number;
  attrezzature_arredi_altri_beni?: number;
  tot_immob_materiali_nette?: number;
  tot_immob_finanziarie?: number;
  totale_attivo_fisso?: number;
  crediti_commerciali?: number;
  disponibilita_liquide?: number;
  ratei_risconti_attivi?: number;
  totale_attivo_circolante?: number;
  totale_attivo?: number;
  // PASSIVO E PATRIMONIO NETTO (Liabilities & Equity)
  capitale_sociale?: number;
  riserve_utili_accantonati?: number;
  utile_perdita_esercizio?: number;
  patrimonio_netto?: number;
  fondo_tfr?: number;
  fondi?: number;
  debiti_ml_termine_mutuo?: number;
  passivita_consolidate?: number;
  debiti_vs_fornitori?: number;
  debiti_vs_soci?: number;
  debiti_vs_erario?: number;
  debiti_vs_banche?: number;
  totale_debiti_breve_termine?: number;
  ratei_risconti_passivi?: number;
  passivita_correnti?: number;
  totale_passivo?: number;
}

export default function BalanceSheet({
  balanceSheet,
  netFinancialPosition,
  balanceSheetAnalysis,
}: IBalanceSheet) {
  // Define the structure for ATTIVO (Assets) section
  const attivoMetrics = [
    {
      key: "immobilizzazioni_immateriali",
      label: "Immobilizzazioni immateriali (Software)",
      isSubItem: true,
    },
    {
      key: "tot_immob_immateriali_nette",
      label: "Tot. Immob. Immateriali nette",
      isBold: true,
    },
    {
      key: "terreni_e_fabbricati",
      label: "Terreni e fabbricati",
      isSubItem: true,
    },
    {
      key: "impianti_e_macchinari",
      label: "Impianti e macchinari",
      isSubItem: true,
    },
    {
      key: "attrezzature_arredi_altri_beni",
      label: "Attrezzature e arredi e altri beni",
      isSubItem: true,
    },
    {
      key: "tot_immob_materiali_nette",
      label: "Tot. Immob. materiali nette",
      isBold: true,
    },
    {
      key: "tot_immob_finanziarie",
      label: "Tot. Immob. finanziarie",
      isBold: true,
    },
    {
      key: "totale_attivo_fisso",
      label: "TOTALE ATTIVO FISSO",
      isBold: true,
      isTotal: true,
    },
    {
      key: "crediti_commerciali",
      label: "Crediti commerciali",
      isSubItem: true,
    },
    {
      key: "disponibilita_liquide",
      label: "Disponibilità liquide",
      isSubItem: true,
    },
    {
      key: "ratei_risconti_attivi",
      label: "Ratei e risconti attivi",
      isSubItem: true,
    },
    {
      key: "totale_attivo_circolante",
      label: "TOTALE ATTIVO CIRCOLANTE",
      isBold: true,
      isTotal: true,
    },
    {
      key: "totale_attivo",
      label: "TOTALE ATTIVO",
      isBold: true,
      isTotal: true,
      isGrandTotal: true,
    },
  ];

  // Define the structure for PASSIVO E PATRIMONIO NETTO (Liabilities & Equity) section
  const passivoMetrics = [
    {
      key: "capitale_sociale",
      label: "Capitale sociale",
      isSubItem: true,
    },
    {
      key: "riserve_utili_accantonati",
      label: "Riserve / Utili accantonati",
      isSubItem: true,
    },
    {
      key: "utile_perdita_esercizio",
      label: "Utile (perdita) dell'esercizio",
      isSubItem: true,
    },
    {
      key: "patrimonio_netto",
      label: "PATRIMONIO NETTO",
      isBold: true,
      isTotal: true,
    },
    { key: "fondo_tfr", label: "Fondo TFR", isSubItem: true },
    { key: "fondi", label: "FONDI", isBold: true },
    {
      key: "debiti_ml_termine_mutuo",
      label: "Debiti m/l termine (mutuo residuo)",
      isSubItem: true,
    },
    {
      key: "passivita_consolidate",
      label: "PASSIVITÀ CONSOLIDATE",
      isBold: true,
      isTotal: true,
    },
    {
      key: "debiti_vs_fornitori",
      label: "Debiti vs. fornitori",
      isSubItem: true,
    },
    { key: "debiti_vs_soci", label: "Debiti vs. soci", isSubItem: true },
    { key: "debiti_vs_erario", label: "Debiti vs. erario", isSubItem: true },
    { key: "debiti_vs_banche", label: "Debiti vs. banche", isSubItem: true },
    {
      key: "totale_debiti_breve_termine",
      label: "Totale debiti a breve termine",
      isBold: true,
    },
    {
      key: "ratei_risconti_passivi",
      label: "Ratei e risconti passivi",
      isSubItem: true,
    },
    {
      key: "passivita_correnti",
      label: "PASSIVITÀ CORRENTI",
      isBold: true,
      isTotal: true,
    },
    {
      key: "totale_passivo",
      label: "TOTALE PASSIVO",
      isBold: true,
      isTotal: true,
      isGrandTotal: true,
    },
  ];

  // Generate pie chart data from the latest year
  const pieChartData = useMemo(() => {
    if (!balanceSheet || balanceSheet.length === 0) {
      return [
        {
          name: "Attività",
          value: 0,
          fill: "#8B5CF6",
          actualValue: 0,
        },
        {
          name: "Passività",
          value: 0,
          fill: "#1E1B4B",
          actualValue: 0,
        },
        {
          name: "Patrimonio netto",
          value: 0,
          fill: "#EF4444",
          actualValue: 0,
        },
      ];
    }

    const latestYear = balanceSheet[
      balanceSheet.length - 1
    ] as BalanceSheetItem;
    const assets = latestYear.totale_attivo || 0;
    const equity = latestYear.patrimonio_netto || 0;
    const liabilities = (latestYear.totale_passivo || 0) - equity;

    const total = Math.abs(assets) + Math.abs(liabilities) + Math.abs(equity);

    if (total === 0) {
      return [
        { name: "Attività", value: 0, fill: "#8B5CF6", actualValue: 0 },
        { name: "Passività", value: 0, fill: "#1E1B4B", actualValue: 0 },
        { name: "Patrimonio netto", value: 0, fill: "#EF4444", actualValue: 0 },
      ];
    }

    return [
      {
        name: "Attività",
        value: Math.round((Math.abs(assets) / total) * 100),
        fill: "#8B5CF6",
        actualValue: assets,
      },
      {
        name: "Passività",
        value: Math.round((Math.abs(liabilities) / total) * 100),
        fill: "#1E1B4B",
        actualValue: liabilities,
      },
      {
        name: "Patrimonio netto",
        value: Math.round((Math.abs(equity) / total) * 100),
        fill: "#EF4444",
        actualValue: equity,
      },
    ];
  }, [balanceSheet]);

  return (
    <div className="mt-10 mx-auto space-y-8 px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        8. Stato Patrimoniale
      </h2>

      {/* ATTIVO Section - Desktop/Tablet */}
      <div className="hidden md:block">
        <div className="rounded-lg border border-gray-300 shadow-sm overflow-hidden">
          <div className="bg-gray-200 px-4 py-2 border-b border-gray-300">
            <h3 className="text-sm font-bold text-gray-800">ATTIVO</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 sticky left-0 bg-gray-100 z-10 min-w-[200px]">
                    Voci
                  </th>
                  {balanceSheet?.map((item: BalanceSheetItem) => (
                    <th
                      key={item.year}
                      className="px-3 py-2 text-center text-xs font-semibold text-gray-700 whitespace-nowrap"
                    >
                      Anno {item.year} (€)
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attivoMetrics.map((metric, index) => {
                  const rowClass = metric.isGrandTotal
                    ? "bg-gray-200 border-t-2 border-gray-400"
                    : metric.isTotal
                      ? "bg-gray-100 border-t border-gray-300"
                      : index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50";

                  return (
                    <tr
                      key={metric.key}
                      className={`${rowClass} border-b border-gray-200`}
                    >
                      <td
                        className={`px-3 py-2 text-xs sticky left-0 z-10 ${rowClass} ${
                          metric.isBold
                            ? "font-bold text-gray-900"
                            : "text-gray-700"
                        } ${metric.isSubItem ? "pl-6" : ""}`}
                      >
                        {metric.label}
                      </td>
                      {balanceSheet?.map((item: BalanceSheetItem) => (
                        <td
                          key={`${item.year}-${metric.key}`}
                          className={`px-3 py-2 text-xs text-center whitespace-nowrap ${
                            metric.isBold
                              ? "font-bold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {formatCurrency((item as any)[metric.key] || 0)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PASSIVO E PATRIMONIO NETTO Section - Desktop/Tablet */}
      <div className="hidden md:block">
        <div className="rounded-lg border border-gray-300 shadow-sm overflow-hidden">
          <div className="bg-gray-200 px-4 py-2 border-b border-gray-300">
            <h3 className="text-sm font-bold text-gray-800">
              PASSIVO E PATRIMONIO NETTO
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 sticky left-0 bg-gray-100 z-10 min-w-[200px]">
                    Voci
                  </th>
                  {balanceSheet?.map((item: BalanceSheetItem) => (
                    <th
                      key={item.year}
                      className="px-3 py-2 text-center text-xs font-semibold text-gray-700 whitespace-nowrap"
                    >
                      Anno {item.year} (€)
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {passivoMetrics.map((metric, index) => {
                  const rowClass = metric.isGrandTotal
                    ? "bg-gray-200 border-t-2 border-gray-400"
                    : metric.isTotal
                      ? "bg-gray-100 border-t border-gray-300"
                      : index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50";

                  return (
                    <tr
                      key={metric.key}
                      className={`${rowClass} border-b border-gray-200`}
                    >
                      <td
                        className={`px-3 py-2 text-xs sticky left-0 z-10 ${rowClass} ${
                          metric.isBold
                            ? "font-bold text-gray-900"
                            : "text-gray-700"
                        } ${metric.isSubItem ? "pl-6" : ""}`}
                      >
                        {metric.label}
                      </td>
                      {balanceSheet?.map((item: BalanceSheetItem) => (
                        <td
                          key={`${item.year}-${metric.key}`}
                          className={`px-3 py-2 text-xs text-center whitespace-nowrap ${
                            metric.isBold
                              ? "font-bold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {formatCurrency((item as any)[metric.key] || 0)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="md:hidden space-y-6">
        {balanceSheet?.map((yearData: BalanceSheetItem) => (
          <div key={yearData.year} className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
              <div className="bg-[#E6D8FF] px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-[#121417]">
                  Anno {yearData.year}
                </h3>
              </div>

              {/* ATTIVO Section */}
              <div className="bg-gray-100 px-4 py-2">
                <h4 className="text-sm font-bold text-gray-800">ATTIVO</h4>
              </div>
              <div className="divide-y divide-gray-200">
                {attivoMetrics.map((metric) => {
                  const value = (yearData as any)[metric.key] || 0;
                  return (
                    <div
                      key={metric.key}
                      className={`px-4 py-2 flex justify-between items-start gap-3 ${
                        metric.isGrandTotal || metric.isTotal
                          ? "bg-gray-100"
                          : "bg-white"
                      }`}
                    >
                      <span
                        className={`text-xs flex-1 ${
                          metric.isBold
                            ? "font-bold text-gray-900"
                            : "text-gray-700"
                        } ${metric.isSubItem ? "pl-4" : ""}`}
                      >
                        {metric.label}
                      </span>
                      <span
                        className={`text-xs whitespace-nowrap ${
                          metric.isBold
                            ? "font-bold text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {formatCurrency(value)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* PASSIVO Section */}
              <div className="bg-gray-100 px-4 py-2 mt-4">
                <h4 className="text-sm font-bold text-gray-800">
                  PASSIVO E PATRIMONIO NETTO
                </h4>
              </div>
              <div className="divide-y divide-gray-200">
                {passivoMetrics.map((metric) => {
                  const value = (yearData as any)[metric.key] || 0;
                  return (
                    <div
                      key={metric.key}
                      className={`px-4 py-2 flex justify-between items-start gap-3 ${
                        metric.isGrandTotal || metric.isTotal
                          ? "bg-gray-100"
                          : "bg-white"
                      }`}
                    >
                      <span
                        className={`text-xs flex-1 ${
                          metric.isBold
                            ? "font-bold text-gray-900"
                            : "text-gray-700"
                        } ${metric.isSubItem ? "pl-4" : ""}`}
                      >
                        {metric.label}
                      </span>
                      <span
                        className={`text-xs whitespace-nowrap ${
                          metric.isBold
                            ? "font-bold text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {formatCurrency(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      {/* {balanceSheet && balanceSheet.length > 3 && (
        <p className="hidden md:block text-xs text-gray-500 text-center mt-2">
          💡 Scorri orizzontalmente per visualizzare tutti gli anni
        </p>
      )} */}

      {/* Balance Sheet Analysis */}
      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          8.1 Analisi dello stato patrimoniale
        </h2>
        {balanceSheetAnalysis && balanceSheetAnalysis.trim().length > 0 ? (
          <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line text-justify">
              {balanceSheetAnalysis}
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-80 sm:h-96 bg-white rounded-lg shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="35%"
                    outerRadius="90%"
                    paddingAngle={2}
                    dataKey="value"
                    label={CustomLabel}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(
                      value: number | undefined,
                      name: string | undefined,
                      props: any,
                    ) => [
                      `${value || 0}% (${formatCurrency(props.payload.actualValue || 0)})`,
                      name || "",
                    ]}
                    contentStyle={{
                      backgroundColor: "#333",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
                    Bilancio
                  </div>
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
                    Patrimoniale
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4 lg:mt-8 w-full lg:w-auto">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 text-center lg:text-left">
                Componenti dello stato patrimoniale
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {pieChartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg min-w-0 lg:min-w-[250px]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        {item.value}%
                      </span>
                      <span className="text-xs text-gray-600">
                        {formatCurrency(item.actualValue || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Net Financial Position Chart */}
      {netFinancialPosition && netFinancialPosition.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            9. Posizione Finanziaria Netta
          </h2>
          <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="bg-purple-500 text-white px-4 py-2 rounded-t-lg mb-4">
              <h3 className="text-base sm:text-lg font-semibold">
                Posizione Finanziaria Netta
              </h3>
            </div>
            <div className="flex justify-end mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Posizione netta</span>
              </div>
            </div>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={netFinancialPosition}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                    tickFormatter={(value) => `Anno ${value}`}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => [
                      formatCurrency(value || 0),
                      "Posizione netta",
                    ]}
                    labelFormatter={(label) => `Anno ${label}`}
                    contentStyle={{
                      backgroundColor: "#3B82F6",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net_position"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: "#3B82F6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

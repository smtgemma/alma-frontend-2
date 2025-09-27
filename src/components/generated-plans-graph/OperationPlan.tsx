"use client";

import { IOperationsPlan } from "@/redux/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";

// Operating Cost Breakdown data for bar chart

// Default pie chart data for cost breakdown (fallback)
const defaultPieChartData = [
  { name: "Segment 1", value: 40, color: "#8B5CF6" },
  { name: "Segment 2", value: 40, color: "#312E81" },
  { name: "Segment 3", value: 20, color: "#EF4444" },
];

const COLORS = ["#8B5CF6", "#312E81", "#EF4444"];

const formatCurrency = (value: number) => {
  if (!value || isNaN(value)) return "0";
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

// Custom label component for pie chart - values inside segments with actual amounts
const CustomLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, value, name } =
    props;

  if (!percent || percent < 0.05) return null; // Don't show labels for very small segments

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
        fontSize="14"
        fontWeight="bold"
        style={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
          pointerEvents: "none",
        }}
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
        fontWeight="normal"
        style={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
          pointerEvents: "none",
        }}
      >
        {name}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{`${label} Anno`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${
              entry.dataKey === "revenue" ? "Ricavi" : "Costi"
            }: $${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
// banalnce sheet
export default function OperationsDashboard({
  operationsPlan,
  keyRatios,
  operatingCostBreakdown,
}: IOperationsPlan) {
  // Ensure we have valid data or provide fallback
  const validOperatingCostBreakdown =
    operatingCostBreakdown && operatingCostBreakdown.length > 0
      ? operatingCostBreakdown
      : [
          {
            year: 1,
            revenue: 250000,
            cogs: 75000,
            employee_costs: 60000,
            marketing: 15000,
            rent: 13000,
            administration: 8000,
            amortization: 4000,
            other_expenses: 4000,
            interest_expenses: 2000,
            tax: 5000,
          },
          {
            year: 2,
            revenue: 275000,
            cogs: 82000,
            employee_costs: 66000,
            marketing: 17000,
            rent: 13000,
            administration: 8000,
            amortization: 4000,
            other_expenses: 4000,
            interest_expenses: 2000,
            tax: 5000,
          },
          {
            year: 3,
            revenue: 300000,
            cogs: 90000,
            employee_costs: 72000,
            marketing: 18000,
            rent: 13000,
            administration: 9000,
            amortization: 4000,
            other_expenses: 4000,
            interest_expenses: 2000,
            tax: 5000,
          },
        ];
  // Generate dynamic pie chart data from validOperatingCostBreakdown
  const generatePieChartData = () => {
    if (
      !validOperatingCostBreakdown ||
      validOperatingCostBreakdown.length === 0
    ) {
      return defaultPieChartData.map((item, index) => ({
        ...item,
        actualValue: 0,
        formattedValue: formatCurrency(0),
      }));
    }

    // Use the first item from validOperatingCostBreakdown for pie chart data
    const item = validOperatingCostBreakdown[0];

    // Calculate individual cost components
    const costComponents = [
      { name: "COGS", value: item.cogs || 0 },
      { name: "Costi del personale", value: item.employee_costs || 0 },
      { name: "Marketing", value: item.marketing || 0 },
      { name: "Affitto", value: item.rent || 0 },
      { name: "Amministrazione", value: item.administration || 0 },
      { name: "Ammortamento", value: item.amortization || 0 },
      { name: "Altre spese", value: item.other_expenses || 0 },
      { name: "Spese per interessi", value: item.interest_expenses || 0 },
      { name: "Tasse", value: item.tax || 0 },
    ];

    // Calculate total cost
    const totalCost = costComponents.reduce(
      (sum, component) => sum + component.value,
      0
    );

    if (totalCost === 0) {
      return defaultPieChartData.map((item, index) => ({
        ...item,
        actualValue: 0,
        formattedValue: formatCurrency(0),
      }));
    }

    // Generate pie chart data with percentages (take top 3 components)
    const topComponents = costComponents
      .filter((component) => component.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    // Calculate total of only the top 3 components for accurate pie chart percentages
    const topComponentsTotal = topComponents.reduce(
      (sum, component) => sum + component.value,
      0
    );

    return topComponents.map((component, index) => {
      const percentage = (component.value / topComponentsTotal) * 100;
      return {
        name: component.name,
        value: Math.round(percentage),
        actualValue: component.value,
        formattedValue: formatCurrency(component.value),
        color: COLORS[index % COLORS.length],
      };
    });
  };

  const pieChartData = generatePieChartData();
  const operatingCostData = validOperatingCostBreakdown.map((item) => {
    const totalCosts =
      item.cogs +
      item.employee_costs +
      item.marketing +
      item.rent +
      item.administration +
      item.amortization +
      item.other_expenses +
      item.interest_expenses +
      item.tax;

    return {
      year: `${item.year}st`, // You can customize this part for 2nd, 3rd, etc.
      revenue: item.revenue,
      costs: totalCosts,
    };
  });

  // console.log("Oparatinon cose ", operatingCostBreakdown);
  return (
    <div className="mt-10 mx-auto space-y-8">
      {/* <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">
        Operations Plan
      </h2> */}
      {/* Operations Plan Section */}
      {/* <div className="">
        <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-justify">
          {operationsPlan}
        </p>
      </div> */}

      {/* Key Ratios Table */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        7.1 Ripartizione dei costi operativi
      </h2>

      {/* Year-wise Cost Analysis Cards */}
      <div className="">
        {/* <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">
          Year-wise Cost Analysis
        </h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {validOperatingCostBreakdown.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Anno {item.year}
                </h3>
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  ${formatCurrency(item.revenue)}
                </div>
              </div>

              {/* Basic Financials */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  {/* Financial Overview */}
                  Panoramica finanziaria
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {/* Revenue */}Ricavi
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      ${formatCurrency(item.revenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {/* COGS */}COGS
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.cogs)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {/* Employee Costs */}
                      Costi del personale
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.employee_costs)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {/* Marketing */}Marketing
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.marketing)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {/* Rent */}Affitto
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.rent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {/* Administration */}
                      Amministrazione
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.administration)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {/* Amortization */}Ammortamento
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.amortization)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {/* Other Expenses */}
                      Altre spese
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.other_expenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {/* Interest Expenses */}
                      Spese per interessi
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.interest_expenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {/* Tax */}Tasse
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.tax)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quarterly Breakdown */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  {/* Quarterly Breakdown */}
                  Ripartizione trimestrale
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Q1 Revenue */}Q1 Ricavi
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q1_revenue || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Q2 Revenue */}Q2 Ricavi
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q2_revenue || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Q3 Revenue */}Q3 Ricavi
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q3_revenue || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Q4 Revenue */}Q4 Ricavi
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q4_revenue || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Q1 Costs */}Q1 Costi
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q1_costs || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Q2 Costs */}Q2 Costi
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q2_costs || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Q3 Costs */}Q3 Costi
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q3_costs || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Q4 Costs */}Q4 Costi
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q4_costs || 0
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Employee Analytics */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  {/* Employee Analytics */}
                  Analisi del personale
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Management Costs */}
                      Costi di gestione
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).employee_analytics?.management_costs || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Operations Staff */}
                      Personale operativo
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).employee_analytics?.operations_staff || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Sales Team */}
                      Team vendite
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).employee_analytics?.sales_team || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Salary/Employee</span>
                    <span className="font-medium">
                      $
                      {(item as any).employee_analytics
                        ?.avg_salary_per_employee || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Total Headcount */}
                      Totale dipendenti
                    </span>
                    <span className="font-medium">
                      {(item as any).employee_analytics?.total_headcount ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Cost/Employee */}
                      Costo/dipendente
                    </span>
                    <span className="font-medium">
                      $
                      {(item as any).employee_analytics?.cost_per_employee ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Productivity Ratio */}
                      Rapporto produttività
                    </span>
                    <span className="font-medium">
                      {(item as any).employee_analytics?.productivity_ratio ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Overtime Costs */}
                      Costi straordinari
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).employee_analytics?.overtime_costs || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Benefits %} */}
                      Benefici %
                    </span>
                    <span className="font-medium">
                      {(item as any).employee_analytics?.benefits_percentage ||
                        "N/A"}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Marketing Analytics */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  {/* Marketing Analytics */}
                  Analisi marketing
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Digital Marketing */}
                      Marketing digitale
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).marketing_analytics?.digital_marketing ||
                          0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Traditional Marketing */}
                      Marketing tradizionale
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).marketing_analytics
                          ?.traditional_marketing || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Events & Conferences */}
                      Eventi e conferenze
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).marketing_analytics?.events_conferences ||
                          0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Content Creation */}
                      Creazione contenuti
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).marketing_analytics?.content_creation || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Paid Advertising */}
                      Pubblicità a pagamento
                    </span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).marketing_analytics?.paid_advertising || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Cost/Acquisition */}
                      Costo/acquisizione
                    </span>
                    <span className="font-medium">
                      $
                      {(item as any).marketing_analytics
                        ?.cost_per_acquisition || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Marketing ROI */}
                      ROI marketing
                    </span>
                    <span className="font-medium">
                      {(item as any).marketing_analytics?.marketing_roi ||
                        "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Lead Generation Cost */}
                      Costo generazione lead
                    </span>
                    <span className="font-medium">
                      $
                      {(item as any).marketing_analytics
                        ?.lead_generation_cost || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Conversion Cost */}
                      Costo conversione
                    </span>
                    <span className="font-medium">
                      $
                      {(item as any).marketing_analytics?.conversion_cost ||
                        "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Operational Metrics */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  {/* Operational Metrics */}
                  Metriche operative
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Cost/Unit Sold */}
                      Costo/unità venduta
                    </span>
                    <span className="font-medium">
                      $
                      {(item as any).operational_metrics?.cost_per_unit_sold ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Variable Cost Ratio */}
                      Rapporto costi variabili
                    </span>
                    <span className="font-medium">
                      {(item as any).operational_metrics?.variable_cost_ratio ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Fixed Cost Coverage */}
                      Copertura costi fissi
                    </span>
                    <span className="font-medium">
                      {(item as any).operational_metrics?.fixed_cost_coverage ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Operational Leverage */}
                      Leva operativa
                    </span>
                    <span className="font-medium">
                      {(item as any).operational_metrics
                        ?.operational_leverage || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Cost Efficiency Index */}
                      Indice efficienza costi
                    </span>
                    <span className="font-medium">
                      {(item as any).operational_metrics
                        ?.cost_efficiency_index || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Break Even Units */}
                      Unità pareggio
                    </span>
                    <span className="font-medium">
                      {(item as any).operational_metrics?.break_even_units ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Capacity Utilization */}
                      Utilizzo capacità
                    </span>
                    <span className="font-medium">
                      {(
                        (item as any).operational_metrics
                          ?.capacity_utilization * 100 || 0
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost Percentages */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  {/* Cost Percentages */}
                  Percentuali costi
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* COGS %} */}
                      COGS %
                    </span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.cogs_percent || "N/A"}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Employee %} */}
                      Dipendenti %
                    </span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.employee_percent ||
                        "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Marketing %} */}
                      Marketing %
                    </span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.marketing_percent ||
                        "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Rent %} */}
                      Affitto %
                    </span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.rent_percent || "N/A"}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Admin %} */}
                      Amministrazione %
                    </span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.admin_percent || "N/A"}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Other %} */}
                      Altri %
                    </span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.other_percent || "N/A"}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Variance Analysis */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  {/* Variance Analysis */}
                  Analisi varianze
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Budget vs Actual */}
                      Budget vs Effettivo
                    </span>
                    <span className="font-medium">
                      {(item as any).variance_analysis
                        ?.budget_vs_actual_variance || "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* YoY Cost Growth */}
                      Crescita costi YoY
                    </span>
                    <span className="font-medium">
                      {(
                        (item as any).variance_analysis?.yoy_cost_growth_rate *
                          100 || 0
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Cost Inflation Impact */}
                      Impatto inflazione costi
                    </span>
                    <span className="font-medium">
                      {(item as any).variance_analysis?.cost_inflation_impact ||
                        "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Efficiency Improvement */}
                      Miglioramento efficienza
                    </span>
                    <span className="font-medium">
                      {(item as any).variance_analysis
                        ?.efficiency_improvement || "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost/Revenue Ratio</span>
                    <span className="font-medium">
                      {(item as any).variance_analysis
                        ?.cost_per_revenue_ratio || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benchmarking Ratios */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Benchmarking Ratios
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Industry Avg COGS</span>
                    <span className="font-medium">
                      {(item as any).benchmarking_ratios?.industry_avg_cogs ||
                        "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Employee Cost Benchmark
                    </span>
                    <span className="font-medium">
                      {(item as any).benchmarking_ratios
                        ?.employee_cost_benchmark || "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Marketing Spend Benchmark
                    </span>
                    <span className="font-medium">
                      {(item as any).benchmarking_ratios
                        ?.marketing_spend_benchmark || "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {/* Admin Cost Benchmark */}
                      Benchmark costi amministrativi
                    </span>
                    <span className="font-medium">
                      {(item as any).benchmarking_ratios
                        ?.admin_cost_benchmark || "N/A"}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operating Cost Breakdown Pie Chart */}
      <div className="">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          7.2 Ripartizione dei costi operativi
        </h2>
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8">
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-80 sm:h-96">
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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value}% (${
                      props.payload.formattedValue ||
                      formatCurrency(props.payload.actualValue || 0)
                    })`,
                    name,
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                  {/* Operating */}
                  Costi
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                  {/* Cost */}
                  Operativi
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                  {/* Breakdown */}
                  Ripartizione
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Legend with actual values */}
          <div className="flex flex-col gap-4 mt-4 lg:mt-8 w-full lg:w-auto">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 text-center lg:text-left">
              {/* Cost Breakdown */}
              Ripartizione costi
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
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
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
                      {item.formattedValue ||
                        formatCurrency(item.actualValue || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

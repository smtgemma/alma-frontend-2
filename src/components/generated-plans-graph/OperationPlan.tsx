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
        <p className="text-sm font-medium text-gray-900">{`${label} Year`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${
              entry.dataKey === "revenue" ? "Revenue" : "Costs"
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
  const validOperatingCostBreakdown = operatingCostBreakdown && operatingCostBreakdown.length > 0 
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
          tax: 5000
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
          tax: 5000
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
          tax: 5000
        }
      ];
  // Generate dynamic pie chart data from validOperatingCostBreakdown
  const generatePieChartData = () => {
    if (!validOperatingCostBreakdown || validOperatingCostBreakdown.length === 0) {
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
      { name: "Employee Costs", value: item.employee_costs || 0 },
      { name: "Marketing", value: item.marketing || 0 },
      { name: "Rent", value: item.rent || 0 },
      { name: "Administration", value: item.administration || 0 },
      { name: "Amortization", value: item.amortization || 0 },
      { name: "Other Expenses", value: item.other_expenses || 0 },
      { name: "Interest Expenses", value: item.interest_expenses || 0 },
      { name: "Tax", value: item.tax || 0 },
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
  const operatingCostData = operatingCostBreakdown.map((item) => {
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
      <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">
        Operations Plan
      </h2>
      {/* Operations Plan Section */}
      <div className="">
        <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-justify">
          {operationsPlan}
        </p>
      </div>

      {/* Key Ratios Table */}
      <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">
        Operating Cost Breakdown
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
                  Year {item.year}
                </h3>
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  ${formatCurrency(item.revenue)}
                </div>
              </div>

              {/* Basic Financials */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Financial Overview
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="text-sm font-bold text-green-600">
                      ${formatCurrency(item.revenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">COGS</span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.cogs)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Employee Costs
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.employee_costs)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Marketing</span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.marketing)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rent</span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.rent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Administration
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.administration)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amortization</span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.amortization)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Other Expenses
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.other_expenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Interest Expenses
                    </span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.interest_expenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tax</span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(item.tax)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quarterly Breakdown */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Quarterly Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Q1 Revenue</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q1_revenue || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Q2 Revenue</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q2_revenue || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Q3 Revenue</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q3_revenue || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Q4 Revenue</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q4_revenue || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Q1 Costs</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q1_costs || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Q2 Costs</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q2_costs || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Q3 Costs</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).quarterly_breakdown?.q3_costs || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Q4 Costs</span>
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
                  Employee Analytics
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Management Costs</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).employee_analytics?.management_costs || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Operations Staff</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).employee_analytics?.operations_staff || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sales Team</span>
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
                    <span className="text-gray-600">Total Headcount</span>
                    <span className="font-medium">
                      {(item as any).employee_analytics?.total_headcount ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost/Employee</span>
                    <span className="font-medium">
                      $
                      {(item as any).employee_analytics?.cost_per_employee ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Productivity Ratio</span>
                    <span className="font-medium">
                      {(item as any).employee_analytics?.productivity_ratio ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overtime Costs</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).employee_analytics?.overtime_costs || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Benefits %</span>
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
                  Marketing Analytics
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Digital Marketing</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).marketing_analytics?.digital_marketing ||
                          0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Traditional Marketing</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).marketing_analytics
                          ?.traditional_marketing || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Events & Conferences</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).marketing_analytics?.events_conferences ||
                          0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Content Creation</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).marketing_analytics?.content_creation || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid Advertising</span>
                    <span className="font-medium">
                      $
                      {formatCurrency(
                        (item as any).marketing_analytics?.paid_advertising || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost/Acquisition</span>
                    <span className="font-medium">
                      $
                      {(item as any).marketing_analytics
                        ?.cost_per_acquisition || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marketing ROI</span>
                    <span className="font-medium">
                      {(item as any).marketing_analytics?.marketing_roi ||
                        "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lead Generation Cost</span>
                    <span className="font-medium">
                      $
                      {(item as any).marketing_analytics
                        ?.lead_generation_cost || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Cost</span>
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
                  Operational Metrics
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost/Unit Sold</span>
                    <span className="font-medium">
                      $
                      {(item as any).operational_metrics?.cost_per_unit_sold ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Variable Cost Ratio</span>
                    <span className="font-medium">
                      {(item as any).operational_metrics?.variable_cost_ratio ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fixed Cost Coverage</span>
                    <span className="font-medium">
                      {(item as any).operational_metrics?.fixed_cost_coverage ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Operational Leverage</span>
                    <span className="font-medium">
                      {(item as any).operational_metrics
                        ?.operational_leverage || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Efficiency Index</span>
                    <span className="font-medium">
                      {(item as any).operational_metrics
                        ?.cost_efficiency_index || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Break Even Units</span>
                    <span className="font-medium">
                      {(item as any).operational_metrics?.break_even_units ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity Utilization</span>
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
                  Cost Percentages
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">COGS %</span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.cogs_percent || "N/A"}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee %</span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.employee_percent ||
                        "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marketing %</span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.marketing_percent ||
                        "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rent %</span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.rent_percent || "N/A"}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin %</span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.admin_percent || "N/A"}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other %</span>
                    <span className="font-medium">
                      {(item as any).cost_percentages?.other_percent || "N/A"}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Variance Analysis */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Variance Analysis
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget vs Actual</span>
                    <span className="font-medium">
                      {(item as any).variance_analysis
                        ?.budget_vs_actual_variance || "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">YoY Cost Growth</span>
                    <span className="font-medium">
                      {(
                        (item as any).variance_analysis?.yoy_cost_growth_rate *
                          100 || 0
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Inflation Impact</span>
                    <span className="font-medium">
                      {(item as any).variance_analysis?.cost_inflation_impact ||
                        "N/A"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Efficiency Improvement
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
                    <span className="text-gray-600">Admin Cost Benchmark</span>
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
        <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">
          Operating Cost Breakdown
        </h2>
        <div className="flex justify-center items-start gap-8">
          <div className="relative w-96 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={175}
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
                <div className="text-lg font-semibold text-gray-900">
                  Operating
                </div>
                <div className="text-lg font-semibold text-gray-900">Cost</div>
                <div className="text-lg font-semibold text-gray-900">
                  Breakdown
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Legend with actual values */}
          <div className="flex flex-col gap-4 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Cost Breakdown
            </h3>
            {pieChartData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg min-w-[250px]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900">
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
  );
}

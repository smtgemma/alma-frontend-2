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
  return value.toLocaleString();
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
            }: €${formatCurrency(entry.value)}`}
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

      {/* Operating Cost Breakdown Pie Chart */}
      <div className="">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          5.1 Ripartizione dei costi operativi
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
                  formatter={(value: number | undefined, name: string | undefined, props: any) => [
                    `${value || 0}% (${
                      props.payload.formattedValue ||
                      formatCurrency(props.payload.actualValue || 0)
                    })`,
                    name || '',
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

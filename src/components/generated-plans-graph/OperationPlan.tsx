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
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
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

export default function OperationsDashboard({
  operationsPlan,
  keyRatios,
  operatingCostBreakdown,
}: IOperationsPlan) {
  // Generate dynamic pie chart data from operatingCostBreakdown
  const generatePieChartData = () => {
    if (!operatingCostBreakdown || operatingCostBreakdown.length === 0) {
      return defaultPieChartData;
    }

    // Use the first item from operatingCostBreakdown for pie chart data
    const item = operatingCostBreakdown[0];

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
      return defaultPieChartData;
    }

    // Generate pie chart data with percentages (take top 3 components)
    return costComponents
      .filter((component) => component.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map((component, index) => {
        const percentage = (component.value / totalCost) * 100;
        return {
          name: component.name,
          value: Math.round(percentage),
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
        Key Ratios
      </h2>
      <div className="">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead>
              <tr className="bg-purple-100">
                <th className="px-4 py-3 text-sm font-medium text-[#121417]">
                  Year
                </th>
                <th className="px-4 py-3 text-sm font-medium text-[#121417]">
                  ROI
                </th>
                <th className="px-4 py-3 text-sm font-medium text-[#121417]">
                  ROE
                </th>
                <th className="px-4 py-3 text-sm font-medium text-[#121417]">
                  Debt to Equity
                </th>
                <th className="px-4 py-3 text-sm font-medium text-[#121417]">
                  Gross Margins
                </th>
                <th className="px-4 py-3 text-sm font-medium text-[#121417]">
                  EBITDA Margin
                </th>
                <th className="px-4 py-3 text-sm font-medium text-[#121417]">
                  Net Margin
                </th>
                <th className="px-4 py-3 text-sm font-medium text-[#121417]">
                  Current Ratio
                </th>
                <th className="px-4 py-3 text-sm font-medium text-[#121417]">
                  Quick Ratio
                </th>
                <th className="px-4 py-3 text-sm font-medium text-[#121417]">
                  Asset Turnover
                </th>
              </tr>
            </thead>
            <tbody>
              {keyRatios.map((row, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-900">{row.year}</td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {row.roi}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {row.roe}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {row.debt_to_equity}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {row.gross_margin}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {row.ebitda_margin}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {row.net_margin}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {row.current_ratio}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {row.quick_ratio}
                  </td>
                  <td className="px-4 py-3 text-sm font-normal text-[#61758A]">
                    {row.asset_turnover}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operating Cost Breakdown Bar Chart */}
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Operating Cost Breakdown
          </h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              Yearly
            </span>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-gray-700">Costs</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={operatingCostData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="costs" fill="#D1D5DB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Operating Cost Breakdown Pie Chart */}
      <div className="">
        <h2 className="text-2xl sm:text-4xl font-medium text-gray-800 mb-6">
          Operating Cost Breakdown
        </h2>
        <div className="flex justify-center">
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
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
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
            {/* Dynamic Percentage labels */}
            {pieChartData.map((item, index) => {
              const positions = [
                { top: "top-16", right: "right-20" },
                { bottom: "bottom-20", left: "left-12" },
                { bottom: "bottom-22", left: "left-60" },
              ];
              const position = positions[index] || positions[0];
              return (
                <div
                  key={index}
                  className={`absolute text-white font-bold text-5xl ${Object.entries(
                    position
                  )
                    .map(([key, value]) => `${key}-${value}`)
                    .join(" ")}`}
                >
                  {item.value}%
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

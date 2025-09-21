<!-- "use client";

import Chart from "chart.js/auto";
import html2canvas from "html2canvas";

// Don't register ChartDataLabels globally to avoid conflicts

interface DocDownloadProps {
  executiveSummary: string;
  businessOverview: string;
  marketAnalysis: string;
  businessModel?: string;
  marketingSalesStrategy?: string;
  sectorStrategy?: string;
  fundingSources?: string;
  operationsPlan?: string;
  managementTeam?: string;
  financialHighlights?: any[];
  cashFlowAnalysis?: any[];
  profitLossProjection?: any[];
  balanceSheet?: any[];
  netFinancialPosition?: any[];
  debtStructure?: any[];
  keyRatios?: any[];
  operatingCostBreakdown?: any[];
  financialAnalysis?: any[];
  ratiosAnalysis?: any[];
  productionSalesForecast?: any[];
}

// Helper function to create and capture charts as images
const generateChartImage = async (
  type: "bar" | "pie" | "line",
  data: any[],
  title: string
): Promise<string> => {
  return new Promise((resolve) => {
    // Create a temporary container
    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      top: -10000px;
      left: -10000px;
      width: 500px;
      height: 400px;
      background: white;
      z-index: -9999;
    `;

    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 400;
    canvas.style.cssText = "width: 500px; height: 400px;";

    container.appendChild(canvas);
    document.body.appendChild(container);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      document.body.removeChild(container);
      resolve("");
      return;
    }

    const colors = [
      "#3498db",
      "#e74c3c",
      "#2ecc71",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
    ];

    let chartConfig: any;

    if (type === "bar") {
      chartConfig = {
        type: "bar",
        data: {
          labels: data.map(
            (item) =>
              item.name || item.category || `Item ${data.indexOf(item) + 1}`
          ),
          datasets: [
            {
              label: title,
              data: data.map((item) =>
                parseFloat(item.value || item.amount || 0)
              ),
              backgroundColor: colors.slice(0, data.length),
              borderColor: "#2c3e50",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: title,
              font: { size: 16, weight: "bold" },
            },
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: "#e0e0e0" },
              ticks: {
                color: "#2c3e50",
                callback: function (value: any) {
                  if (!value || isNaN(value)) return "$0";
                  if (value >= 1000000) {
                    return `$${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `$${(value / 1000).toFixed(0)}K`;
                  }
                  return `$${value.toLocaleString()}`;
                },
              },
            },
            x: {
              grid: { color: "#e0e0e0" },
              ticks: { color: "#2c3e50" },
            },
          },
        },
      };
    } else if (type === "pie") {
      chartConfig = {
        type: "pie",
        data: {
          labels: data.map(
            (item) =>
              item.name || item.category || `Item ${data.indexOf(item) + 1}`
          ),
          datasets: [
            {
              data: data.map((item) =>
                parseFloat(item.value || item.amount || 0)
              ),
              backgroundColor: colors.slice(0, data.length),
              borderColor: "#2c3e50",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: title,
              font: { size: 16, weight: "bold" },
            },
            legend: {
              position: "right",
              labels: {
                color: "#2c3e50",
                font: { size: 12 },
                generateLabels: function (chart: any) {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label: string, i: number) => {
                      const value = data.datasets[0].data[i];
                      const total = data.datasets[0].data.reduce(
                        (a: number, b: number) => a + b,
                        0
                      );
                      const percentage = ((value / total) * 100).toFixed(0);
                      const formattedValue =
                        !value || isNaN(value)
                          ? "$0"
                          : value >= 1000000
                          ? `$${(value / 1000000).toFixed(1)}M`
                          : value >= 1000
                          ? `$${(value / 1000).toFixed(0)}K`
                          : `$${value.toLocaleString()}`;

                      return {
                        text: `${label}: ${percentage}% (${formattedValue})`,
                        fillStyle: data.datasets[0].backgroundColor[i],
                        strokeStyle: data.datasets[0].borderColor,
                        lineWidth: data.datasets[0].borderWidth,
                        hidden: false,
                        index: i,
                      };
                    });
                  }
                  return [];
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  const value = context.parsed;
                  const total = context.dataset.data.reduce(
                    (a: number, b: number) => a + b,
                    0
                  );
                  const percentage = ((value / total) * 100).toFixed(0);
                  const formattedValue =
                    !value || isNaN(value)
                      ? "$0"
                      : value >= 1000000
                      ? `$${(value / 1000000).toFixed(1)}M`
                      : value >= 1000
                      ? `$${(value / 1000).toFixed(0)}K`
                      : `$${value.toLocaleString()}`;

                  return `${context.label}: ${percentage}% (${formattedValue})`;
                },
              },
            },
          },
        },
      };
    } else if (type === "line") {
      chartConfig = {
        type: "line",
        data: {
          labels: data.map(
            (item) =>
              item.name || item.category || `Item ${data.indexOf(item) + 1}`
          ),
          datasets: [
            {
              label: title,
              data: data.map((item) =>
                parseFloat(item.value || item.amount || 0)
              ),
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: title,
              font: { size: 16, weight: "bold" },
            },
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: "#e0e0e0" },
              ticks: { color: "#2c3e50" },
            },
            x: {
              grid: { color: "#e0e0e0" },
              ticks: { color: "#2c3e50" },
            },
          },
        },
      };
    }

    const chart = new Chart(ctx, chartConfig);

    // Wait for chart to render then capture as image
    setTimeout(async () => {
      try {
        const dataURL = canvas.toDataURL("image/png");
        chart.destroy();
        document.body.removeChild(container);
        resolve(dataURL);
      } catch (error) {
        console.error("Error generating chart image:", error);
        chart.destroy();
        document.body.removeChild(container);
        resolve("");
      }
    }, 1000);
  });
};

export const generateWordDocument = async ({
  executiveSummary,
  businessOverview,
  marketAnalysis,
  businessModel = "",
  marketingSalesStrategy = "",
  sectorStrategy = "",
  fundingSources = "",
  operationsPlan = "",
  managementTeam = "",
  financialHighlights = [],
  cashFlowAnalysis = [],
  profitLossProjection = [],
  balanceSheet = [],
  netFinancialPosition = [],
  debtStructure = [],
  keyRatios = [],
  operatingCostBreakdown = [],
  financialAnalysis = [],
  ratiosAnalysis = [],
  productionSalesForecast = [],
}: DocDownloadProps) => {
  // Helper function to convert data for charts
  const convertDataForChart = (data: any[], chartType: string = "bar") => {
    if (!data || data.length === 0) return [];

    // Handle different chart types and data structures
    if (chartType === "financial") {
      // For financial highlights - show Revenue and Net Income over years
      return data.map((item, index) => ({
        name: `Year ${item.year || index + 1}`,
        value: item.revenue || 0,
        amount: item.revenue || 0,
      }));
    }

    if (chartType === "operating_cost") {
      // For operating cost breakdown - show top cost categories
      if (data.length > 0) {
        const item = data[0]; // Use first year's data
        const costComponents = [
          { name: "COGS", value: item.cogs || 0 },
          { name: "Employee Costs", value: item.employee_costs || 0 },
          { name: "Marketing", value: item.marketing || 0 },
          { name: "Rent", value: item.rent || 0 },
          { name: "Administration", value: item.administration || 0 },
        ];

        return costComponents
          .filter((comp) => comp.value > 0)
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // Top 5 cost components
      }
    }

    if (chartType === "balance_sheet") {
      // For balance sheet - show Assets, Liabilities, Equity
      if (data.length > 0) {
        const item = data[0]; // Use first year's data
        return [
          { name: "Assets", value: item.assets || 0 },
          { name: "Liabilities", value: item.liabilities || 0 },
          { name: "Equity", value: item.equity || 0 },
        ].filter((comp) => comp.value > 0);
      }
    }

    // Generic conversion for other data types
    return data.map((item, index) => {
      // If it's already in the right format
      if (item.value !== undefined || item.amount !== undefined) {
        return {
          name: item.name || item.category || item.label || `Item ${index + 1}`,
          value: parseFloat(item.value || item.amount || 0),
        };
      }

      // Try to extract numeric values from object
      const numericKeys = Object.keys(item).filter(
        (key) => typeof item[key] === "number" || !isNaN(parseFloat(item[key]))
      );

      if (numericKeys.length > 0) {
        return {
          name: numericKeys[0],
          value: parseFloat(item[numericKeys[0]]),
        };
      }

      // Fallback
      return {
        name: `Item ${index + 1}`,
        value: index + 1,
      };
    });
  };

  // Generate chart images with proper data conversion
  const financialChart =
    financialHighlights.length > 0
      ? await generateChartImage(
          "bar",
          convertDataForChart(financialHighlights, "financial"),
          "Financial Highlights Bar Chart"
        )
      : "";

  const profitLossChart =
    profitLossProjection.length > 0
      ? await generateChartImage(
          "line",
          convertDataForChart(profitLossProjection, "financial"),
          "Profit Loss Trend Chart"
        )
      : "";

  const balanceSheetChart =
    balanceSheet.length > 0
      ? await generateChartImage(
          "pie",
          convertDataForChart(balanceSheet, "balance_sheet"),
          "Balance Sheet Distribution Chart"
        )
      : "";

  const keyRatiosChart =
    keyRatios.length > 0
      ? await generateChartImage(
          "bar",
          convertDataForChart(keyRatios),
          "Key Ratios Bar Chart"
        )
      : "";

  const operatingCostChart =
    operatingCostBreakdown.length > 0
      ? await generateChartImage(
          "pie",
          convertDataForChart(operatingCostBreakdown, "operating_cost"),
          "Operating Cost Distribution Chart"
        )
      : "";

  // Helper function to generate table HTML
  const generateTableHTML = (data: any[], title: string) => {
    if (!data || data.length === 0) return "";

    const headers = Object.keys(data[0] || {});
    const tableRows = data
      .map(
        (row) =>
          `<tr>${headers
            .map((header) => `<td>${row[header] || ""}</td>`)
            .join("")}</tr>`
      )
      .join("");

    return `
      <h3>${title}</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            ${headers.map((header) => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  };

  // Helper function to generate chart description
  const generateChartDescription = (data: any[], title: string) => {
    if (!data || data.length === 0) return "";

    return `
      <h3>${title}</h3>
      <p><strong>Chart Data:</strong></p>
      <ul>
        ${data
          .map((item, index) => {
            const details = Object.entries(item)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ");
            return `<li>${details}</li>`;
          })
          .join("")}
      </ul>
    `;
  };

  // Create comprehensive HTML content for the business plan
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Business Plan</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          margin: 40px;
          color: #333;
        }
        h1 {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 30px;
          font-size: 24px;
        }
        h2 {
          color: #34495e;
          margin-top: 30px;
          margin-bottom: 15px;
          font-size: 18px;
          border-bottom: 2px solid #3498db;
          padding-bottom: 5px;
        }
        h3 {
          color: #34495e;
          margin-top: 25px;
          margin-bottom: 10px;
          font-size: 16px;
        }
        p {
          margin-bottom: 15px;
          text-align: justify;
        }
        .section {
          margin-bottom: 25px;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        li {
          margin-bottom: 5px;
        }
        .chart-note {
          background-color: #f9f9f9;
          border-left: 4px solid #3498db;
          padding: 10px;
          margin: 15px 0;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Business Plan</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>Executive Summary</h2>
        <p>${executiveSummary}</p>
      </div>

      <div class="section">
        <h2>Business Overview</h2>
        <p>${businessOverview}</p>
      </div>

      <div class="section">
        <h2>Market Analysis</h2>
        <p>${marketAnalysis}</p>
      </div>

      ${
        businessModel
          ? `
      <div class="section">
        <h2>Business Model</h2>
        <p>${businessModel}</p>
      </div>
      `
          : ""
      }

      ${
        marketingSalesStrategy
          ? `
      <div class="section">
        <h2>Marketing & Sales Strategy</h2>
        <p>${marketingSalesStrategy}</p>
      </div>
      `
          : ""
      }

      ${
        sectorStrategy
          ? `
      <div class="section">
        <h2>Sector Strategy</h2>
        <p>${sectorStrategy}</p>
      </div>
      `
          : ""
      }

      ${
        fundingSources
          ? `
      <div class="section">
        <h2>Funding Sources</h2>
        <p>${fundingSources}</p>
      </div>
      `
          : ""
      }

      ${
        operationsPlan
          ? `
      <div class="section">
        <h2>Operations Plan</h2>
        <p>${operationsPlan}</p>
      </div>
      `
          : ""
      }

      ${
        managementTeam
          ? `
      <div class="section">
        <h2>Management Team</h2>
        <p>${managementTeam}</p>
      </div>
      `
          : ""
      }

      ${
        financialHighlights.length > 0
          ? `
      <div class="section">
        <h2>Financial Highlights</h2>
        ${generateTableHTML(financialHighlights, "Financial Highlights Table")}
        ${
          financialChart
            ? `
          <div style="margin: 20px 0; text-align: center;">
            <img src="${financialChart}" alt="Financial Highlights Chart" style="max-width: 100%; height: auto; border: 2px solid #2c3e50; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
          </div>
        `
            : ""
        }
        <div class="chart-note">
          <strong>Note:</strong> This section includes bar charts showing Revenue and Net Income trends over multiple years.
        </div>
      </div>
      `
          : ""
      }

      ${
        cashFlowAnalysis.length > 0
          ? `
      <div class="section">
        <h2>Cash Flow Analysis</h2>
        ${generateTableHTML(cashFlowAnalysis, "Cash Flow Analysis Table")}
      </div>
      `
          : ""
      }

      ${
        profitLossProjection.length > 0
          ? `
      <div class="section">
        <h2>Profit Loss Projection</h2>
        ${generateTableHTML(
          profitLossProjection,
          "Profit Loss Projection Table"
        )}
        ${
          profitLossChart
            ? `
          <div style="margin: 20px 0; text-align: center;">
            <img src="${profitLossChart}" alt="Profit Loss Trend Chart" style="max-width: 100%; height: auto; border: 2px solid #2c3e50; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
          </div>
        `
            : ""
        }
        <div class="chart-note">
          <strong>Note:</strong> This section includes line charts showing profit and loss trends over time.
        </div>
      </div>
      `
          : ""
      }

      ${
        balanceSheet.length > 0
          ? `
      <div class="section">
        <h2>Balance Sheet</h2>
        ${generateTableHTML(balanceSheet, "Balance Sheet Table")}
        ${
          balanceSheetChart
            ? `
          <div style="margin: 20px 0; text-align: center;">
            <img src="${balanceSheetChart}" alt="Balance Sheet Distribution Chart" style="max-width: 100%; height: auto; border: 2px solid #2c3e50; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
          </div>
        `
            : ""
        }
        <div class="chart-note">
          <strong>Note:</strong> This section includes donut charts showing Assets, Liabilities, and Equity distribution.
        </div>
      </div>
      `
          : ""
      }

      ${
        netFinancialPosition.length > 0
          ? `
      <div class="section">
        <h2>Net Financial Position</h2>
        ${generateTableHTML(
          netFinancialPosition,
          "Net Financial Position Table"
        )}
      </div>
      `
          : ""
      }

      ${
        debtStructure.length > 0
          ? `
      <div class="section">
        <h2>Debt Structure</h2>
        ${generateTableHTML(debtStructure, "Debt Structure Table")}
      </div>
      `
          : ""
      }

      ${
        keyRatios.length > 0
          ? `
      <div class="section">
        <h2>Key Ratios</h2>
        ${generateTableHTML(keyRatios, "Key Ratios Table")}
        ${
          keyRatiosChart
            ? `
          <div style="margin: 20px 0; text-align: center;">
            <img src="${keyRatiosChart}" alt="Key Ratios Bar Chart" style="max-width: 100%; height: auto; border: 2px solid #2c3e50; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
          </div>
        `
            : ""
        }
        <div class="chart-note">
          <strong>Note:</strong> This section includes bar charts showing Users and Customers growth over time.
        </div>
      </div>
      `
          : ""
      }

      ${
        operatingCostBreakdown.length > 0
          ? `
      <div class="section">
        <h2>Operating Cost Breakdown</h2>
        ${generateTableHTML(
          operatingCostBreakdown,
          "Operating Cost Breakdown Table"
        )}
        ${
          operatingCostChart
            ? `
          <div style="margin: 20px 0; text-align: center;">
            <img src="${operatingCostChart}" alt="Operating Cost Distribution Chart" style="max-width: 100%; height: auto; border: 2px solid #2c3e50; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
          </div>
        `
            : ""
        }
        <div class="chart-note">
          <strong>Note:</strong> This section includes donut charts showing cost distribution across different categories.
        </div>
      </div>
      `
          : ""
      }

      ${
        financialAnalysis.length > 0
          ? `
      <div class="section">
        <h2>Financial Analysis</h2>
        ${generateTableHTML(financialAnalysis, "Financial Analysis Table")}
        <div class="chart-note">
          <strong>Note:</strong> This section includes comprehensive financial metrics and analysis data.
        </div>
      </div>
      `
          : ""
      }

      ${
        ratiosAnalysis.length > 0
          ? `
      <div class="section">
        <h2>Ratios Analysis</h2>
        ${generateTableHTML(ratiosAnalysis, "Ratios Analysis Table")}
        <div class="chart-note">
          <strong>Note:</strong> This section includes financial ratios and performance indicators.
        </div>
      </div>
      `
          : ""
      }

      ${
        productionSalesForecast.length > 0
          ? `
      <div class="section">
        <h2>Production Sales Forecast</h2>
        ${generateTableHTML(productionSalesForecast, "Production Sales Forecast Table")}
        <div class="chart-note">
          <strong>Note:</strong> This section includes production metrics, sales forecasts, and growth projections.
        </div>
      </div>
      `
          : ""
      }

      <div class="footer">
        <p>This document was generated by BusinessPlanAI</p>
        <p>© ${new Date().getFullYear()} All rights reserved</p>
      </div>
    </body>
    </html>
  `;

  // Create a blob with the HTML content
  const blob = new Blob([htmlContent], { type: "application/msword" });

  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Business_Plan_${new Date().toISOString().split("T")[0]}.doc`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  console.log("Comprehensive Word document downloaded successfully!");
}; -->

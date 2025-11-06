"use client";

import Chart from "chart.js/auto";
import html2canvas from "html2canvas";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register ChartDataLabels plugin
Chart.register(ChartDataLabels);

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
  implementationTimeline?: any[];
  financialAnalysis?: any[];
  ratiosAnalysis?: any[];
  productionSalesForecast?: any[];
  financialHighlights?: any[];
  cashFlowAnalysis?: any[];
  profitLossProjection?: any[];
  balanceSheet?: any[];
  netFinancialPosition?: any[];
  debtStructure?: any[];
  keyRatios?: any[];
  operatingCostBreakdown?: any[];
  balanceSheetAnalysis?: string;
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
      "#8B5CF6", // Purple for Assets (first)
      "#1E1B4B", // Dark Blue for Liabilities (second)
      "#EF4444", // Red for Equity (third)
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
                  if (!value || isNaN(value)) return "€0";
                  return `€${value.toLocaleString()}`;
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
      // For balance sheet, use donut chart with center text
      const isBalanceSheet = title.includes("Balance Sheet");

      chartConfig = {
        type: "doughnut",
        data: {
          labels: data.map(
            (item) =>
              item.name || item.category || `Item ${data.indexOf(item) + 1}`
          ),
          originalData: data, // Store original data for formatting
          datasets: [
            {
              data: data.map((item) => {
                const value = parseFloat(item.value || item.amount || 0);
                // Use absolute values for percentage calculation
                return Math.abs(value);
              }),
              backgroundColor: colors.slice(0, data.length),
              borderColor: "#ffffff",
              borderWidth: 2,
              cutout: isBalanceSheet ? "60%" : "0%", // Donut for balance sheet
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          backgroundColor: "white",
          plugins: {
            title: {
              display: !isBalanceSheet,
              text: title,
              font: { size: 16, weight: "bold" },
            },
            legend: {
              display: isBalanceSheet,
              position: "right",
              labels: {
                color: "#2c3e50",
                font: { size: 12 },
                usePointStyle: true,
                pointStyle: "circle",
                generateLabels: function (chart: any) {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label: string, i: number) => {
                      const value = data.datasets[0].data[i];
                      const total = data.datasets[0].data.reduce(
                        (a: number, b: number) => a + b,
                        0
                      );
                      const percentage =
                        total > 0 ? ((value / total) * 100).toFixed(0) : "0";

                      // Get original value for formatting
                      const originalData = data.originalData || data;
                      const originalValue =
                        originalData[i]?.value || originalData[i]?.amount || 0;
                      const formattedValue =
                        !originalValue || isNaN(originalValue)
                          ? "€0"
                          : `€${originalValue.toLocaleString()}`;

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
            datalabels: {
              display: isBalanceSheet,
              color: "#ffffff",
              font: {
                size: 14,
                weight: "bold",
              },
              formatter: function (value: number, context: any) {
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                const percentage =
                  total > 0 ? ((value / total) * 100).toFixed(0) : "0";
                const label = context.chart.data.labels[context.dataIndex];
                return `${percentage}%\n${label}`;
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
                  const percentage =
                    total > 0 ? ((value / total) * 100).toFixed(0) : "0";
                  const formattedValue =
                    !value || isNaN(value)
                      ? "€0"
                      : `€${value.toLocaleString()}`;

                  return `${context.label}: ${percentage}% (${formattedValue})`;
                },
              },
            },
          },
        },
      };
    } else if (type === "line") {
      const chartData = data.map((item) =>
        parseFloat(item.value || item.amount || 0)
      );

      // Calculate min and max values for better scaling
      const minValue = Math.min(...chartData);
      const maxValue = Math.max(...chartData);
      const range = maxValue - minValue;

      // Set y-axis bounds with some padding
      const yAxisMin = minValue - range * 0.1;
      const yAxisMax = maxValue + range * 0.1;

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
              data: chartData,
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
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  const value = context.parsed.y;
                  const formattedValue =
                    !value || isNaN(value)
                      ? "€0"
                      : `€${value.toLocaleString()}`;
                  return `${context.dataset.label}: ${formattedValue}`;
                },
              },
            },
          },
          scales: {
            y: {
              min: yAxisMin,
              max: yAxisMax,
              grid: { color: "#e0e0e0" },
              ticks: {
                color: "#2c3e50",
                callback: function (value: any) {
                  if (!value || isNaN(value)) return "€0";
                  return `€${value.toLocaleString()}`;
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
  financialAnalysis = [],
  ratiosAnalysis = [],
  productionSalesForecast = [],
  financialHighlights = [],
  cashFlowAnalysis = [],
  profitLossProjection = [],
  balanceSheet = [],
  netFinancialPosition = [],
  debtStructure = [],
  keyRatios = [],
  operatingCostBreakdown = [],
  balanceSheetAnalysis = "",
}: DocDownloadProps) => {
  // Ensure all array parameters are properly initialized to prevent null reference errors
  const safeFinancialAnalysis = Array.isArray(financialAnalysis) ? financialAnalysis : [];
  const safeRatiosAnalysis = Array.isArray(ratiosAnalysis) ? ratiosAnalysis : [];
  const safeProductionSalesForecast = Array.isArray(productionSalesForecast) ? productionSalesForecast : [];
  const safeFinancialHighlights = Array.isArray(financialHighlights) ? financialHighlights : [];
  const safeCashFlowAnalysis = Array.isArray(cashFlowAnalysis) ? cashFlowAnalysis : [];
  const safeProfitLossProjection = Array.isArray(profitLossProjection) ? profitLossProjection : [];
  const safeBalanceSheet = Array.isArray(balanceSheet) ? balanceSheet : [];
  // Normalize balance sheet to common keys used across UI/PDF
  const normalizeBalanceSheetItem = (item: any) => {
    if (!item || typeof item !== "object") return item;
    const invested_capital =
      item.invested_capital ??
      item.total_invested_capital ??
      item.net_invested_capital ??
      item.sources_of_financing ??
      0;
    const net_equity = item.net_equity ?? item.total_equity ?? item.equity ?? 0;
    const net_financial_debt = item.net_financial_debt ?? item.liabilities ?? 0;
    const net_fixed_assets = item.net_fixed_assets ?? item.total_fixed_assets ?? 0;
    const net_operating_working_capital =
      item.net_operating_working_capital ?? item.net_operating_current_assets ?? 0;
    const cash_and_banks =
      item.cash_and_banks ?? item.cash_bank_accounts ?? item.cash_bank ?? 0;

    const assets = item.assets ?? invested_capital;
    const liabilities = item.liabilities ?? net_financial_debt;
    const equity = item.equity ?? net_equity;

    return {
      year: item.year,
      invested_capital,
      net_equity,
      net_financial_debt,
      net_fixed_assets,
      net_operating_working_capital,
      cash_and_banks,
      assets,
      liabilities,
      equity,
    };
  };
  const normalizedBalanceSheet = safeBalanceSheet.map(normalizeBalanceSheetItem);
  const safeNetFinancialPosition = Array.isArray(netFinancialPosition) ? netFinancialPosition : [];
  const safeDebtStructure = Array.isArray(debtStructure) ? debtStructure : [];
  const safeKeyRatios = Array.isArray(keyRatios) ? keyRatios : [];
  const safeOperatingCostBreakdown = Array.isArray(operatingCostBreakdown) ? operatingCostBreakdown : [];
  // Helper function to convert data for charts
  const convertDataForChart = (data: any[], chartType: string = "bar") => {
    if (!data || data.length === 0) return [];

    // Handle different chart types and data structures
    if (chartType === "financial") {
      // For financial/profit-loss trends - prefer Italian aliases when provided
      return data
        .map((item, index) => {
          const revenue =
            item.revenue ??
            item.valore_produzione_operativa ??
            item.ricavi_vendite_prestazioni ??
            0;
          const netIncome = item.net_income ?? item.risultato_netto ?? 0;
          return {
            name: `Year ${item.year || index + 1}`,
            value: revenue,
            amount: revenue,
            // Keep netIncome in case a future dual-series export is added
            netIncome,
          } as any;
        })
        .filter((row: any) => (row.value || 0) !== 0 || (row.netIncome || 0) !== 0);
    }

    if (chartType === "operating_cost") {
      // For operating cost breakdown - show top cost categories
      if (data.length > 0) {
        const item = data[0]; // Use first year's data
        const costComponents = [
          { name: "COGS", value: item.cogs || 0 },
          { name: "Costi del personale", value: item.employee_costs || 0 },
          { name: "Marketing", value: item.marketing || 0 },
          { name: "Affitto", value: item.rent || 0 },
          { name: "Amministrazione", value: item.administration || 0 },
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
        // Support multiple possible input shapes
        const investedCap = item.invested_capital ?? item.total_invested_capital ?? item.net_invested_capital ?? item.sources_of_financing ?? 0;
        const equity = item.net_equity ?? item.total_equity ?? item.equity ?? 0;
        const liabilities = item.net_financial_debt ?? item.liabilities ?? 0;
        const assets = item.assets ?? investedCap;
        const chartData = [
          { name: "Attività", value: assets || 0 },
          { name: "Passività", value: liabilities || 0 },
          { name: "Patrimonio netto", value: Math.max(0, equity) || 0 },
        ];
        (chartData as any).originalData = chartData;
        return chartData;
      }
      return [];
    }

    if (chartType === "net_financial") {
      // For net financial position - show net position over years
      return data.map((item, index) => {
        // Try multiple possible field names for net financial position
        let netPosition = 0;

        // Check for common field names
        if (item.net_financial_position !== undefined) {
          netPosition = parseFloat(item.net_financial_position);
        } else if (item.netPosition !== undefined) {
          netPosition = parseFloat(item.netPosition);
        } else if (item.net_position !== undefined) {
          netPosition = parseFloat(item.net_position);
        } else if (item.value !== undefined) {
          netPosition = parseFloat(item.value);
        } else if (item.amount !== undefined) {
          netPosition = parseFloat(item.amount);
        } else {
          // If no specific field found, try to find any numeric field that could be net position
          const numericFields = Object.keys(item).filter(
            (key) =>
              typeof item[key] === "number" ||
              (!isNaN(parseFloat(item[key])) && isFinite(parseFloat(item[key])))
          );

          // Exclude year field and use the first numeric field found
          const nonYearFields = numericFields.filter(
            (key) =>
              key.toLowerCase() !== "year" &&
              key.toLowerCase() !== "id" &&
              key.toLowerCase() !== "index"
          );

          if (nonYearFields.length > 0) {
            netPosition = parseFloat(item[nonYearFields[0]]);
          }
        }

        return {
          name: `Year ${item.year || index + 1}`,
          value: netPosition,
          amount: netPosition,
        };
      });
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
    safeFinancialHighlights.length > 0
      ? await generateChartImage(
        "bar",
        convertDataForChart(safeFinancialHighlights, "financial"),
        "Grafico a barre punti salienti finanziari"
      )
      : "";

  const profitLossChart =
    safeProfitLossProjection.length > 0
      ? await generateChartImage(
        "line",
        convertDataForChart(safeProfitLossProjection, "financial"),
        "Grafico tendenza profitti e perdite"
      )
      : "";
  const netFinancialPositionChart =
    safeNetFinancialPosition.length > 0
      ? await generateChartImage(
        "line",
        convertDataForChart(safeNetFinancialPosition, "net_financial"),
        "Grafico posizione finanziaria netta"
      )
      : "";

  const balanceSheetChart =
    normalizedBalanceSheet.length > 0
      ? await generateChartImage(
        "pie",
        convertDataForChart(normalizedBalanceSheet, "balance_sheet"),
        "Grafico distribuzione stato patrimoniale"
      )
      : "";

  const keyRatiosChart =
    safeKeyRatios.length > 0
      ? await generateChartImage(
        "bar",
        convertDataForChart(safeKeyRatios),
        "Grafico a barre rapporti chiave"
      )
      : "";

  const operatingCostChart =
    safeOperatingCostBreakdown.length > 0
      ? await generateChartImage(
        "pie",
        convertDataForChart(safeOperatingCostBreakdown, "operating_cost"),
        "Grafico distribuzione costi operativi"
      )
      : "";

  // Helper function to check if a value is likely a year
  const isYear = (value: any): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 1900 && num <= 2100 && num === Math.floor(num);
  };

  // Helper function to format numbers for display
  const formatNumber = (value: any, columnName?: string): string => {
    if (!value || isNaN(parseFloat(value))) return "0";
    const num = parseFloat(value);

    // Don't add dollar sign to years or year-related columns
    if (
      isYear(value) ||
      (columnName && columnName.toLowerCase().includes("year"))
    ) {
      return num.toString();
    }

    return `€${num.toLocaleString()}`;
  };

  // Helper function to generate transposed table HTML (columns become rows, rows become columns)
  const generateTransposedTableHTML = (data: any[], title: string) => {
    if (!data || data.length === 0) return "";

    // const headers = Object.keys(data[0] || {});
    if (!data || data.length === 0) return "";

    // Find the first valid object in the array
    const firstValidItem = data.find(item => item && typeof item === 'object' && item !== null);

    if (!firstValidItem) return ""; // No valid objects found

    const headers = Object.keys(firstValidItem);

    // Create transposed structure: each original column becomes a row
    const transposedRows = headers.map((header) => {
      const row = [
        header.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      ];
      data.forEach((item) => {
        const cellValue = item[header];
        const formattedValue =
          typeof cellValue === "number" ||
            (!isNaN(parseFloat(cellValue)) && isFinite(parseFloat(cellValue)))
            ? formatNumber(cellValue, header)
            : String(cellValue || "");
        row.push(formattedValue);
      });
      return row;
    });

    // Generate table rows
    const tableRows = transposedRows
      .map(
        (row, rowIndex) =>
          `<tr>
            ${row
            .map((cell, cellIndex) => {
              const isHeader = cellIndex === 0;
              const cellStyle = isHeader
                ? "background-color: #f5f5f5; font-weight: bold; font-size: 12px; padding: 8px 6px; text-align: left; white-space: nowrap;"
                : "font-size: 11px; padding: 6px 4px; text-align: center; white-space: nowrap;";

              return isHeader
                ? `<th style="${cellStyle}">${cell}</th>`
                : `<td style="${cellStyle}">${cell}</td>`;
            })
            .join("")}
          </tr>`
      )
      .join("");

    // Create table with proper styling
    return `
      <div style="margin: 10px 0; page-break-inside: avoid;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #34495e;">${title}</h3>
        <div style="overflow-x: auto; max-width: 100%; page-break-inside: avoid;">
          <table border="1" cellpadding="4" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 11px; table-layout: auto;">
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  // FIXED: Financial Analysis table that fits perfectly in Word document (copied from Doc.tsx)
  const generateFinancialAnalysisSideBySideHTML = (
    data: any[],
    title: string
  ) => {
    if (!data || data.length === 0) return "";

    const headers = Object.keys(data[0] || {});
    const years = [...new Set(data.map((item) => item.year))].sort();
    const numYears = years.length;

    // Calculate optimal column widths for A4 page (fits ~6-8 columns comfortably)
    const metricWidth = "22%";
    const yearWidth = numYears <= 3 ? "19%" : numYears <= 4 ? "14.5%" : "11%";

    // Create table rows
    const tableRows = headers
      .map((header) => {
        const displayHeader = header
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())
          .replace(/\(.*?\)/g, "") // Remove parentheses for cleaner look
          .trim();

        const yearCells = years.map((year) => {
          const item = data.find((item) => item.year == year);
          const cellValue = item ? item[header] : "";
          const formattedValue =
            typeof cellValue === "number" ||
              (!isNaN(parseFloat(cellValue)) && isFinite(parseFloat(cellValue)))
              ? formatNumber(cellValue, header)
              : String(cellValue || "");

          // Abbreviate long numbers for better fit
          let displayValue = formattedValue;
          if (displayValue.length > 8) {
            displayValue = displayValue.replace(/,/g, "").slice(0, 8) + "...";
          }

          return `<td style="font-size: 9px; padding: 2px 1px; text-align: center; white-space: nowrap; border: 1px solid #333; width: ${yearWidth};">${displayValue}</td>`;
        });

        return `<tr>
          <th style="background-color: #f5f5f5; font-weight: bold; font-size: 9px; padding: 3px 2px; text-align: center; white-space: normal; word-wrap: break-word; border: 1px solid #333; width: ${metricWidth}; vertical-align: top;">${displayHeader}</th>
          ${yearCells.join("")}
        </tr>`;
      })
      .join("");

    // Year header row
    const yearHeaderRow = `<tr>
      <th style="background-color: #f5f5f5; font-weight: bold; font-size: 10px; padding: 4px 2px; text-align: center; border: 1px solid #333; width: ${metricWidth};">Metric</th>
      ${years
        .map(
          (year) =>
            `<th style="background-color: #f5f5f5; font-weight: bold; font-size: 10px; padding: 4px 2px; text-align: center; white-space: nowrap; border: 1px solid #333; width: ${yearWidth};">${year}</th>`
        )
        .join("")}
    </tr>`;

    return `
      <div style="margin: 15px 0; page-break-inside: avoid; width: 100%;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #34495e; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 3px;">${title}</h3>
        <div style="width: 100%; overflow: hidden; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 9px; table-layout: fixed; border: 2px solid #333;">
            <thead>
              ${yearHeaderRow}
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
        <div style="margin-top: 6px; padding: 4px; background-color: #f0f8ff; border-left: 3px solid #3498db; font-size: 9px; font-style: italic; text-align: center;">
          <strong>Comparative Financial Analysis - ${years.join(" | ")}</strong>
        </div>
      </div>
    `;
  };

  // Specialized function for Financial Analysis table - now using the side-by-side design
  const generateFinancialAnalysisTableHTML = (data: any[], title: string) => {
    // This will now redirect to the new side-by-side function
    return generateFinancialAnalysisSideBySideHTML(data, title);
  };

  // Helper function to generate table HTML with better column management
  const generateTableHTML = (data: any[], title: string) => {
    if (!data || !Array.isArray(data) || data.length === 0) return "";

    const headers = Object.keys(data[0] || {});
    const numColumns = headers.length;

    // Determine column widths based on number of columns
    let columnWidths: string[] = [];
    if (numColumns <= 4) {
      // For 4 or fewer columns - equal distribution
      columnWidths = headers.map(() => "20%");
    } else if (numColumns <= 6) {
      // For 5-6 columns - slightly smaller
      columnWidths = headers.map(() => "16.66%");
    } else {
      // For 7+ columns - even smaller, with first column wider for labels
      columnWidths = ["15%", ...Array(numColumns - 1).fill("10%")];
    }

    // Generate header row with proper widths
    const headerRow = headers
      .map(
        (header, index) =>
          `<th style="width: ${columnWidths[index]
          }; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: ${columnWidths[index]
          };">${header
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}</th>`
      )
      .join("");

    // Generate data rows with proper formatting and widths
    const tableRows = data
      .map(
        (row) =>
          `<tr>
          ${headers
            .map((header, index) => {
              const cellValue = row[header];
              const formattedValue =
                typeof cellValue === "number" ||
                  (!isNaN(parseFloat(cellValue)) &&
                    isFinite(parseFloat(cellValue)))
                  ? formatNumber(cellValue, header)
                  : String(cellValue || "");

              return `<td style="width: ${columnWidths[index]}; font-size: 11px; padding: 6px 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: ${columnWidths[index]};">${formattedValue}</td>`;
            })
            .join("")}
        </tr>`
      )
      .join("");

    // Create table with proper styling
    return `
      <div style="margin: 10px 0; page-break-inside: avoid;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #34495e;">${title}</h3>
        <div style="overflow-x: auto; max-width: 100%; page-break-inside: avoid;">
          <table border="1" cellpadding="4" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 11px; min-width: 600px; table-layout: fixed;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                ${headerRow}
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
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
          margin: 20px;
          color: #333;
          /* Ensure normal page flow */
        }
        h1 {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 15px;
          font-size: 24px;
          page-break-after: avoid;
        }
        h2 {
          color: #34495e;
          margin-top: 30px;
          margin-bottom: 15px;
          font-size: 18px;
          border-bottom: 2px solid #3498db;
          padding-bottom: 5px;
          page-break-after: avoid;
          page-break-inside: avoid;
        }
        h3 {
          color: #34495e;
          margin-top: 15px;
          margin-bottom: 8px;
          font-size: 16px;
          page-break-after: avoid;
        }
        p {
          margin-bottom: 10px;
          text-align: justify;
          /* Allow paragraphs to flow naturally */
          page-break-inside: auto;
          orphans: 3;
          widows: 3;
        }
        .section {
          margin-bottom: 20px;
          page-break-inside: auto;
        }
        .executive-summary {
          /* First section - no page break before */
          page-break-before: avoid;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          page-break-after: avoid;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        /* Improved table styling */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
          page-break-inside: auto;
          page-break-before: auto;
          table-layout: fixed;
          font-family: 'Times New Roman', serif;
          font-size: 11px;
          min-width: 600px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 6px 4px;
          text-align: left;
          vertical-align: top;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: break-word;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
          font-size: 12px;
        }
        /* Responsive table wrapper */
        .table-container {
          overflow-x: auto;
          max-width: 100%;
          margin: 15px 0;
          page-break-inside: avoid;
          -webkit-overflow-scrolling: touch;
        }
        ul {
          margin: 8px 0;
          padding-left: 20px;
          page-break-inside: auto;
        }
        li {
          margin-bottom: 5px;
          page-break-inside: avoid;
        }
        .chart-note {
          background-color: #f9f9f9;
          border-left: 4px solid #3498db;
          padding: 8px;
          margin: 10px 0;
          font-style: italic;
          page-break-inside: avoid;
        }
        img {
          max-width: 100%;
          height: auto;
          border: 2px solid #2c3e50;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          page-break-inside: avoid;
          margin: 15px 0;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        /* Better page break control */
        .section-content {
          page-break-inside: auto;
          margin-bottom: 15px;
           text-align: justify;
        }
        .section-title {
          page-break-after: avoid;
          margin-bottom: 10px;
        }
        @page {
          size: A4;
          margin: 0.75in;
          /* Better control over page breaks */
        }
        @media print {
          body {
            margin: 0;
            padding: 0.75in;
          }
          /* More precise page break control */
          h2 {
            page-break-after: avoid;
            margin-top: 20px;
          }
          .section {
            page-break-before: auto;
            page-break-inside: auto;
          }
          .executive-summary {
            page-break-before: avoid;
          }
          h1, h3 {
            page-break-after: avoid;
          }
          p, ul, ol, li, .chart-note {
            page-break-inside: auto;
            orphans: 3;
            widows: 3;
          }
          table {
            page-break-inside: auto;
            page-break-before: auto;
            width: 100% !important;
            table-layout: fixed !important;
            font-size: 10px !important;
          }
          th, td {
            font-size: 10px !important;
            padding: 4px 2px !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow: visible !important;
          }
          .table-container {
            overflow: visible !important;
            width: 100% !important;
          }
          tr {
            page-break-inside: avoid;
          }
          img {
            page-break-inside: avoid;
            page-break-before: avoid;
            page-break-after: avoid;
          }
          /* Ensure content doesn't break awkwardly */
          .section-content p:last-child {
            margin-bottom: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Piano aziendale</h1>
        <p>Generato il: ${new Date().toLocaleDateString()}</p>
      </div>

      <!-- Index Section -->
      <div class="section" style="page-break-inside: avoid;">
        <div class="section-title">
          <h2>Indice</h2>
        </div>
        <div class="section-content">
          <div style="margin: 20px 0; font-size: 14px; line-height: 1.8;">
            <p style="margin: 10px 0;"><strong>Sommario</strong></p>
            <p style="margin: 10px 0;">1. Sintesi esecutiva</p>
            <p style="margin: 10px 0;">2. Panoramica aziendale</p>
            <p style="margin: 10px 0;">3. Team di gestione</p>
            <p style="margin: 10px 0;">4. Modello di business</p>
            <p style="margin: 10px 0;">5. Analisi di mercato</p>
            <p style="margin: 10px 0;">6. Fonti di finanziamento</p>
            <p style="margin: 10px 0;">7. Conto economico a valore aggiunto</p>
            <p style="margin: 10px 0;">9. Stato Patrimoniale</p>
            <p style="margin: 10px 0;">10. Posizione finanziaria netta</p>
            <p style="margin: 10px 0;">11. Struttura del debito</p>
            <p style="margin: 10px 0;">13. Analisi rapporti</p>
          </div>
        </div>
      </div>

      <!-- Disclaimer Section -->
      <div class="section" >
        <div class="section-title">
          <h2>Disclaimer</h2>
        </div>
        <div class="section-content">
            La presente relazione contiene dichiarazioni previsionali ("forward-looking statements"). Queste dichiarazioni sono basate sulle attuali aspettative e proiezioni della Società relativamente ad eventi futuri e, per loro natura, sono soggette ad una componente intrinseca di rischiosità ed incertezza. Sono dichiarazioni che si riferiscono ad eventi e dipendono da circostanze che possono, o non possono, accadere o verificarsi in futuro e, come tali, non si deve fare un indebito affidamento su di esse.
          
            I risultati effettivi potrebbero differire significativamente da quelli contenuti in dette dichiarazioni a causa di una molteplicità di fattori, incluse la volatilità e il deterioramento dei mercati del capitale e finanziari, variazioni nei prezzi di materie prime, cambi nelle condizioni macroeconomiche e nella crescita economica ed altre variazioni delle condizioni di business, mutamenti della normativa e del contesto istituzionale (sia in Italia che all'estero), e molti altri fattori, la maggioranza dei quali è al di fuori del controllo della Società.
          
        </div>
      </div>

      <!-- Executive Summary - First page, no page break before -->
      <div class="section executive-summary">
        <div class="section-title">
          <h2>1. Sintesi esecutiva</h2>
        </div>
        <div class="section-content">
          <p>${executiveSummary.replace(/\n/g, "</p><p>")}</p>
        </div>
      </div>
      
      <!-- Business Overview - New page -->
      <div class="section">
        <div class="section-title">
          <h2>2. Panoramica aziendale</h2>
        </div>
        <div class="section-content">
          <p>${businessOverview.replace(/\n/g, "</p><p>")}</p>
        </div>
      </div>

       ${managementTeam
      ? `
      <div class="section">
        <div class="section-title">
          <h2>3. Team di gestione</h2>
        </div>
        <div class="section-content">
          <p>${managementTeam.replace(/\n/g, "</p><p>")}</p>
        </div>
      </div>
      `
      : ""
    }

        ${businessModel
      ? `
      <div class="section">
        <div class="section-title">
          <h2>4. Modello di business</h2>
        </div>
        <div class="section-content">
          <p>${businessModel.replace(/\n/g, "</p><p>")}</p>
        </div>
      </div>
      `
      : ""
    }


      <!-- Market Analysis - New page -->
      <div class="section">
        <div class="section-title">
          <h2>5. Analisi di mercato</h2>
        </div>
        <div class="section-content">
          <p>${marketAnalysis.replace(/\n/g, "</p><p>")}</p>
        </div>
      </div>

      ${fundingSources
      ? `
      <div class="section">
        <div class="section-title">
          <h2>6. Fonti di finanziamento</h2>
        </div>
        <div class="section-content">
          <p>${typeof fundingSources === "string"
        ? fundingSources.replace(/\n/g, "</p><p>")
        : typeof fundingSources === "object" && fundingSources !== null
          ? Object.entries(fundingSources)
            .map(
              ([key, value]) =>
                `${key
                  .replace(/\n/g, " ")
                  .replace(/^./, (str) => str.toUpperCase())}: ${typeof value === "number"
                    ? `€${value.toLocaleString()}`
                    : value
                }`
            )
            .join(", ")
          : "No funding information available"
      }</p>
        </div>
      </div>
      `
      : ""
    }

      ${safeProductionSalesForecast.length > 0
      ? `
      <div class="section">
        <div class="section-title">
          <h2>7. Previsione vendite produzione</h2>
        </div>
        <div class="section-content">
          ${generateTableHTML(
        safeProductionSalesForecast,
        "Tabella previsione vendite produzione"
      )}
        </div>
      </div>
      `
      : ""
    }

       ${safeOperatingCostBreakdown.length > 0
      ? `
      <div class="section">
        <div class="section-title">
          <h2>7.1 Ripartizione costi operativi</h2>
        </div>
        <div class="section-content">
          ${generateTransposedTableHTML(
        safeOperatingCostBreakdown,
        "Tabella ripartizione costi operativi 7.2"
      )}
          ${operatingCostChart
        ? `
            <div style="text-align: center;">
              <img src="${operatingCostChart}" alt="Grafico distribuzione costi operativi" />
            </div>
          `
        : ""
      }
          <div class="chart-note">
            <strong>Nota:</strong> Questa sezione include grafici a ciambella che mostrano la distribuzione dei costi tra diverse categorie.
          </div>
        </div>
      </div>
      `
      : ""
    }

        ${marketingSalesStrategy
      ? `
      <div class="section">
        <div class="section-title">
          <h2>8. Strategia marketing e vendite</h2>
        </div>
        <div class="section-content">
          <p>${marketingSalesStrategy.replace(/\n/g, "</p><p>")}</p>
        </div>
      </div>
      `
      : ""
    }


        ${normalizedBalanceSheet.length > 0
      ? `
          <div class="section">
            <div class="section-title">
              <h2>9. Stato patrimoniale</h2>
            </div>
            <div class="section-content">
              ${generateTransposedTableHTML(
        normalizedBalanceSheet,
        "Tabella stato patrimoniale"
      )}
              ${balanceSheetAnalysis && balanceSheetAnalysis.trim().length > 0
        ? `
                <div style="margin-top: 16px; padding: 12px; background: #f8f9fa; border-left: 4px solid #3498db;">
                  <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #2c3e50;">Analisi dello stato patrimoniale</h3>
                  <div style="font-size: 12px; color: #333; text-align: justify;">${balanceSheetAnalysis
                    .split('\n')
                    .map(p => `<p style="margin: 6px 0;">${p}</p>`) 
                    .join('')}</div>
                </div>
              `
        : ""
      }
            </div>
          </div>
          `
      : ""
    }
  


    

    ${safeNetFinancialPosition.length > 0
      ? `
      <div class="section">
        <div class="section-title">
          <h2>10. Posizione finanziaria netta</h2>
        </div>
        <div class="section-content">
          ${generateTableHTML(
        safeNetFinancialPosition,
        "Tabella posizione finanziaria netta"
      )}
          ${netFinancialPositionChart
        ? `
            <div style="text-align: center;">
              <img src="${netFinancialPositionChart}" alt="Grafico posizione finanziaria netta" />
            </div>
          `
        : ""
      }
          <div class="chart-note">
            <strong>Nota:</strong> Questa sezione include grafici a linee che mostrano le tendenze della posizione finanziaria netta nel tempo.
          </div>
        </div>
      </div>
      `
      : ""
    }  
    ${safeDebtStructure.length > 0
      ? `
      <div class="section">
        <div class="section-title">
          <h2>11. Struttura del debito</h2>
        </div>
        <div class="section-content">
          ${generateTableHTML(safeDebtStructure, "Tabella struttura debito")}
        </div>
      </div>
      `
      : ""
    }  



        
       ${safeCashFlowAnalysis.length > 0
      ? `
      <div class="section">
        <div class="section-title">
          <h2>14. Analisi del flusso di cassa</h2>
        </div>
        <div class="section-content">
          ${generateTableHTML(
        safeCashFlowAnalysis,
        "Tabella analisi flusso di cassa"
      )}
        </div>
      </div>
      `
      : ""
    }

      ${safeRatiosAnalysis.length > 0
      ? `
      <div class="section">
        <div class="section-title">
          <h2>13. Analisi rapporti</h2>
        </div>
        <div class="section-content">
          ${generateTransposedTableHTML(
        safeRatiosAnalysis,
        "Tabella analisi rapporti"
      )}
        </div>
      </div>
      `
      : ""
    }

   
      
      

      

      <div class="footer">
        <p>Questo documento è stato generato da BusinessPlanAI</p>
        <p>© ${new Date().getFullYear()} Tutti i diritti riservati</p>
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
};

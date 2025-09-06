"use client";

interface DocDownloadProps {
  executiveSummary: string;
  businessOverview: string;
  marketAnalysis: string;
  businessModel?: string;
  marketingSalesStrategy?: string;
  sectorStrategy?: string;
  fundingSources?: string;
  operationsPlan?: string;
  financialHighlights?: any[];
  cashFlowAnalysis?: any[];
  profitLossProjection?: any[];
  balanceSheet?: any[];
  netFinancialPosition?: any[];
  debtStructure?: any[];
  keyRatios?: any[];
  operatingCostBreakdown?: any[];
}

export const generateWordDocument = ({
  executiveSummary,
  businessOverview,
  marketAnalysis,
  businessModel = "",
  marketingSalesStrategy = "",
  sectorStrategy = "",
  fundingSources = "",
  operationsPlan = "",
  financialHighlights = [],
  cashFlowAnalysis = [],
  profitLossProjection = [],
  balanceSheet = [],
  netFinancialPosition = [],
  debtStructure = [],
  keyRatios = [],
  operatingCostBreakdown = [],
}: DocDownloadProps) => {
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
        financialHighlights.length > 0
          ? `
      <div class="section">
        <h2>Financial Highlights</h2>
        ${generateTableHTML(financialHighlights, "Financial Highlights Table")}
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
        <div class="chart-note">
          <strong>Note:</strong> This section includes donut charts showing cost distribution across different categories.
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
};

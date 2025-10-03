import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  let browser = null;

  try {
    const { html, options } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    // Environment-specific configuration
    const isProduction = process.env.NODE_ENV === "production";
    const isVercel = process.env.VERCEL === "1";
    const isNetlify = process.env.NETLIFY === "true";
    
    console.log("Environment info:", {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      NETLIFY: process.env.NETLIFY,
      PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
    });

    // Enhanced puppeteer launch configuration for different deployment platforms
    const baseArgs = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ];

    const productionArgs = [
      "--disable-web-security",
      "--disable-features=VizDisplayCompositor",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-ipc-flooding-protection",
      "--single-process",
      "--memory-pressure-off",
      "--max-old-space-size=512",
      "--disable-extensions",
      "--disable-plugins",
      "--disable-default-apps",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-sync",
      "--disable-translate",
      "--hide-scrollbars",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-default-browser-check",
      "--no-pings",
      "--password-store=basic",
      "--use-mock-keychain",
      "--disable-component-extensions-with-background-pages",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ];

    const launchOptions = {
      headless: true,
      args: isProduction ? [...baseArgs, ...productionArgs] : baseArgs,
      timeout: isProduction ? 60000 : 30000,
      protocolTimeout: isProduction ? 60000 : 30000,
      ...(isProduction && {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 
          (isVercel ? "/usr/bin/google-chrome-stable" : 
           isNetlify ? "/usr/bin/chromium-browser" : undefined),
      }),
    };

    // Try to launch puppeteer with multiple fallback strategies
    const fallbackConfigs = [
      // Primary configuration
      launchOptions,
      // Fallback 1: Minimal configuration
      {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
        timeout: 15000,
      },
      // Fallback 2: Ultra minimal configuration
      {
        headless: true,
        args: ["--no-sandbox"],
        timeout: 10000,
      },
      // Fallback 3: Try with different executable paths
      ...(isProduction ? [
        {
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          executablePath: "/usr/bin/google-chrome",
          timeout: 10000,
        },
        {
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          executablePath: "/usr/bin/chromium",
          timeout: 10000,
        },
        {
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          executablePath: "/usr/bin/chromium-browser",
          timeout: 10000,
        }
      ] : [])
    ];

    let lastError = null;
    
    for (let i = 0; i < fallbackConfigs.length; i++) {
      try {
        console.log(`Attempting Puppeteer launch with config ${i + 1}/${fallbackConfigs.length}`);
        browser = await puppeteer.launch(fallbackConfigs[i]);
        console.log(`Successfully launched Puppeteer with config ${i + 1}`);
        break;
      } catch (launchError) {
        lastError = launchError;
        console.error(`Puppeteer launch attempt ${i + 1} failed:`, launchError instanceof Error ? launchError.message : String(launchError));
        
        // If this is the last attempt and we're in production, return fallback
        if (i === fallbackConfigs.length - 1 && isProduction) {
          console.log("All Puppeteer launch attempts failed, returning client-side fallback");
          return NextResponse.json(
            {
              error: "Server-side PDF generation unavailable",
              fallback: "client-side",
              html: html,
              message: "Server cannot generate PDF. Please use browser print function (Ctrl+P) to save as PDF.",
            attempts: fallbackConfigs.length,
            lastError: launchError instanceof Error ? launchError.message : String(launchError),
            },
            { status: 503 }
          );
        }
      }
    }

    // If we're here and browser is still null, throw the last error
    if (!browser) {
      throw lastError || new Error("Failed to launch Puppeteer after all attempts");
    }

    const page = await browser.newPage();

    // Set viewport to ensure consistent rendering
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2,
    });

    // Enhanced CSS for better PDF formatting
    const enhancedCSS = `
      <style>
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white !important;
          }
          
          @page {
            size: A4;
            margin: 20mm 20mm 30mm 20mm;
            @bottom-center {
              content: counter(page) " / " counter(pages);
              font-size: 10px;
              color: #666;
              margin-top: 10mm;
            }
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .page-break-after {
            page-break-after: always;
          }
          
          .no-page-break {
            page-break-inside: avoid;
          }
          
          /* Ensure images and charts don't break across pages */
          img, canvas, svg, .chart-container {
            page-break-inside: avoid;
            max-width: 100%;
            height: auto;
          }
          
          /* Specific chart container protection */
          .pdf-chart-container {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 2rem;
            min-height: 400px;
          }
          
          /* Ensure chart containers have enough space */
          .pdf-chart-container .h-80 {
            height: 320px !important;
            min-height: 320px !important;
          }
          
          /* ResponsiveContainer and Recharts protection */
          .recharts-wrapper,
          .recharts-responsive-container {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Line chart and chart elements protection */
          .recharts-line-chart,
          .recharts-bar-chart,
          .recharts-pie-chart {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Table formatting */
          table {
            page-break-inside: avoid;
            border-collapse: collapse;
            width: 100%;
          }
          
          tr {
            page-break-inside: avoid;
          }
          
          /* Heading formatting */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
          }
          
          /* Prevent orphans and widows */
          p {
            orphans: 3;
            widows: 3;
          }
        }
      </style>
    `;

    // Combine enhanced CSS with provided HTML
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated PDF</title>
        ${enhancedCSS}
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    // Set content and wait for everything to load with better error handling
    try {
      await page.setContent(fullHTML, {
        waitUntil: isProduction
          ? ["domcontentloaded"]
          : ["networkidle0", "domcontentloaded"],
        timeout: isProduction ? 20000 : 30000,
      });
    } catch (contentError) {
      console.warn("Content loading timeout, proceeding anyway:", contentError);
    }

    // Wait for any dynamic content or charts to render
    const renderWaitTime = isProduction ? 2000 : 3000;
    await new Promise((resolve) => setTimeout(resolve, renderWaitTime));

    // Additional wait for charts to fully render with production-optimized timeout
    try {
      await page.waitForFunction(
        () => {
          const charts = document.querySelectorAll(
            ".recharts-wrapper, .recharts-responsive-container"
          );
          return (
            charts.length === 0 ||
            Array.from(charts).every(
              (chart) => chart.querySelector("svg") !== null
            )
          );
        },
        { timeout: isProduction ? 3000 : 5000 }
      );
    } catch (chartError) {
      console.warn("Chart rendering timeout, proceeding anyway:", chartError);
    }

    // Generate PDF with optimized settings
    const pdfOptions = {
      format: "A4" as const,
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      ...options,
    };

    const pdf = await page.pdf(pdfOptions);

    // Close browser safely
    if (browser) {
      await browser.close();
    }

    // Return PDF as response
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="generated-report.pdf"',
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    
    // Enhanced error logging for production debugging
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      nodeEnv: process.env.NODE_ENV,
      puppeteerPath: process.env.PUPPETEER_EXECUTABLE_PATH,
      timestamp: new Date().toISOString(),
    };
    
    console.error("Detailed error information:", JSON.stringify(errorDetails, null, 2));

    // Ensure browser is closed even on error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

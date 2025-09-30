import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { html, options } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    // Launch puppeteer with optimized settings
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // Set viewport to ensure consistent rendering
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2
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

    // Set content and wait for everything to load
    await page.setContent(fullHTML, {
      waitUntil: ['networkidle0', 'domcontentloaded']
    });

    // Wait for any dynamic content or charts to render
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Additional wait for charts to fully render
    await page.waitForFunction(() => {
      const charts = document.querySelectorAll('.recharts-wrapper, .recharts-responsive-container');
      return charts.length === 0 || Array.from(charts).every(chart => 
        chart.querySelector('svg') !== null
      );
    }, { timeout: 5000 }).catch(() => {
      // Continue if charts don't load within timeout
    });

    // Generate PDF with optimized settings
    const pdfOptions = {
      format: 'A4' as const,
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      ...options
    };

    const pdf = await page.pdf(pdfOptions);

    await browser.close();

    // Return PDF as response
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="generated-report.pdf"',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

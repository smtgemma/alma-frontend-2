
// Removed html2canvas and jsPDF imports - now using Puppeteer API

// Show loading indicator
const showLoadingIndicator = () => {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "pdf-loading-indicator";
  loadingDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      color: white;
      font-family: Arial, sans-serif;
    ">
      <div style="
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        color: black;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      ">
        <div style="
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        "></div>
        <div style="font-size: 16px; font-weight: 500;">PDF is generating...</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">Please wait a moment</div>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  document.body.appendChild(loadingDiv);
  return loadingDiv;
};

// Hide loading indicator
const hideLoadingIndicator = () => {
  const loadingDiv = document.getElementById("pdf-loading-indicator");
  if (loadingDiv) {
    document.body.removeChild(loadingDiv);
  }
};

export const generateEmpathyPDF = async (elementToPrintId: string) => {
  const loadingIndicator = showLoadingIndicator();

  try {
    // First, try to close any open modals by clicking close buttons or pressing escape
    const closeButtons = document.querySelectorAll(
      'button[aria-label*="close"], button[title*="close"], .modal button:last-child'
    );
    closeButtons.forEach((button) => {
      if (button instanceof HTMLElement) {
        button.click();
      }
    });

    // Also try pressing escape to close modals
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    // Wait a moment for modals to close and DOM to update
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Wait for any React components to fully render
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const originalElement = document.getElementById(elementToPrintId);
    if (!originalElement) {
      throw new Error(`Element with id ${elementToPrintId} not found`);
    }

    // Clone the element to avoid modifying the original
    const clonedElement = originalElement.cloneNode(true) as HTMLElement;

    // Remove any modal, overlay, or popup elements from the cloned content
    const elementsToRemove = clonedElement.querySelectorAll(
      [
        '[role="dialog"]',
        '[role="modal"]',
        ".modal",
        ".popup",
        ".overlay",
        ".dropdown-menu",
        ".tooltip",
        "[data-modal]",
        '[id*="modal"]',
        '[class*="modal"]',
        '[class*="popup"]',
        '[class*="overlay"]',
        '[class*="dropdown"]',
        ".fixed.inset-0", // Tailwind modal backdrop
        ".fixed.z-50", // High z-index overlays
        ".absolute.inset-0", // Full screen overlays
        ".fixed.bottom-8", // Floating action buttons
        'button[aria-label*="Download"]', // Download buttons
        'button[aria-label*="Share"]', // Share buttons
        'button[aria-label*="Edit"]', // Edit buttons
      ].join(",")
    );

    elementsToRemove.forEach((element) => element.remove());

    // Remove Expert's Review section from PDF
    const allElements = Array.from(clonedElement.querySelectorAll("*"));
    allElements.forEach((element) => {
      const textContent = element.textContent || "";
      
      // Check if this element contains Expert's Review content (multiple variations)
      if (
        textContent.includes("Expert's Review") ||
        textContent.includes("Revisione dell'Esperto") ||
        textContent.includes("Reviewed by industry professionals") ||
        textContent.includes("Revisionato da professionisti del settore") ||
        textContent.includes("Richiesta Inviata") ||
        (textContent.includes("Richiesta") && textContent.includes("Inviata"))
      ) {
        // This is likely the Expert's Review section container
        element.remove();
      }

      // Remove congratulations message from main content (multiple variations)
      if (
        (textContent.includes("Congratulations! Your Business Plan Is Ready!") ||
         textContent.includes("Congratulazioni! Il Tuo Piano Aziendale È Pronto!") ||
         textContent.includes("Il Tuo Piano Aziendale È Pronto")) &&
        !element.closest(".section-title")
      ) {
        // This is likely the congratulations message in main content
        element.remove();
      }

      // Remove any section that contains both congratulations and expert review content
      if (
        (textContent.includes("Congratulazioni") || textContent.includes("Congratulations")) &&
        (textContent.includes("Revisione") || textContent.includes("Review") || textContent.includes("Richiesta"))
      ) {
        element.remove();
      }

      // Add classes to keep Profit Loss Projection content together
      if (
        textContent.includes("Profit Loss Projection") &&
        element.tagName === "H2"
      ) {
        // Add class to prevent page break after the heading
        element.classList.add("profit-loss-projection-break");

        // Find the container that includes both graph and table
        let container = element.parentElement;
        while (container && container !== clonedElement) {
          // Look for a container that likely contains both chart and table
          const containerContent = container.textContent || "";
          if (
            containerContent.includes("Profit Loss Projection") &&
            (containerContent.includes("Revenue") ||
              containerContent.includes("Net Income"))
          ) {
            container.classList.add("profit-loss-projection-section");
            break;
          }
          container = container.parentElement;
        }

        // Also add class to immediate parent
        if (element.parentElement) {
          element.parentElement.classList.add("profit-loss-section");
        }
      }

      // Handle Financial Highlights chart specifically for PDF
      if (
        textContent.includes("FinancialHighlights") &&
        textContent.includes("Yearly")
      ) {
        // Find recharts wrapper and ensure it has proper width for PDF
        const rechartsWrapper = element.querySelector(".recharts-wrapper");
        if (rechartsWrapper) {
          (rechartsWrapper as HTMLElement).style.minWidth = "800px";
          (rechartsWrapper as HTMLElement).style.width = "800px";
        }

        // Also ensure the parent container allows overflow
        if (element.parentElement) {
          element.parentElement.style.overflowX = "visible";
          element.parentElement.style.minWidth = "850px";
        }
      }

      // Handle Financial Analysis table specifically for PDF
      if (
        textContent.includes("Financial Analysis") &&
        element.tagName === "H2"
      ) {
        // Find the next sibling div that contains the table
        let nextSibling = element.nextElementSibling;
        if (nextSibling && nextSibling.tagName === "DIV") {
          nextSibling.classList.add("financial-analysis-pdf-table");
        }
      }

      // Handle Ratios Analysis table specifically for PDF
      if (textContent.includes("Ratios Analysis") && element.tagName === "H2") {
        // Find the next sibling div that contains the table
        let nextSibling = element.nextElementSibling;
        if (nextSibling && nextSibling.tagName === "DIV") {
          nextSibling.classList.add("ratios-analysis-pdf-table");
        }
      }
    });

    // Also remove any elements that are positioned fixed or have high z-index
    // But be more careful to not remove important content
    const fixedElements = clonedElement.querySelectorAll("*");
    fixedElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element as Element);
      const isModal = element.matches(
        '[role="dialog"], [role="modal"], .modal, .popup, .overlay, .fixed.inset-0, .fixed.z-50'
      );
      const isFloatingButton = element.matches(
        '.fixed.bottom-8, button[aria-label*="Download"], button[aria-label*="Share"], button[aria-label*="Edit"]'
      );

      // Only remove if it's actually a modal/overlay/floating element, not just any fixed element
      if (
        (computedStyle.position === "fixed" && (isModal || isFloatingButton)) ||
        (parseInt(computedStyle.zIndex) > 40 && (isModal || isFloatingButton))
      ) {
        element.remove();
      }
    });

    // Get the cleaned HTML content
    const htmlContent = clonedElement.outerHTML;

    // Get all stylesheets to include in the PDF
    const stylesheets = Array.from(document.styleSheets)
      .map((stylesheet) => {
        try {
          return Array.from(stylesheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          // Handle CORS issues with external stylesheets
          return "";
        }
      })
      .join("\n");

    // Create complete HTML with styles
    const completeHTML = `
      <style>
        ${stylesheets}
        
        /* Additional styles for better PDF formatting */
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 10px 5px;
          background: white !important;
        }
        
        /* Hide any remaining modal/popup/overlay elements */
        [role="dialog"],
        [role="modal"],
        .modal,
        .popup,
        .overlay,
        .dropdown-menu,
        .tooltip,
        [data-modal],
        [id*="modal"],
        [class*="modal"],
        [class*="popup"],
        [class*="overlay"],
        [class*="dropdown"],
        .fixed.inset-0,
        .fixed.z-50,
        .absolute.inset-0,
        .fixed.bottom-8,
        button[aria-label*="Download"],
        button[aria-label*="Share"],
        button[aria-label*="Edit"],
        .backdrop-blur-sm,
        .bg-black\/20 {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* Hide any element with high z-index or fixed positioning */
        *[style*="position: fixed"],
        *[style*="z-index: 50"],
        *[style*="z-index: 100"],
        *[style*="z-index: 999"],
        *[style*="z-index: 9999"] {
          display: none !important;
        }
        
        /* Ensure proper page breaks for sections */
        .section-break {
          page-break-before: always;
        }
        
        /* Keep related content together */
        .no-break {
          page-break-inside: avoid;
        }
        
        /* Keep Profit Loss Projection graph and table together */
        .profit-loss-projection-section {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Optional page break before Profit Loss Projection only if needed */
        .profit-loss-projection-break {
          page-break-before: auto !important;
          break-before: auto !important;
        }
        
        /* Target elements with purple background (profit loss projection heading) */
        *[style*="background-color: rgb(167, 139, 250)"],
        *[style*="background-color: #A78BFA"],
        .bg-\\[\\#A78BFA\\],
        .bg-purple-400,
        h2.bg-\\[\\#A78BFA\\] {
          page-break-before: auto !important;
          break-before: auto !important;
          page-break-after: avoid !important;
          break-after: avoid !important;
        }
        
        /* Keep profit loss projection content together */
        .profit-loss-section {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-before: auto !important;
          break-before: auto !important;
        }
        
        /* Style tables for PDF */
        table {
          page-break-inside: avoid;
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 1em;
        }
        
        /* Keep profit loss projection tables with their content */
        .profit-loss-section table,
        .profit-loss-projection-section table {
          page-break-before: avoid !important;
          break-before: avoid !important;
          margin-top: 0 !important;
        }
        
        /* Style images and charts */
        img, canvas, svg {
          max-width: 100%;
          height: auto;
          page-break-inside: avoid;
        }
        
        /* Keep chart containers together with their content */
        .recharts-wrapper,
        .recharts-surface,
        [class*="recharts"] {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-before: avoid !important;
          break-before: avoid !important;
        }
        
        /* Fix pie chart text positioning issues in PDF */
        .recharts-wrapper {
          padding: 40px 20px !important;
          margin: 20px 0 !important;
        }
        
        .recharts-wrapper svg {
          overflow: visible !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        /* Force pie chart labels to stay within chart boundaries */
        .recharts-pie-label-text {
          font-size: 11px !important;
          transform: translateY(0px) !important;
        }
        
        /* Ensure pie chart containers have enough space */
        .relative.w-96.h-96 {
          width: 450px !important;
          height: 450px !important;
          padding: 30px !important;
          margin: 20px auto !important;
        }
        
        /* Fix Balance Sheet and Operating Cost Breakdown charts specifically */
        .flex.justify-center.items-start.gap-8 {
          padding: 30px 20px !important;
          margin: 40px 0 !important;
        }
        
        /* Prevent text overflow on pie charts */
        .recharts-pie .recharts-text {
          font-size: 11px !important;
          font-weight: bold !important;
        }
        
        /* Specific fixes for pie chart label positioning */
        .recharts-pie-label-text,
        .recharts-text.recharts-pie-label-text {
          font-size: 10px !important;
          font-weight: 600 !important;
          fill: white !important;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8) !important;
        }
        
        /* Force all pie chart elements to stay within container */
        .recharts-pie-sector {
          transform-origin: center !important;
        }
        
        /* Override any absolute positioning that causes text to float */
        .recharts-layer.recharts-pie-labels text {
          position: relative !important;
          transform: none !important;
        }
        
        /* Force pie chart SVG to have proper viewBox and prevent text overflow */
        .recharts-surface {
          overflow: hidden !important;
        }
        
        /* Balance Sheet and Operating Cost Breakdown specific fixes */
        h2:contains("Balance Sheet") + div .recharts-wrapper,
        h2:contains("Operating Cost Breakdown") + div .recharts-wrapper {
          padding: 50px !important;
          margin: 30px auto !important;
        }
        
        /* Hide any text elements that are positioned outside the chart area */
        .recharts-wrapper text[x][y] {
          visibility: visible !important;
        }
        
        /* Ensure all chart text stays within the SVG bounds */
        .recharts-wrapper svg text {
          max-width: 100% !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        
        /* Ensure Financial Highlights chart shows all years in PDF */
        .bg-gray-50.rounded-lg.p-6 .recharts-wrapper {
          min-width: 800px !important;
          width: 800px !important;
        }
        
        /* Financial Highlights chart container specific styles for PDF */
        .bg-gray-50.rounded-lg.p-6:has(.recharts-wrapper) {
          overflow-x: visible !important;
          min-width: 850px !important;
        }
        
        /* Fix Financial Analysis and Ratio Analysis table overflow issues */
        .financial-analysis-pdf-table,
        .ratios-analysis-pdf-table {
          overflow-x: visible !important;
          width: 100% !important;
        }
        
        /* Financial Analysis and Ratio Analysis table specific styles */
        .financial-analysis-pdf-table .overflow-x-auto,
        .ratios-analysis-pdf-table .overflow-x-auto {
          overflow-x: visible !important;
          width: 100% !important;
        }
        
        /* Make Financial Analysis and Ratio Analysis tables responsive in PDF */
        .financial-analysis-pdf-table table,
        .ratios-analysis-pdf-table table {
          width: 100% !important;
          table-layout: fixed !important;
          font-size: 8px !important;
          border-collapse: collapse !important;
        }
        
        /* Adjust cell padding and text size for better fit */
        .financial-analysis-pdf-table table th,
        .financial-analysis-pdf-table table td,
        .ratios-analysis-pdf-table table th,
        .ratios-analysis-pdf-table table td {
          padding: 2px 4px !important;
          font-size: 7px !important;
          white-space: nowrap !important;
          text-overflow: ellipsis !important;
          width: auto !important;
          overflow: hidden !important;
          vertical-align: middle !important;
        }
        
        /* Make first column (metrics) wider for readability */
        .financial-analysis-pdf-table table td:first-child,
        .financial-analysis-pdf-table table th:first-child,
        .ratios-analysis-pdf-table table td:first-child,
        .ratios-analysis-pdf-table table th:first-child {
          width: 25% !important;
          min-width: 100px !important;
          font-size: 7px !important;
          font-weight: 500 !important;
        }
        
        /* Data columns should be equal width */
        .financial-analysis-pdf-table table td:not(:first-child),
        .financial-analysis-pdf-table table th:not(:first-child),
        .ratios-analysis-pdf-table table td:not(:first-child),
        .ratios-analysis-pdf-table table th:not(:first-child) {
          width: auto !important;
          text-align: center !important;
        }
        
        /* Ensure the table containers don't break page layout */
        .financial-analysis-pdf-table,
        .ratios-analysis-pdf-table {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Ensure grid layouts are properly displayed */
        .grid {
          display: grid !important;
        }
        
        .grid-cols-1 {
          grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
        }
        
        .grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        }
        
        /* Ensure card layouts are visible */
        .bg-white {
          background-color: white !important;
        }
        
        .border {
          border-width: 1px !important;
        }
        
        .border-gray-200 {
          border-color: #e5e7eb !important;
        }
        
        .rounded-lg {
          border-radius: 0.5rem !important;
        }
        
        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        
        /* Hide Expert's Review section in PDF (multiple language variations) */
        section:has(h3:contains("Expert's Review")),
        section:has(h3:contains("Revisione dell'Esperto")),
        *:has(h3:contains("Expert's Review")),
        *:has(h3:contains("Revisione dell'Esperto")),
        .expert-review,
        [data-section="expert-review"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Hide congratulations sections that appear in main content (not in header) */
        *:contains("Congratulazioni! Il Tuo Piano Aziendale È Pronto!"):not(.section-title):not(h1) {
          display: none !important;
        }
        
        *:contains("Il Tuo Piano Aziendale È Pronto"):not(.section-title):not(h1) {
          display: none !important;
        }
        
        /* Alternative method - hide by text content (multiple languages) */
        *:contains("Expert's Review") {
          display: none !important;
        }
        
        *:contains("Revisione dell'Esperto") {
          display: none !important;
        }
        
        *:contains("Reviewed by industry professionals") {
          display: none !important;
        }
        
        *:contains("Revisionato da professionisti del settore") {
          display: none !important;
        }
        
        *:contains("Richiesta Inviata") {
          display: none !important;
        }
        
        /* Hide any button or element with "Richiesta" text */
        button:contains("Richiesta"),
        *:contains("Richiesta"):not(p):not(.section-content) {
          display: none !important;
        }
        
        /* Section styling for index and disclaimer */
        .section {
          margin-bottom: 20px;
          page-break-inside: auto;
        }
        
        .section-title {
          page-break-after: avoid;
          margin-bottom: 10px;
        }
        
        .section-title h2,
        .section-title-h2 {
          color: #1f2937; /* text-gray-800 */
          margin-top: 30px;
          margin-bottom: 15px;
          font-size: 24px; /* text-2xl */
          font-weight: bold; /* font-bold */
          border-bottom: 2px solid #3498db;
          padding-bottom: 5px;
          page-break-after: avoid;
          page-break-inside: avoid;
        }
        
        /* Responsive font size for sm and larger screens */
        @media (min-width: 640px) {
          .section-title h2,
          .section-title-h2 {
            font-size: 30px; /* sm:text-3xl */
          }
        }
        
        .section-content {
          page-break-inside: auto;
          margin-bottom: 15px;
          color: #374151; /* text-gray-700 */
          line-height: 1.625; /* leading-relaxed */
          font-size: 18px; /* text-base */
          text-align: justify; /* text-justify */
        }
        
        .section-content p {
          margin: 10px 0;
          color: #374151; /* text-gray-700 */
          line-height: 1.625; /* leading-relaxed */
          font-size: 18px; /* text-base */
          text-align: justify; /* text-justify */
        }
          
      </style>
      
      <!-- Congratulations Header -->
      <div style="text-align: center; margin-bottom: 40px; page-break-after: avoid;">
        <h1 style="color: #015BE9; font-size: 24px; font-weight: 600; margin: 20px 0 10px 0;">
          ✨ Congratulations! Your Business Plan Is Ready!
        </h1>
        <p style="color: #666; font-size: 14px; margin: 0;">
          Generated on: ${new Date().toLocaleDateString()}
        </p>
      </div>
      
      <!-- Index Section -->
      <div class="section" style="page-break-inside: avoid;">
        <div class="section-title">
          <h2 class="section-title-h2">Indice</h2>
        </div>
        <div class="section-content">
          <p><strong>Sommario</strong></p>
          <p><strong>Disclaimer</strong> (Insert this section to be standard for all generated plans)</p>
          <p>1. Sintesi</p>
          <p>2. Panoramica aziendale</p>
          <p>3. Gruppo dirigente</p>
          <p>4. Modello di business</p>
          <p>5. Analisi di mercato</p>
          <p>6. Fonti di finanziamento</p>
          <p>7. Conto economico a valore aggiunto</p>
          <p style="padding-left: 20px;">7.1 Ripartizione dei costi operativi</p>
          <p>8. Proiezione di profitti e perdite</p>
          <p>9. Stato Patrimoniale</p>
          <p>10. Posizione finanziaria netta</p>
          <p>11. Struttura del debito</p>
          <p>12. Financial Analysis</p>
          <p>13. Ratios Analysi</p>
        </div>
      </div>

      <!-- Disclaimer Section -->
      <div class="section" style="page-break-before: always;">
        <div class="section-title">
          <h2 class="section-title-h2">Disclaimer</h2>
        </div>
        <div class="section-content">
          <p>
            La presente relazione contiene dichiarazioni previsionali ("forward-looking statements"). Queste dichiarazioni sono basate sulle attuali aspettative e proiezioni della Società relativamente ad eventi futuri e, per loro natura, sono soggette ad una componente intrinseca di rischiosità ed incertezza. Sono dichiarazioni che si riferiscono ad eventi e dipendono da circostanze che possono, o non possono, accadere o verificarsi in futuro e, come tali, non si deve fare un indebito affidamento su di esse.
          </p>
          <p>
            I risultati effettivi potrebbero differire significativamente da quelli contenuti in dette dichiarazioni a causa di una molteplicità di fattori, incluse la volatilità e il deterioramento dei mercati del capitale e finanziari, variazioni nei prezzi di materie prime, cambi nelle condizioni macroeconomiche e nella crescita economica ed altre variazioni delle condizioni di business, mutamenti della normativa e del contesto istituzionale (sia in Italia che all'estero), e molti altri fattori, la maggioranza dei quali è al di fuori del controllo della Società.
          </p>
        </div>
      </div>

      ${htmlContent}
    `;

    // Send request to our Puppeteer API
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: completeHTML,
        options: {
          format: "A4",
          printBackground: true,
          margin: {
            top: "5mm",
            right: "2mm",
            bottom: "5mm",
            left: "2mm",
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate PDF");
    }

    // Get the PDF blob
    const pdfBlob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "print.pdf";

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    window.URL.revokeObjectURL(url);

    hideLoadingIndicator();
  } catch (error) {
    console.error("PDF generation failed:", error);
    hideLoadingIndicator();
    alert("PDF generation failed. Please try again.");
  }
};

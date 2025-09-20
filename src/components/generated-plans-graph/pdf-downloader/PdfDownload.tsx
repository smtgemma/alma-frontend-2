// import html2canvas from "html2canvas-pro";
// import { jsPDF } from "jspdf";

// // Show loading indicator
// const showLoadingIndicator = () => {
//   const loadingDiv = document.createElement("div");
//   loadingDiv.id = "pdf-loading-indicator";
//   loadingDiv.innerHTML = `
//     <div style="
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       background: rgba(0, 0, 0, 0.7);
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       z-index: 10000;
//       color: white;
//       font-family: Arial, sans-serif;
//     ">
//       <div style="
//         background: white;
//         padding: 30px;
//         border-radius: 10px;
//         text-align: center;
//         color: black;
//         box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
//       ">
//         <div style="
//           width: 40px;
//           height: 40px;
//           border: 4px solid #f3f3f3;
//           border-top: 4px solid #3498db;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin: 0 auto 15px;
//         "></div>
//         <div style="font-size: 16px; font-weight: 500;">PDF is generating...</div>
//         <div style="font-size: 14px; color: #666; margin-top: 5px;">Please wait a moment</div>
//       </div>
//     </div>
//     <style>
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//     </style>
//   `;
//   document.body.appendChild(loadingDiv);
//   return loadingDiv;
// };

// // Hide loading indicator
// const hideLoadingIndicator = () => {
//   const loadingDiv = document.getElementById("pdf-loading-indicator");
//   if (loadingDiv) {
//     document.body.removeChild(loadingDiv);
//   }
// };

// export const generateEmpathyPDF = async (elementToPrintId: string) => {
//   const loadingIndicator = showLoadingIndicator();

//   try {
//     const originalElement = document.getElementById(elementToPrintId);
//     if (!originalElement) {
//       throw new Error(`Element with id ${elementToPrintId} not found`);
//     }

//     // Allow UI to update by yielding control briefly
//     await new Promise((resolve) => setTimeout(resolve, 50));

//     // Create a completely hidden container
//     const hiddenContainer = document.createElement("div");
//     const desktopWidth = 1200;

//     hiddenContainer.style.cssText = `
//     position: fixed;
//     top: -50000px;
//     left: -50000px;
//     width: ${desktopWidth}px;
//     background: white;
//     z-index: -9999;
//     visibility: hidden;
//     pointer-events: none;
//     opacity: 0;
//     overflow: hidden;
// `;

//     // Add to body
//     document.body.appendChild(hiddenContainer);

//     try {
//       // Clone the element deeply (including all children and styles)
//       const clonedElement = originalElement.cloneNode(true) as HTMLElement;

//       // Apply desktop styles to the cloned element
//       clonedElement.style.cssText = `
//         width: ${desktopWidth}px !important;
//         min-width: ${desktopWidth}px !important;
//         max-width: ${desktopWidth}px !important;
//         transform: scale(1) !important;
//         position: static !important;
//         display: block !important;
//         visibility: visible !important;
//         opacity: 1 !important;
//         margin: 0 !important;
//         padding: ${originalElement.style.padding || "20px"} !important;
//         box-sizing: border-box !important;
//     `;

//       // Copy computed styles from original to ensure styling is preserved
//       const computedStyles = window.getComputedStyle(originalElement);
//       const importantStyles = [
//         "font-family",
//         "font-size",
//         "font-weight",
//         "line-height",
//         "color",
//         "background-color",
//         "border",
//         "border-radius",
//         "box-shadow",
//         "text-align",
//         "vertical-align",
//       ];

//       importantStyles.forEach((style) => {
//         const value = computedStyles.getPropertyValue(style);
//         if (value) {
//           clonedElement.style.setProperty(style, value, "important");
//         }
//       });

//       // Append cloned element to hidden container
//       hiddenContainer.appendChild(clonedElement);

//       // Reduced wait time for fonts, images, and layout to settle
//       await new Promise((resolve) => setTimeout(resolve, 200));

//       // Ensure all images are loaded in the cloned element with timeout
//       const images = clonedElement.querySelectorAll("img");
//       await Promise.all(
//         Array.from(images).map((img) => {
//           return new Promise((resolve) => {
//             if (img.complete) {
//               resolve(void 0);
//             } else {
//               const timeout = setTimeout(() => resolve(void 0), 2000); // 2 second timeout
//               img.onload = () => {
//                 clearTimeout(timeout);
//                 resolve(void 0);
//               };
//               img.onerror = () => {
//                 clearTimeout(timeout);
//                 resolve(void 0);
//               };
//             }
//           });
//         })
//       );

//       // Yield control to allow UI updates
//       await new Promise((resolve) => setTimeout(resolve, 10));

//       // Capture the cloned element with html2canvas - optimized settings
//       const canvas = await html2canvas(clonedElement, {
//         width: desktopWidth,
//         height: clonedElement.scrollHeight,
//         scale: 1.5, // Reduced from 2 to 1.5 for better performance
//         useCORS: true,
//         allowTaint: false,
//         backgroundColor: "#ffffff",
//         logging: false,
//         removeContainer: false,
//         foreignObjectRendering: false,
//         imageTimeout: 5000, // 5 second timeout for images
//         onclone: (clonedDoc) => {
//           // Optimize cloned document for faster rendering
//           const clonedBody = clonedDoc.body;
//           if (clonedBody) {
//             clonedBody.style.transform = "translateZ(0)"; // Force hardware acceleration
//           }
//         },
//       });

//       const data = canvas.toDataURL("image/png");

//       // Create a temporary PDF to get image properties
//       const tempPdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//       });

//       const imgProperties = tempPdf.getImageProperties(data);
//       const pdfWidth = 210; // A4 width in mm
//       const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

//       // Create PDF with custom height to fit the entire content
//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: [210, Math.max(297, pdfHeight + 20)], // A4 width, custom height with margins
//       });

//       // Add the image as a single continuous page
//       pdf.addImage(
//         data,
//         "PNG",
//         10, // x position (margin)
//         10, // y position (margin)
//         pdfWidth - 20, // width with margins
//         pdfHeight
//       );

//       pdf.save("print.pdf");

//       // Hide loading indicator after successful generation
//       hideLoadingIndicator();
//     } catch (error) {
//       console.error("PDF generation failed:", error);
//       hideLoadingIndicator();

//       // Show user-friendly error message
//       alert("PDF generation failed. Please try again.");
//       throw error;
//     } finally {
//       // Always clean up the hidden container
//       if (hiddenContainer && hiddenContainer.parentNode) {
//         document.body.removeChild(hiddenContainer);
//       }
//     }
//   } catch (error) {
//     console.error("PDF generation setup failed:", error);
//     hideLoadingIndicator();
//     alert("PDF generation failed. Please try again.");
//     throw error;
//   }
// };


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
    const closeButtons = document.querySelectorAll('button[aria-label*="close"], button[title*="close"], .modal button:last-child');
    closeButtons.forEach(button => {
      if (button instanceof HTMLElement) {
        button.click();
      }
    });
    
    // Also try pressing escape to close modals
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    
    // Wait a moment for modals to close and DOM to update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Wait for any React components to fully render
    await new Promise(resolve => requestAnimationFrame(resolve));

    const originalElement = document.getElementById(elementToPrintId);
    if (!originalElement) {
      throw new Error(`Element with id ${elementToPrintId} not found`);
    }

    // Clone the element to avoid modifying the original
    const clonedElement = originalElement.cloneNode(true) as HTMLElement;
    
    // Remove any modal, overlay, or popup elements from the cloned content
    const elementsToRemove = clonedElement.querySelectorAll([
      '[role="dialog"]',
      '[role="modal"]', 
      '.modal',
      '.popup',
      '.overlay',
      '.dropdown-menu',
      '.tooltip',
      '[data-modal]',
      '[id*="modal"]',
      '[class*="modal"]',
      '[class*="popup"]',
      '[class*="overlay"]',
      '[class*="dropdown"]',
      '.fixed.inset-0', // Tailwind modal backdrop
      '.fixed.z-50',    // High z-index overlays
      '.absolute.inset-0', // Full screen overlays
      '.fixed.bottom-8', // Floating action buttons
      'button[aria-label*="Download"]', // Download buttons
      'button[aria-label*="Share"]', // Share buttons
      'button[aria-label*="Edit"]' // Edit buttons
    ].join(','));
    
    elementsToRemove.forEach(element => element.remove());
    
    // Remove Expert's Review section from PDF
    const allElements = Array.from(clonedElement.querySelectorAll('*'));
    allElements.forEach(element => {
      const textContent = element.textContent || '';
      // Check if this element contains Expert's Review content
      if (textContent.includes("Expert's Review") && 
          textContent.includes("Reviewed by industry professionals")) {
        // This is likely the main Expert's Review section container
        element.remove();
      }
    });
    
    // Also remove any elements that are positioned fixed or have high z-index
    // But be more careful to not remove important content
    const fixedElements = clonedElement.querySelectorAll('*');
    fixedElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element as Element);
      const isModal = element.matches('[role="dialog"], [role="modal"], .modal, .popup, .overlay, .fixed.inset-0, .fixed.z-50');
      const isFloatingButton = element.matches('.fixed.bottom-8, button[aria-label*="Download"], button[aria-label*="Share"], button[aria-label*="Edit"]');
      
      // Only remove if it's actually a modal/overlay/floating element, not just any fixed element
      if ((computedStyle.position === 'fixed' && (isModal || isFloatingButton)) || 
          (parseInt(computedStyle.zIndex) > 40 && (isModal || isFloatingButton))) {
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
            .join('\n');
        } catch (e) {
          // Handle CORS issues with external stylesheets
          return '';
        }
      })
      .join('\n');

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
        
        /* Style tables for PDF */
        table {
          page-break-inside: avoid;
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 1em;
        }
        
        /* Style images and charts */
        img, canvas, svg {
          max-width: 100%;
          height: auto;
          page-break-inside: avoid;
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
        
        /* Hide Expert's Review section in PDF */
        section:has(h3:contains("Expert's Review")),
        *:has(h3:contains("Expert's Review")),
        .expert-review,
        [data-section="expert-review"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Alternative method - hide by text content */
        *:contains("Expert's Review") {
          display: none !important;
        }
        
        *:contains("Reviewed by industry professionals") {
          display: none !important;
        }
      </style>
      ${htmlContent}
    `;

    // Send request to our Puppeteer API
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: completeHTML,
        options: {
          format: 'A4',
          printBackground: true,
          margin: {
            top: '5mm',
            right: '2mm',
            bottom: '5mm',
            left: '2mm'
          }
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate PDF');
    }

    // Get the PDF blob
    const pdfBlob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'print.pdf';
    
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


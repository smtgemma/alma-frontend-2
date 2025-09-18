import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

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
    const originalElement = document.getElementById(elementToPrintId);
    if (!originalElement) {
      throw new Error(`Element with id ${elementToPrintId} not found`);
    }

    // Allow UI to update by yielding control briefly
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Create a completely hidden container
    const hiddenContainer = document.createElement("div");
    const desktopWidth = 1200;

    hiddenContainer.style.cssText = `
    position: fixed;
    top: -50000px;
    left: -50000px;
    width: ${desktopWidth}px;
    background: white;
    z-index: -9999;
    visibility: hidden;
    pointer-events: none;
    opacity: 0;
    overflow: hidden;
`;

    // Add to body
    document.body.appendChild(hiddenContainer);

    try {
      // Clone the element deeply (including all children and styles)
      const clonedElement = originalElement.cloneNode(true) as HTMLElement;

      // Apply desktop styles to the cloned element
      clonedElement.style.cssText = `
        width: ${desktopWidth}px !important;
        min-width: ${desktopWidth}px !important;
        max-width: ${desktopWidth}px !important;
        transform: scale(1) !important;
        position: static !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        margin: 0 !important;
        padding: ${originalElement.style.padding || "20px"} !important;
        box-sizing: border-box !important;
    `;

      // Copy computed styles from original to ensure styling is preserved
      const computedStyles = window.getComputedStyle(originalElement);
      const importantStyles = [
        "font-family",
        "font-size",
        "font-weight",
        "line-height",
        "color",
        "background-color",
        "border",
        "border-radius",
        "box-shadow",
        "text-align",
        "vertical-align",
      ];

      importantStyles.forEach((style) => {
        const value = computedStyles.getPropertyValue(style);
        if (value) {
          clonedElement.style.setProperty(style, value, "important");
        }
      });

      // Append cloned element to hidden container
      hiddenContainer.appendChild(clonedElement);

      // Reduced wait time for fonts, images, and layout to settle
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Ensure all images are loaded in the cloned element with timeout
      const images = clonedElement.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          return new Promise((resolve) => {
            if (img.complete) {
              resolve(void 0);
            } else {
              const timeout = setTimeout(() => resolve(void 0), 2000); // 2 second timeout
              img.onload = () => {
                clearTimeout(timeout);
                resolve(void 0);
              };
              img.onerror = () => {
                clearTimeout(timeout);
                resolve(void 0);
              };
            }
          });
        })
      );

      // Yield control to allow UI updates
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Capture the cloned element with html2canvas - optimized settings
      const canvas = await html2canvas(clonedElement, {
        width: desktopWidth,
        height: clonedElement.scrollHeight,
        scale: 1.5, // Reduced from 2 to 1.5 for better performance
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: false,
        foreignObjectRendering: false,
        imageTimeout: 5000, // 5 second timeout for images
        onclone: (clonedDoc) => {
          // Optimize cloned document for faster rendering
          const clonedBody = clonedDoc.body;
          if (clonedBody) {
            clonedBody.style.transform = "translateZ(0)"; // Force hardware acceleration
          }
        },
      });

      const data = canvas.toDataURL("image/png");

      // Create a temporary PDF to get image properties
      const tempPdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProperties = tempPdf.getImageProperties(data);
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      // Create PDF with custom height to fit the entire content
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, Math.max(297, pdfHeight + 20)], // A4 width, custom height with margins
      });

      // Add the image as a single continuous page
      pdf.addImage(
        data,
        "PNG",
        10, // x position (margin)
        10, // y position (margin)
        pdfWidth - 20, // width with margins
        pdfHeight
      );

      pdf.save("print.pdf");

      // Hide loading indicator after successful generation
      hideLoadingIndicator();
    } catch (error) {
      console.error("PDF generation failed:", error);
      hideLoadingIndicator();

      // Show user-friendly error message
      alert("PDF generation failed. Please try again.");
      throw error;
    } finally {
      // Always clean up the hidden container
      if (hiddenContainer && hiddenContainer.parentNode) {
        document.body.removeChild(hiddenContainer);
      }
    }
  } catch (error) {
    console.error("PDF generation setup failed:", error);
    hideLoadingIndicator();
    alert("PDF generation failed. Please try again.");
    throw error;
  }
};
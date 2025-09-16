import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export const generateEmpathyPDF = async (elementToPrintId: string) => {
  const originalElement = document.getElementById(elementToPrintId);
  if (!originalElement) {
    throw new Error(`Element with id ${elementToPrintId} not found`);
  }

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

    // Wait for fonts, images, and layout to settle
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Ensure all images are loaded in the cloned element
    const images = clonedElement.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(void 0);
          } else {
            img.onload = () => resolve(void 0);
            img.onerror = () => resolve(void 0);
          }
        });
      })
    );

    // Additional wait to ensure everything is rendered
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Capture the cloned element with html2canvas
    const canvas = await html2canvas(clonedElement, {
      width: desktopWidth,
      height: clonedElement.scrollHeight,
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      removeContainer: false,
      foreignObjectRendering: false, // This can help with some rendering issues
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
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  } finally {
    // Always clean up the hidden container
    if (hiddenContainer && hiddenContainer.parentNode) {
      document.body.removeChild(hiddenContainer);
    }
  }
};
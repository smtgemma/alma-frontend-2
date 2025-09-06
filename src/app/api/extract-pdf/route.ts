import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const documentType = formData.get("document_type") as string;

    // Create a new FormData for the AI server
    const aiFormData = new FormData();

    // Copy the file from the request
    const file = formData.get("file") as File;
    if (file) {
      aiFormData.append("file", file);
    }
    aiFormData.append("document_type", documentType);

    // Try different possible endpoints for PDF extraction
    const possibleEndpoints = [
      `/extract-pdf?document_type=${documentType}`,
      `/pdf-extract?document_type=${documentType}`,
      `/extract?document_type=${documentType}`,
      `/process-pdf?document_type=${documentType}`,
      `/upload-pdf?document_type=${documentType}`,
      `/api/v1/extract-pdf?document_type=${documentType}`,
      `/api/v1/pdf-extract?document_type=${documentType}`,
    ];

    let aiResponse = null;
    let lastError = null;

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);

        // Add timeout to each request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 seconds timeout

        aiResponse = await fetch(`http://172.252.13.69:2002${endpoint}`, {
          method: "POST",
          body: aiFormData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (aiResponse.ok) {
          console.log(`Success with endpoint: ${endpoint}`);
          break;
        } else {
          console.log(
            `Failed with endpoint: ${endpoint}, status: ${aiResponse.status}`
          );
          lastError = `Status: ${aiResponse.status}`;
        }
      } catch (error) {
        console.log(`Error with endpoint: ${endpoint}`, error);
        if (error instanceof Error && error.name === "AbortError") {
          lastError = "Request timeout";
        } else {
          lastError = error instanceof Error ? error.message : "Unknown error";
        }
      }
    }

    if (!aiResponse || !aiResponse.ok) {
      console.error("All endpoints failed. Last error:", lastError);

      // Return a fallback response that allows the file to be uploaded
      // but indicates that AI extraction is not available
      return NextResponse.json(
        {
          success: true,
          text_content:
            "Document uploaded successfully. AI extraction service is currently unavailable.",
          business_name: "",
          location: "",
          status: "uploaded_no_extraction",
          message: "File uploaded but AI extraction service unavailable",
        },
        { status: 200 }
      );
    }

    const data = await aiResponse.json();

    return NextResponse.json({
      success: true,
      text_content: data.text_content,
      business_name: data.business_name,
      location: data.location,
      status: data.text_content ? "extracted" : "uploaded_no_extraction",
      message: "PDF processed successfully",
    });
  } catch (error) {
    console.error("PDF Extraction Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to extract PDF content",
        status: "error",
      },
      { status: 500 }
    );
  }
}

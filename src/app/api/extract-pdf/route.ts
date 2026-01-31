import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const { searchParams } = new URL(request.url);

    // Get document_type from URL parameters (primary) or formData (fallback)
    const documentType =
      searchParams.get("document_type") ||
      (formData.get("document_type") as string);

    console.log("🔍 Next.js API - Document Type:", documentType);
    console.log("🔍 Next.js API - URL:", request.url);
    console.log(
      "🔍 Next.js API - Search Params:",
      Object.fromEntries(searchParams.entries()),
    );

    // Create a new FormData for the AI server
    const aiFormData = new FormData();

    // Copy the file from the request
    const file = formData.get("file") as File;
    if (!file) {
      console.log("❌ Next.js API - No file found in FormData");
      return NextResponse.json(
        { success: false, message: "No file provided", status: "error" },
        { status: 400 },
      );
    }

    console.log("📁 Next.js API - File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });

    // Validate file type
    if (
      !file.type.includes("pdf") &&
      !file.type.includes("image") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      console.log("⚠️ Next.js API - Invalid file type:", file.type);
    }

    if (!documentType) {
      console.log("❌ Next.js API - No document_type provided");
      return NextResponse.json(
        {
          success: false,
          message: "No document_type provided",
          status: "error",
        },
        { status: 400 },
      );
    }

    aiFormData.append("files", file); // API expects 'files' not 'file'
    aiFormData.append("document_type", documentType);

    console.log("📦 Next.js API - FormData being sent to AI service:", {
      hasFile: !!file,
      fileName: file?.name,
      documentType: documentType,
    });

    // Based on the API documentation, the correct endpoint is /extract-pdf
    const possibleEndpoints = [
      `/extract-pdf?document_type=${documentType}`,
      `/extract-pdf`, // Try without query params as well
      `/extract-pdf?document_type=${documentType}`,
      `/pdf-extract?document_type=${documentType}`,
      `/extract?document_type=${documentType}`,
    ];

    let aiResponse = null;
    let lastError = null;

    console.log("🎯 Next.js API - Trying endpoints:", possibleEndpoints);

    // First, test if the AI service is reachable at all
    try {
      const testResponse = await fetch("https://ai.pianificosuite.it", {
        method: "GET",
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      console.log(
        "🌐 Next.js API - AI service reachability test:",
        testResponse.status,
      );
    } catch (testError) {
      console.log("⚠️ Next.js API - AI service not reachable:", testError);
    }

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(
          `🔄 Next.js API - Trying endpoint: https://ai.pianificosuite.it${endpoint}`,
        );

        // Create fresh FormData for each request to avoid any issues
        const freshFormData = new FormData();
        freshFormData.append("files", file); // API expects 'files' not 'file'
        if (documentType) {
          freshFormData.append("document_type", documentType);
        }

        console.log(`📦 Next.js API - FormData contents for ${endpoint}:`, {
          hasFiles: freshFormData.has("files"),
          hasDocumentType: freshFormData.has("document_type"),
          documentTypeValue: freshFormData.get("document_type"),
        });

        // Add timeout to each request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

        aiResponse = await fetch(`https://ai.pianificosuite.it${endpoint}`, {
          method: "POST",
          body: freshFormData,
          signal: controller.signal,
          headers: {
            // Don't set Content-Type - let browser handle multipart/form-data boundary
            Accept: "application/json",
          },
        });

        clearTimeout(timeoutId);

        console.log(
          `📊 Next.js API - Response status for ${endpoint}:`,
          aiResponse.status,
        );

        // Log response headers for debugging
        console.log(
          `📊 Next.js API - Response headers:`,
          Object.fromEntries(aiResponse.headers.entries()),
        );

        if (aiResponse.ok) {
          console.log(`✅ Next.js API - Success with endpoint: ${endpoint}`);
          break;
        } else {
          // Try to get error response text
          try {
            const errorText = await aiResponse.text();
            console.log(
              `❌ Next.js API - Failed with endpoint ${endpoint}, status: ${aiResponse.status}, response: ${errorText}`,
            );
            lastError = `Status: ${aiResponse.status}, Response: ${errorText}`;
          } catch (textError) {
            console.log(
              `❌ Next.js API - Failed with endpoint ${endpoint}, status: ${aiResponse.status}`,
            );
            lastError = `Status: ${aiResponse.status}`;
          }
        }
      } catch (error) {
        console.log(`❌ Next.js API - Error with endpoint ${endpoint}:`, error);
        if (error instanceof Error && error.name === "AbortError") {
          console.log(`⏰ Next.js API - Timeout for endpoint: ${endpoint}`);
          lastError = "Request timeout";
        } else {
          console.log(
            `⚠️ Next.js API - Other error for endpoint ${endpoint}:`,
            error,
          );
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
        { status: 200 },
      );
    }

    const data = await aiResponse.json();
    console.log("🔍 Next.js API - Raw AI Service Response:", data);

    // Pass through all the data from the AI service
    const responseData = {
      success: true,
      // Pass through all original data
      ...data,
      // Ensure core fields exist
      text_content: data.text_content || "",
      business_name: data.business_name || "",
      location: data.location || "",
      page_count: data.page_count || 1,
      metadata: data.metadata || {},
      financial_data: data.financial_data || null,
      document_type: data.document_type || documentType,
      status: data.text_content ? "extracted" : "uploaded_no_extraction",
      message: "PDF processed successfully",
    };

    console.log("✅ Next.js API - Response to client:", responseData);
    return NextResponse.json(responseData);
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
      { status: 500 },
    );
  }
}

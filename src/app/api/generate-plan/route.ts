import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();


    // Proxy the request to the backend API for plan generation
    const backendApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/businessPlan`;



    // Get authorization token from request headers
    let authToken =
      request.headers.get("authorization") ||
      request.headers.get("Authorization");


    // If no token in headers, try to get from request body
    if (!authToken && body.token) {
      authToken = `Bearer ${body.token}`;
      // Remove token from body to avoid sending it twice
      delete body.token;
    }

    // Prepare the request body according to the API specification
    const requestBody: any = {};

    // Add uploaded_file if present (for PDF content)
    if (body.uploaded_file && body.uploaded_file.length > 0) {
      requestBody.uploaded_file = body.uploaded_file;
    }

    // Add user_input if present (for form questions and answers)
    if (body.user_input && body.user_input.length > 0) {
      requestBody.user_input = body.user_input;
    }

     // Add language if present
     if (body.language) {
      requestBody.language = body.language;
    }

    // Add currency if present
    if (body.currency) {
      requestBody.currency = body.currency;
    }

    // Remove user_id from request body as it's not needed for the backend API
    if (body.user_id) {
      delete body.user_id;
    }

    // If no data is present, create a test request to see if the API works
    if (!requestBody.uploaded_file && !requestBody.user_input) {
      requestBody.user_input = [
        {
          question: "What is your business name?",
          answer: "Test Business",
        },
        {
          question: "What type of business is this?",
          answer: "new",
        },
      ];
      requestBody.language = "English";
      requestBody.currency = "USD";
    }


    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token is available
    if (authToken) {
      headers["Authorization"] = authToken;
    
    } else {
      console.log("No authorization token found");
    }

  
    const response = await fetch(backendApiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("Backend API error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Backend API error response:", errorText);

      return NextResponse.json(
        {
          success: false,
          message: `Backend API error: ${response.status} ${response.statusText}`,
          status: "error",
        },
        { status: response.status }
      );
    }

    const backendResponse = await response.json();

    // Check if the response matches the expected format from Postman
    if (backendResponse.success && backendResponse.statusCode === 200) {
      // The backend returned success, create a plan content from the response
      const planContent = `Business Plan Generated Successfully!

Status: ${backendResponse.message}
Generated at: ${new Date().toISOString()}

Your business plan has been generated and sent for review. You will receive the detailed plan once it has been reviewed by our experts.

Response Details:
- Success: ${backendResponse.success}
- Status Code: ${backendResponse.statusCode}
- Message: ${backendResponse.message}`;

      const transformedResponse = {
        success: true,
        data: {
          plan_content: planContent,
          plan_id: `plan_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          generated_at: new Date().toISOString(),
        },
        message: backendResponse.message || "Plan generated successfully",
      };

     

      return NextResponse.json(transformedResponse);
    } else {
 

      const planContent = `Business Plan Generation Response:

${JSON.stringify(backendResponse, null, 2)}`;

      const transformedResponse = {
        success: true,
        data: {
          plan_content: planContent,
          plan_id: `plan_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          generated_at: new Date().toISOString(),
        },
        message: "Plan generation completed",
      };

      return NextResponse.json(transformedResponse);
    }
  } catch (error) {
    console.error("Generate Plan Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to generate plan",
        status: "error",
      },
      { status: 500 }
    );
  }
}

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface GeneratePlanRequest {
  uploaded_file?: Array<{ text_content: string }>;
  user_input?: Array<{ question: string; answer: string }>;
}

export interface GeneratePlanResponse {
  success: boolean;
  message?: string;
  data?: {
    plan_content: string;
    plan_id?: string;
    generated_at?: string;
  };
  status?: string;
}
//nenib26100@fursee.com
export const generatePlanApi = createApi({
  reducerPath: "generatePlanApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://172.252.13.71:1002/api/v1", // Direct backend URL like login API
    credentials: "omit",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");

      // Get token from Redux state
      const state = getState() as any;
      const token = state.user?.token || localStorage.getItem("token");

      console.log("=== API HEADERS PREPARATION ===");
      console.log(
        "Token from Redux state:",
        state.user?.token ? "Found" : "Not found"
      );
      console.log(
        "Token from localStorage:",
        localStorage.getItem("token") ? "Found" : "Not found"
      );
      console.log("Final token being used:", token ? "Found" : "Not found");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log(
          "Authorization header set in API:",
          `Bearer ${token.substring(0, 20)}...`
        );
        console.log("Full Authorization header:", `Bearer ${token}`);
      } else {
        console.log("No token found for authorization");
      }

      console.log(
        "All headers being sent:",
        Object.fromEntries(headers.entries())
      );

      return headers;
    },
  }),
  endpoints: (builder) => ({
    generatePlan: builder.mutation<GeneratePlanResponse, GeneratePlanRequest>({
      query: (data) => {
    
        return {
          url: "/businessPlan", // Direct backend endpoint
          method: "POST",
          body: data,
        };
      },
      transformResponse: (response: any): GeneratePlanResponse => {
        console.log("=== TRANSFORM RESPONSE CALLED ===");
        console.log("Raw Response from backend:", response);
        console.log("Response type:", typeof response);
        console.log("Response keys:", Object.keys(response || {}));
        console.log("Response data:", response?.data);
        console.log(
          "Response data plan_content:",
          response?.data?.plan_content
        );
        console.log(
          "Response data plan_content length:",
          response?.data?.plan_content?.length
        );

        // Transform the backend response to match our expected format
        if (response.success && response.statusCode === 200) {
          // Backend returned success, create plan content
          const planContent = `Business Plan Generated Successfully!

Status: ${response.message}
Generated at: ${new Date().toISOString()}

Your business plan has been generated and sent for review. You will receive the detailed plan once it has been reviewed by our experts.

Response Details:
- Success: ${response.success}
- Status Code: ${response.statusCode}
- Message: ${response.message}`;

          return {
            success: true,
            data: {
              plan_content: planContent,
              plan_id: `plan_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              generated_at: new Date().toISOString(),
            },
            message: response.message || "Plan generated successfully",
          };
        }

        // Return the response as is if it doesn't match expected format
        return response;
      },
      transformErrorResponse: (response: any): GeneratePlanResponse => {
        console.log("Generate Plan API Error Response:", response);
        console.log("Error Response Type:", typeof response);
        console.log("Error Response Keys:", Object.keys(response || {}));

        let errorMessage = "Failed to generate plan";

        // Handle different error response formats
        if (response?.data?.detail) {
          errorMessage = response.data.detail;
        } else if (response?.data?.message) {
          errorMessage = response.data.message;
        } else if (response?.detail) {
          errorMessage = response.detail;
        } else if (response?.message) {
          errorMessage = response.message;
        } else if (response?.error) {
          errorMessage = response.error;
        } else if (response?.status === "FETCH_ERROR") {
          errorMessage = "Network error: Unable to connect to the server";
        }

        console.log("Final error message:", errorMessage);

        return {
          success: false,
          message: errorMessage,
          status: "error",
        };
      },
    }),
  }),
});

export const { useGeneratePlanMutation } = generatePlanApi;

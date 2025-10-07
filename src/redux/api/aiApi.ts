// AI API configuration for direct AI services
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    //http://206.162.244.131:2002/extract-pdf?document_type=balance_sheet
    // baseUrl: "http://172.252.13.69:2002",
    baseUrl: "https://ai.pianificosuite.it",
    credentials: "omit",
    prepareHeaders: (headers, { endpoint }) => {
      // Don't set Content-Type for FormData requests (file uploads)
      // The browser will automatically set the correct Content-Type with boundary for FormData
      if (endpoint !== "extractPdf") {
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["AISuggestions", "GeneratedPlan"],
});

// Export hooks for usage in functional components
export default aiApi;

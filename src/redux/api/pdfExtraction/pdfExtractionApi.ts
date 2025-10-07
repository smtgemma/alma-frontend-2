import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PdfExtractionRequest {
  file: File;
  document_type: string;
}

export interface PdfExtractionResponse {
  text_content?: string;
  business_name?: string;
  location?: string;
  page_count?: number;
  metadata?: Record<string, any>;
  financial_data?: any;
  document_type?: string;
  status?: string;
  success: boolean;
  message?: string;
  [key: string]: any;
}

// Actual API response format from AI service
interface AIPdfExtractionResponse {
  text_content?: string;
  business_name?: string;
  location?: string;
  page_count?: number;
  metadata?: Record<string, any>;
  financial_data?: any;
  document_type?: string;
  [key: string]: any;
}

export const pdfExtractionApi = createApi({
  reducerPath: "pdfExtractionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // Use local Next.js API routes
    credentials: "omit",
    prepareHeaders: (headers) => {
      // Don't set Content-Type for FormData requests (file uploads)
      // The browser will automatically set the correct Content-Type with boundary for FormData
      return headers;
    },
  }),
  endpoints: (builder) => ({
    extractPdf: builder.mutation({
      query: ({ file, document_type }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', document_type);
        
        return {
          url: `/extract-pdf?document_type=${document_type}`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: any) => {
        console.log('🔍 PDF API Raw Response:', response);
        
        const transformedResponse = {
          // Pass through all the original response data
          ...response,
          // Ensure we have the core fields
          text_content: response.text_content || "",
          business_name: response.business_name || "",
          location: response.location || "",
          page_count: response.page_count || 1,
          metadata: response.metadata || {},
          financial_data: response.financial_data || null,
          document_type: response.document_type || "unknown",
          status: response.text_content ? 'extracted' : 'uploaded_no_extraction',
          success: true,
          message: "PDF processed successfully"
        };
        
        console.log('✅ PDF API Transformed Response:', transformedResponse);
        return transformedResponse;
      },
      transformErrorResponse: (response: any) => {
        console.log('PDF API Error Response:', response);
        
        let errorMessage = "Failed to extract PDF content";
        
        // Handle different error response formats
        if (response?.data?.detail) {
          errorMessage = response.data.detail;
        } else if (response?.data?.message) {
          errorMessage = response.data.message;
        } else if (response?.detail) {
          errorMessage = response.detail;
        } else if (response?.message) {
          errorMessage = response.message;
        }
        
        return {
          success: false,
          message: errorMessage,
          status: 'error'
        };
      },
    }),
  }),
});

export const { useExtractPdfMutation } = pdfExtractionApi;
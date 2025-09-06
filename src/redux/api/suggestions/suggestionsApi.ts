import aiApi from "../aiApi";

export interface SuggestionRequest {
  question: string;
  context?: string;
  businessType?: string;
}

export interface SuggestionResponse {
  suggestions: string[];
  success: boolean;
  message?: string;
}

// Actual API response format
interface AIApiResponse {
  question: string;
  suggestions: string[];
}

export const suggestionsApi = aiApi.injectEndpoints({
  endpoints: (builder) => ({
    getAISuggestions: builder.mutation<SuggestionResponse, SuggestionRequest>({
      query: (data) => ({
        url: "/suggestions",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: AIApiResponse): SuggestionResponse => {
        return {
          suggestions: response.suggestions || [],
          success: true,
          message: "Suggestions fetched successfully"
        };
      },
      transformErrorResponse: (response: any): SuggestionResponse => {
        return {
          suggestions: [],
          success: false,
          message: response?.data?.message || "Failed to fetch suggestions"
        };
      },
    }),
  }),
});

export const { useGetAISuggestionsMutation } = suggestionsApi;
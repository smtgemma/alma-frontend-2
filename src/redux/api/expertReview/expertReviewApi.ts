import baseApi from "../baseApi";

export const expertReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitExpertReview: builder.mutation({
      query: (planId: string) => ({
        url: "/expert-review",
        method: "POST",
        body: { planId },
      }),
      invalidatesTags: ["Plans"],
      // invalidatesTags: ["ExpertReview"],
    }),
  }),
});

export const { useSubmitExpertReviewMutation } = expertReviewApi;

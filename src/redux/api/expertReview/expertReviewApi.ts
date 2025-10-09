import baseApi from "../baseApi";

export const expertReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitExpertReview: builder.mutation({
      query: (planId: string) => ({
        url: "/expert-review",
        method: "POST",
        body: { planId },
      }),
      invalidatesTags: ["ExpertReview"],
    }),
    updateReviewStatus: builder.mutation({
      query: ({ reviewId, status }: { reviewId: string; status: string }) => ({
        url: `/expert-review/${reviewId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["ExpertReview"],
    }),
  }),
});

export const { useSubmitExpertReviewMutation, useUpdateReviewStatusMutation } =
  expertReviewApi;

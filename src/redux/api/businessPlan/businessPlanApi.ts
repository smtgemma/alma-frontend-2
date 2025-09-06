import baseApi from "../baseApi";

export const businessPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    businessGenerate: builder.mutation({
      query: (data) => ({
        url: "/businessPlan",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BusinessPlan"],
    }),
    businessDraft: builder.mutation({
      query: (data) => ({
        url: "/businessPlan/draft",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BusinessPlan"],
    }),
    businessSyncDraft: builder.mutation({
      query: () => ({
        url: "/businessPlan/draft/sync",
        method: "POST",
      }),
      invalidatesTags: ["BusinessPlan"],
    }),

    // Update Business Plan
    updateBusinessPlan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/businessPlan/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["BusinessPlan"],
    }),

    // User Profile Endpoints
    getMyBusinessPlan: builder.query({
      query: () => ({
        url: "/businessPlan",
        method: "GET",
      }),
      providesTags: ["BusinessPlan"],
    }),

    // User Profile Endpoints
    getSingleBusinessPlan: builder.query({
      query: (id) => ({
        url: `/businessPlan/${id}`,
        method: "GET",
      }),
      providesTags: ["BusinessPlan"],
    }),

    // admin Profile Endpoints
    // getSingleBusinessPlanAdmin: builder.query({
    //   query: (id) => ({
    //     url: `/businessPlan/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["BusinessPlan"],
    // }),

    getMyBusinessPlanSummery: builder.query({
      query: () => ({
        url: "/businessPlan/summery",
        method: "GET",
      }),
      providesTags: ["BusinessPlan"],
    }),

    getDraftBusinessPlan: builder.query({
      query: () => ({
        url: "/businessPlan/draft",
        method: "GET",
      }),
      providesTags: ["BusinessPlan"],
    }),
  }),
});

export const {
  useGetMyBusinessPlanQuery,
  useGetMyBusinessPlanSummeryQuery,
  useBusinessGenerateMutation,
  useBusinessDraftMutation,
  useBusinessSyncDraftMutation,
  useGetDraftBusinessPlanQuery,
  useGetSingleBusinessPlanQuery,
  useUpdateBusinessPlanMutation,
} = businessPlanApi;

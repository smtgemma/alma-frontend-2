import baseApi from "../baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminSummary: builder.query({
      query: () => ({
        url: "/admin",
      }),
      providesTags: ["Admin"],
    }),
    // businessPlan/admin
    adminGelAllPlans: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "businessPlan/admin",
        params: { page, limit, search },
      }),
      providesTags: ["Admin"],
    }),
    adminPendingPlans: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "admin/pendingPlan",
        params: { page, limit, search },
      }),
      providesTags: ["Admin"],
    }),
    blockedUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "users/blocked",
        params: { page, limit, search },
      }),
      providesTags: ["Admin"],
    }),
    soloAnalytics: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "admin/solo-analytics",
        params: { page, limit, search },
      }),
      providesTags: ["Admin"],
    }),
    teamAnalytics: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "admin/team-analytics",
        params: { page, limit, search },
      }),
      providesTags: ["Admin"],
    }),
    planReleased: builder.mutation({
      query: (id) => ({
        url: `admin/status/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Admin"],
    }),
    subscriptionDetails: builder.query({
      query: (id) => ({
        url: `admin/subscriptionDetails/${id}`,
      }),
      providesTags: ["Admin"],
    }),
    reviewStats: builder.query({
      query: () => ({
        url: `/expert-review/stats`,
      }),
      providesTags: ["Admin"],
    }),
    allReviewGet: builder.query({
      query: () => ({
        url: `/expert-review`,
      }),
      providesTags: ["Admin"],
    }),
    userSuspend: builder.mutation({
      query: ({ id, body }) => ({
        url: `users/status/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),

    // Admin endpoint to view any business plan
    adminGetSingleBusinessPlan: builder.query({
      query: (id) => ({
        url: `businessPlan/admin/${id}`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    // Admin endpoint to update any business plan
    adminUpdateBusinessPlan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/businessPlan/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Admin", "BusinessPlan"],
    }),
  }),
});

export const {
  useAdminSummaryQuery,
  useAdminGelAllPlansQuery,
  useAdminPendingPlansQuery,
  usePlanReleasedMutation,
  useSubscriptionDetailsQuery,
  useUserSuspendMutation,
  useBlockedUsersQuery,
  useSoloAnalyticsQuery,
  useTeamAnalyticsQuery,
  useReviewStatsQuery,
  useAllReviewGetQuery,
  useAdminGetSingleBusinessPlanQuery,
  useAdminUpdateBusinessPlanMutation,
} = adminApi;

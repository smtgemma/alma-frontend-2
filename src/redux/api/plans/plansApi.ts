import baseApi from "../baseApi";

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => "/plans",
      providesTags: ["Plans"],
    }),
    getSinglePlans: builder.query({
      query: (id) => `/plans/${id}`,
      providesTags: ["Plans"],
    }),
    getCurrentPlans: builder.query({
      query: () => "/plans/summery",
      providesTags: ["Plans"],
    }),
    updatePlan: builder.mutation({
      query: ({id, body}) => ({
        url: `/plans/${id}`,
        method: "PUT",
        body,
      }),
      // Invalidate Plans cache to refresh subscription data
      invalidatesTags: ["Plans"],
    }),
    // Add subscription creation mutation that invalidates cache
    createSubscription: builder.mutation({
      query: (subscriptionData) => ({
        url: "/billing/subscribe",
        method: "POST",
        body: subscriptionData,
      }),
      // Invalidate Plans cache to refresh subscription data
      invalidatesTags: ["Plans"],
    }),
 
  }),
});

export const {
  useGetPlansQuery,
  useGetCurrentPlansQuery,
  useCreateSubscriptionMutation,
  useUpdatePlanMutation,
  useGetSinglePlansQuery,
} = planApi;

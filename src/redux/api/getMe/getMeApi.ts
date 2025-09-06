import baseApi from "../baseApi";

export const getMe = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetMeQuery } = getMe;

import baseApi from "../baseApi";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteMember: builder.mutation({
      query: (body) => ({
        url: "/team/invite",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Team"],
    }),

    getTeam: builder.query({
      query: () => ({
        url: "/team",
        method: "GET",
      }),
      providesTags: ["Team"],
    }),
    getMemberTeam: builder.query({
      query: () => ({
        url: `team/members`,
        method: "GET",
      }),
      providesTags: ["Team"],
    }),
    removeMemberTeam: builder.mutation({
      query: ({ teamId, email }) => ({
        url: `team/remove`,
        method: "PATCH",
        body: { teamId, email },
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetTeamQuery,
  useInviteMemberMutation,
  useGetMemberTeamQuery,
  useRemoveMemberTeamMutation,
} = teamApi;

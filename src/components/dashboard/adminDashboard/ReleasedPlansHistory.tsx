"use client";
import React, { useState } from "react";
import { BsSearch, BsEye } from "react-icons/bs";
import Link from "next/link";
import { useAdminGelAllPlansQuery } from "@/redux/api/admin/adminAPI";
import { format } from "date-fns";
import useAuthUser from "@/hooks/useGetMe";
import DashboardLoading from "@/components/dashboard/soloDashboard/DashboardLoading";

const ReleasedPlansHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Get current user info to check role
  const { user: currentUser, isLoading: userLoading } = useAuthUser();

  // Check if user has admin access
  const hasAdminAccess =
    currentUser?.role === "ADMIN" || currentUser?.role === "SUPERADMIN";

  // Fetch released plans data from API
  const {
    data: releasedPlansData,
    isLoading,
    error,
    refetch,
  } = useAdminGelAllPlansQuery(
    {
      page: currentPage,
      limit: rowsPerPage,
      search: searchTerm || "",
    },
    {
      // Skip the query if user doesn't have admin access
      skip: !hasAdminAccess,
    }
  );

  // Extract plans data - API response structure is data.data (array of plans)
  const releasedPlans = releasedPlansData?.data?.data || [];

  // Debug console logs
  console.log("🔍 ReleasedPlansHistory Debug:");
  console.log("isLoading:", isLoading);
  console.log("error:", error);
  console.log("releasedPlansData:", releasedPlansData);
  console.log("releasedPlansData.data:", releasedPlansData?.data);
  console.log("releasedPlansData.data.data:", releasedPlansData?.data?.data);
  console.log("releasedPlans:", releasedPlans);
  console.log("hasAdminAccess:", hasAdminAccess);
  console.log("currentUser:", currentUser);

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLoading
        type="plans"
        title="Loading Plans..."
        message="Please wait while we fetch the plans data."
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLoading
        type="plans"
        title="Error Loading Plans"
        message="Failed to load plans data. Please try again."
      />
    );
  }

  // Filter plans based on search term
  const filteredPlans = releasedPlans.filter(
    (plan: any) =>
      plan.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.subscriptionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredPlans.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPlans = filteredPlans.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Released Plans History Section */}
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <div className="">
            <h2 className="text-[2rem] font-medium text-accent">
              {" "}
              Released Plans History
            </h2>
          </div>

          {/* Search Bar */}
          <div className="rounded-[41px]">
            <div className="  bg-white">
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-[41px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#475466]">
              <tr>
                <th className="px-6 py-3 text-left text-[20px] font-medium text-white uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-[20px] font-medium text-white uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-[20px] font-medium text-white uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-[20px] font-medium text-white uppercase tracking-wider">
                  Presentation
                </th>
                <th className="px-6 py-3 text-left text-[20px] font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-[20px] font-medium text-white uppercase tracking-wider">
                  User Profile
                </th>
                <th className="px-6 py-3 text-left text-[20px] font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPlans.map((plan: any) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-accent">
                    {format(new Date(plan.createdAt), "hh:mm a-MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-accent">
                    {plan.user?.firstName} {plan.user?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-base font-normal">
                      {plan.subscriptionType === "SOLO"
                        ? "Solo"
                        : plan.subscriptionType === "TEAM_OWNER"
                        ? "Team(Admin)"
                        : plan.subscriptionType === "TEAM_MEMBER"
                        ? "Team(Member)"
                        : plan.subscriptionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="bg-gray-100 text-info px-6 py-1 rounded-[76px] text-sm hover:bg-gray-200 transition-colors border border-[#99A6B8]">
                      View
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${
                        plan.status === "COMPLETED" ||
                        plan.status === "APPROVED"
                          ? "bg-green-100 text-green-800/40 border border-green-800/40"
                          : plan.status === "REJECTED"
                          ? "bg-red-100 text-red-800/40 border border-red-800/40"
                          : "bg-yellow-100 text-yellow-800/40 border border-yellow-800/40"
                      }`}
                    >
                      {plan.status === "COMPLETED"
                        ? "Completed"
                        : plan.status === "PENDING"
                        ? "In Review"
                        : plan.status === "REJECTED"
                        ? "Rejected"
                        : plan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/user-profile/${plan.user?.id}`}>
                      <button className="bg-gray-100 text-info px-6 py-1 rounded-[76px] text-sm hover:bg-gray-200 transition-colors border border-[#99A6B8]">
                        View
                      </button>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/generated-planfor-admin/${plan.id}`}>
                      <button className="text-primary hover:text-primary/80 font-medium underline">
                        View Plan
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span>{rowsPerPage} rows per page</span>
            <span>•</span>
            <span>
              {startIndex + 1}-{Math.min(endIndex, filteredPlans.length)} of{" "}
              {releasedPlansData?.data?.meta?.total || filteredPlans.length}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleasedPlansHistory;

"use client";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import Link from "next/link";
import DashboardLoading from "@/components/dashboard/soloDashboard/DashboardLoading";
import { toast } from "sonner";
import { HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineGroupAdd } from "react-icons/md";
import {
  useAdminPendingPlansQuery,
  usePlanReleasedMutation,
  useAdminGetSingleBusinessPlanQuery,
} from "@/redux/api/admin/adminAPI";
import { format } from "date-fns";
import useAuthUser from "@/hooks/useGetMe";
import PlanSlideModal from "@/components/common/PlanSlideModal";

const PendingPlans = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const rowsPerPage = 10;

  // Get current user info to check role
  const { user: currentUser, isLoading: userLoading } = useAuthUser();

  // Check if user has admin access
  const hasAdminAccess =
    currentUser?.role === "ADMIN" || currentUser?.role === "SUPERADMIN";

  const {
    data: pendingPlans,
    isLoading,
    error,
    refetch,
  } = useAdminPendingPlansQuery(
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
  const [planReleased] = usePlanReleasedMutation();

  // Fetch full plan data when a plan is selected
  const { data: fullPlanData, isLoading: isFullPlanLoading } =
    useAdminGetSingleBusinessPlanQuery(selectedPlanId!, {
      skip: !selectedPlanId,
    });

  const handleViewPresentation = (plan: any) => {
    console.log("Admin Dashboard Plan Data:", plan);
    setSelectedPlanId(plan.id);
    setSelectedPlan(plan);
    setIsSlideModalOpen(true);
  };

  const handleCloseSlideModal = () => {
    setIsSlideModalOpen(false);
    setSelectedPlan(null);
    setSelectedPlanId(null);
  };

  // Get plans data safely - try different possible data structures
  const plans =
    pendingPlans?.data?.plans ||
    pendingPlans?.data?.data ||
    pendingPlans?.plans ||
    pendingPlans?.data ||
    [];

  // Filter plans based on search term (only if search term exists)
  const filteredPlans = searchTerm
    ? plans.filter(
        (plan: any) =>
          plan.user?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          plan.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : plans;

  // Calculate pagination
  const totalPages =
    pendingPlans?.data?.pagination?.totalPages ||
    pendingPlans?.data?.meta?.totalPage ||
    1;
  const totalItems =
    pendingPlans?.data?.pagination?.total ||
    pendingPlans?.data?.meta?.total ||
    plans.length;
  const currentPlans = filteredPlans;

  const handleRelease = async (id: string) => {
    await planReleased(id).unwrap();
    refetch();
    toast.success("Business plan released successfully!");
  };

  // Show loading state while checking user role
  if (userLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Pending Plans
          </h1>
        </div>
        <DashboardLoading
          type="table"
          title="Loading User Information"
          message="Checking user permissions..."
        />
      </div>
    );
  }

  // Check if user has admin access
  if (!hasAdminAccess) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Access Denied
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Insufficient Permissions
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  You need ADMIN or SUPERADMIN role to access this page. Current
                  role: <strong>{currentUser?.role || "Unknown"}</strong>
                </p>
                <p className="mt-2">
                  Please contact your administrator if you believe this is an
                  error.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Pending Plans
          </h1>
        </div>
        <DashboardLoading
          type="table"
          title="Loading Pending Plans"
          message="Fetching pending business plans for review..."
        />
      </div>
    );
  }

  if (error) {
    // Check if it's a 403 Forbidden error
    const isForbidden = (error as any)?.status === 403;

    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Pending Plans
          </h1>
        </div>
        <div
          className={`border rounded-lg p-6 ${
            isForbidden
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className={`h-5 w-5 ${
                  isForbidden ? "text-red-400" : "text-yellow-400"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3
                className={`text-sm font-medium ${
                  isForbidden ? "text-red-800" : "text-yellow-800"
                }`}
              >
                {isForbidden
                  ? "Access Forbidden"
                  : "Error Loading Pending Plans"}
              </h3>
              <div
                className={`mt-2 text-sm ${
                  isForbidden ? "text-red-700" : "text-yellow-700"
                }`}
              >
                {isForbidden ? (
                  <>
                    <p>
                      You are not authorized to access this resource. This could
                      be due to:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Insufficient permissions</li>
                      <li>Token expiration</li>
                      <li>Role mismatch</li>
                    </ul>
                    <p className="mt-2">
                      Please try logging out and logging back in, or contact
                      your administrator.
                    </p>
                  </>
                ) : (
                  <p>Failed to load pending plans data. Please try again.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Pending Plans</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg ">
          <HiOutlineUserGroup className="w-8 h-8 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 my-2">
            Total Pending
          </h3>
          <p className="text-3xl font-bold text-primary">
            {pendingPlans?.data?.stats?.totalPending ||
              pendingPlans?.data?.totalPending ||
              plans.length ||
              0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg ">
          <CgProfile className="w-8 h-8 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 my-2">
            Individual Pending
          </h3>
          <p className="text-3xl font-bold text-primary">
            {pendingPlans?.data?.stats?.totalSoloPending ||
              pendingPlans?.data?.totalSoloPending ||
              plans.filter((p: any) => p.subscriptionType === "SOLO").length ||
              0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg ">
          <MdOutlineGroupAdd className="w-8 h-8 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 my-2">
            Team Pending
          </h3>
          <p className="text-3xl font-bold text-primary">
            {pendingPlans?.data?.stats?.totalTeamPending ||
              pendingPlans?.data?.totalTeamPending ||
              plans.filter((p: any) => p.subscriptionType === "TEAM_MEMBER")
                .length ||
              0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg ">
          <HiDocumentText className="w-8 h-8 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 my-2">
            Released Plan History
          </h3>
          <Link href="/admin/released-plans-history">
            <button className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer">
              View History
            </button>
          </Link>
        </div>
      </div>

      {/* Plans Section */}
      <div className="">
        <div className="flex items-center justify-between mb-4 gap-5">
          <h2 className="text-2xl md:text-[2rem] font-medium text-accent uppercase">
            Plans
          </h2>

          {/* Search Bar */}
          <div className="rounded-[41px] relative">
            <div className="bg-white rounded-[41px]">
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
                <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                  Presentation
                </th>
                <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                  Action 01
                </th>
                <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                  Action 02
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPlans && currentPlans.length > 0 ? (
                currentPlans.map((plan: any) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-accent text-[16px] font-normal">
                      {format(
                        new Date(plan.createdAt),
                        "hh:mm a - MMM dd, yyyy"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-accent text-[16px] font-normal">
                      {plan.user.firstName} {plan.user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-accent text-[16px] font-normal">
                        {plan.subscriptionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewPresentation(plan)}
                        className="text-info text-xs font-normal py-1 px-6 border border-info/50 rounded-full hover:bg-info/10 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plan.subscriptionType === "TEAM_MEMBER" ? (
                        <Link
                          href={`/admin/user-info/${plan.user.id}`}
                          className="text-info text-xs font-normal py-1 px-6 border border-info/50 rounded-full cursor-pointer"
                        >
                          View
                        </Link>
                      ) : (
                        <Link
                          href={`/admin/user-profile/${plan.user.id}`}
                          className="text-info text-xs font-normal py-1 px-6 border border-info/50 rounded-full cursor-pointer"
                        >
                          View
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/generated-planfor-admin/${plan.id}`}
                        className="text-primary underline info"
                      >
                        View Plan
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {plan.status === "COMPLETED" ? (
                        <button className="bg-primary cursor-pointer text-white px-3 py-1 rounded-md hover:bg-primary/80 transition-colors flex items-center gap-1">
                          Released
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRelease(plan.id)}
                          className="bg-primary cursor-pointer text-white px-3 py-1 rounded-md hover:bg-primary/80 transition-colors flex items-center gap-1"
                        >
                          Release
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Pending Plans Found
                        </h3>
                        <p className="text-gray-500">
                          There are currently no pending business plans for
                          review.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Showing {currentPlans.length} out of {totalItems}
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt; Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === pageNum
                        ? "bg-primary text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <>
                  <span className="px-2">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Slide Modal */}
      <PlanSlideModal
        isOpen={isSlideModalOpen}
        onClose={handleCloseSlideModal}
        plan={fullPlanData?.data || selectedPlan}
        isLoading={isFullPlanLoading}
      />
    </div>
  );
};

export default PendingPlans;

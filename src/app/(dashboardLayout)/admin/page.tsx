"use client";

import AdminDashboardHeader from "@/components/dashboard/adminDashboard/AdminDashboardHeader";
import AdminSummaryCards from "@/components/dashboard/adminDashboard/AdminSummaryCards";
import AdminRevenueChart from "@/components/dashboard/adminDashboard/AdminRevenueChart";
import AdminGrowthChart from "@/components/dashboard/adminDashboard/AdminGrowthChart";
import AdminPlanDetails from "@/components/dashboard/adminDashboard/AdminPlanDetails";
import { useAdminSummaryQuery } from "@/redux/api/admin/adminAPI";
import AdminDashboardLoading from "@/components/dashboard/adminDashboard/AdminDashboardLoading";

export default function AdminDashboardPage() {
  const {
    data: adminSummary,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAdminSummaryQuery({});

  if (isLoading || isFetching) {
    return (
      <div className="space-y-6">
        <AdminDashboardHeader />
        <AdminDashboardLoading
          type="summary"
          title="Loading Admin Dashboard"
          message="Gathering analytics and user statistics..."
        />
      </div>
    );
  }

  if (error) {
    // Handle different error types from RTK Query
    const errorStatus = "status" in error ? error.status : "Unknown";
    const errorMessage =
      "message" in error ? error.message : "No message available";
    const errorData = "data" in error ? error.data : "No data available";

    console.error("Error details:", {
      status: errorStatus,
      data: errorData,
      message: errorMessage,
    });

    return (
      <div className="space-y-6">
        <AdminDashboardHeader />
        <AdminDashboardLoading
          type="summary"
          title="Error Loading Dashboard"
          message="Failed to load admin dashboard data. Please try again."
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Error Details
          </h2>
          <div className="bg-red-100 p-3 rounded text-sm mb-4">
            <p>
              <strong>Error Status:</strong> {errorStatus}
            </p>
            <p>
              <strong>Error Message:</strong> {errorMessage}
            </p>
            <p>
              <strong>Error Data:</strong> {JSON.stringify(errorData, null, 2)}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Retry API Call
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Transform API data to match frontend component expectations
  const transformApiData = (apiData: any) => {
    if (!apiData) return null;

    const { cards, revenue, growth, currentPlans } = apiData;

    // Transform cards data - pass direct object instead of array
    const transformedCards = {
      totalRegisteredUsers: cards?.totalRegisteredUsers || 0,
      soloPlanUsers: cards?.soloPlanUsers || 0,
      teamPlanUsers: cards?.teamPlanUsers || 0,
      totalPlanGenerated: cards?.totalPlanGenerated || 0,
    };

    // Transform current plans data
    const transformedCurrentPlans = {
      solo: {
        name: "Solo Plan",
        price: 15,
        users: cards?.soloPlanUsers || 0,
      },
      team: {
        name: "Team Plan",
        price: 25,
        users: cards?.teamPlanUsers || 0,
      },
    };

    return {
      data: {
        revenue: {
          year: revenue?.year || new Date().getFullYear(),
          soloMonthly: revenue?.soloMonthly || Array(12).fill(0),
          teamMonthly: revenue?.teamMonthly || Array(12).fill(0),
        },
        growth: {
          overallPct: `${growth?.overallPct || 0}%`,
          soloUsersPct: `${growth?.soloUsersPct >= 0 ? "+" : ""}${
            growth?.soloUsersPct || 0
          }`,
          teamUsersPct: `${growth?.teamUsersPct >= 0 ? "+" : ""}${
            growth?.teamUsersPct || 0
          }`,
        },
        cards: transformedCards,
        currentPlans: transformedCurrentPlans,
      },
    };
  };

  // Use API data if available, otherwise use fallback data
  const dashboardData = adminSummary?.data
    ? transformApiData(adminSummary.data)
    : {
        data: {
          revenue: {
            year: new Date().getFullYear(),
            soloMonthly: Array(12).fill(0),
            teamMonthly: Array(12).fill(0),
          },
          growth: {
            overallPct: "0%",
            soloUsersPct: "+0",
            teamUsersPct: "+0",
          },
          cards: {
            totalRegisteredUsers: 0,
            soloPlanUsers: 0,
            teamPlanUsers: 0,
            totalPlanGenerated: 0,
          },
          currentPlans: {
            solo: { name: "Solo Plan", price: 15, users: 0 },
            team: { name: "Team Plan", price: 25, users: 0 },
          },
        },
      };

  // Ensure dashboardData is never null
  const safeDashboardData = dashboardData || {
    data: {
      revenue: {
        year: new Date().getFullYear(),
        soloMonthly: Array(12).fill(0),
        teamMonthly: Array(12).fill(0),
      },
      growth: {
        overallPct: "0%",
        soloUsersPct: "+0",
        teamUsersPct: "+0",
      },
      cards: {
        totalRegisteredUsers: 0,
        soloPlanUsers: 0,
        teamPlanUsers: 0,
        totalPlanGenerated: 0,
      },
      currentPlans: {
        solo: { name: "Solo Plan", price: 15, users: 0 },
        team: { name: "Team Plan", price: 25, users: 0 },
      },
    },
  };

  // Debug: Log the API response to understand data structure
  console.log("Admin Summary API Response:", adminSummary);
  console.log("Revenue Data:", adminSummary?.data?.revenue);
  console.log("Growth Data:", adminSummary?.data?.growth);
  console.log("Using Data:", safeDashboardData);

  return (
    <div className="space-y-6">
      <AdminDashboardHeader />
      <div className="">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 px-4 lg:px-6">
          Overview
        </h2>

        <div className="space-y-6">
          <AdminSummaryCards cardInfo={safeDashboardData.data?.cards} />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-6 md:gap-x-5 px-4 lg:px-6">
            <div className="col-span-3">
              <AdminRevenueChart chartData={safeDashboardData.data?.revenue} />
            </div>
            <div className="col-span-1">
              <AdminGrowthChart growth={safeDashboardData.data?.growth} />
            </div>
          </div>
          <AdminPlanDetails planData={safeDashboardData.data?.currentPlans} />
        </div>
      </div>
    </div>
  );
}

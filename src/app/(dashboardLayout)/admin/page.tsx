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

  // Mock data for testing (remove when real API data is available)
  const mockData = {
    data: {
      revenue: {
        year: 2025,
        soloMonthly: [0, 0, 0, 0, 0, 0, 500, 2000, 0, 0, 0, 0], // Solo revenue for each month
        teamMonthly: [0, 0, 0, 0, 0, 0, 800, 3000, 0, 0, 0, 0], // Team revenue for each month
      },
      growth: {
        overallPct: "100%",
        soloUsersPct: "+100",
        teamUsersPct: "-100",
      },
      cards: [
        { title: "Total Users", value: "1,234", change: "+12%" },
        { title: "Revenue", value: "€45,678", change: "+8%" },
        { title: "Active Plans", value: "89", change: "+5%" },
        { title: "Conversion Rate", value: "23%", change: "+2%" },
      ],
      currentPlans: {
        solo: { name: "Solo Plan", price: 15, users: 45 },
        team: { name: "Team Plan", price: 25, users: 23 },
      },
    },
  };

  // Use API data if available, otherwise use mock data
  const dashboardData = adminSummary?.data ? adminSummary : mockData;

  // Debug: Log the API response to understand data structure
  console.log("Admin Summary API Response:", adminSummary);
  console.log("Revenue Data:", adminSummary?.data?.revenue);
  console.log("Growth Data:", adminSummary?.data?.growth);
  console.log("Using Data:", dashboardData);

  return (
    <div className="space-y-6">
      <AdminDashboardHeader />
      <div className="">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 px-4 lg:px-6">Overview</h2>

        <div className="space-y-6">
          <AdminSummaryCards cardInfo={dashboardData.data?.cards} />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-6 md:gap-x-5 px-4 lg:px-6">
            <div className="col-span-3">
              <AdminRevenueChart chartData={dashboardData.data?.revenue} />
            </div>
            <div className="col-span-1">
              <AdminGrowthChart growth={dashboardData.data?.growth} />
            </div>
          </div>
          <AdminPlanDetails planData={dashboardData.data?.currentPlans} />
        </div>
      </div>
    </div>
  );
}

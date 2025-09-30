"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleBusinessPlanQuery } from "@/redux/api/businessPlan/businessPlanApi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Loading from "@/components/Others/Loading";
import EditBusinessPlan from "@/components/dashboard/EditBusinessPlan";

export default function EditBusinessPlanPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    data: planData,
    isLoading,
    error,
  } = useGetSingleBusinessPlanQuery(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !planData?.data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Error Loading Plan
            </h2>
            <p className="text-gray-600">Failed to load business plan data.</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleUpdate = async (updatedData: any) => {
    // API call is now handled in EditBusinessPlan component
    // This function is called after successful update

    // Redirect to dashboard after successful update
    router.push("/dashboard");
  };

  return (
    <DashboardLayout>
      <div className="relative">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors z-10"
        >
          Back to Dashboard
        </button>

        <EditBusinessPlan
          planData={planData.data}
          onUpdate={handleUpdate}
          isLoading={false}
        />
      </div>
    </DashboardLayout>
  );
}

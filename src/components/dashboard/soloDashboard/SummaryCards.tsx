"use client";

import { useGetMyBusinessPlanSummeryQuery } from "@/redux/api/businessPlan/businessPlanApi";
import { BsFileText, BsCheckCircle, BsSearch, BsClock } from "react-icons/bs";
import DashboardLoading from "./DashboardLoading";

interface SummaryCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const SummaryCard = ({ title, count, icon, color }: SummaryCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg ">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{count}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );
};

export default function SummaryCards() {
  const { data, isLoading, error } = useGetMyBusinessPlanSummeryQuery({});

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-4 md:px-6 lg:px-6">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white p-6 rounded-lg ">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state only for account not accepted
  if (
    error &&
    (error as any)?.data?.message === "Your account is not accepted yet!"
  ) {
    return (
      <div className="mb-8 px-4 md:px-6 lg:px-6">
        <div className="bg-white p-8 rounded-lg border border-red-100">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Account Pending Approval
              </h3>
              <p className="text-gray-500">Your account is not accepted yet!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Plans Generated",
      count: data?.data?.totalPlans || 0,
      icon: <BsFileText className="text-2xl text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Plans Completed",
      count: data?.data?.completedPlans || 0,
      icon: <BsCheckCircle className="text-2xl text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "Plans Reviewed again",
      count: data?.data?.incompletedPlans || 0,
      icon: <BsSearch className="text-2xl text-purple-600" />,
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-4 md:px-6 lg:px-6">
      {cards.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  );
}

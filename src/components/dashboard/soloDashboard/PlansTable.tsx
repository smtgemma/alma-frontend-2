"use client";

import { useGetMyBusinessPlanQuery } from "@/redux/api/businessPlan/businessPlanApi";
import { useState } from "react";
import { BsSearch, BsPlus } from "react-icons/bs";
import { format } from "date-fns";
import Link from "next/link";
import DashboardLoading from "./DashboardLoading";
import PlanSlideModal from "@/components/common/PlanSlideModal";
import useAuthUser from "@/hooks/useGetMe";

interface Plan {
  id: string;
  dateTime: string;
  planName: string;
  status: "completed" | "in-review" | "pending";
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    COMPLETED: {
      text: "COMPLETATO",
      color: "bg-green-100 text-green-800/40 border border-green-800/40",
    },
    INCOMPLETED: {
      text: "INCOMPLETO",
      color: "bg-red-100 text-red-800/40 border border-red-800/40",
    },
    // COMPLETED: { text: 'Pending', color: 'bg-orange-100 text-orange-800/40 border border-orange-800/40' }
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${config?.color}`}
    >
      {config?.text}
    </span>
  );
};

export default function PlansTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const { data, isLoading, error } = useGetMyBusinessPlanQuery({});
  const { user } = useAuthUser();
  // Show loading state
  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-6">
        {/* Header skeleton */}
        <div className="pb-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="h-10 bg-gray-200 rounded-full animate-pulse w-48"></div>
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-40"></div>
            </div>
          </div>
        </div>

        {/* Table skeleton */}
        <div className="overflow-x-auto bg-[#F2F3F4] mt-6">
          <div className="bg-[#475466] px-6 py-3">
            <div className="flex space-x-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-300 rounded animate-pulse w-20"
                ></div>
              ))}
            </div>
          </div>
          <div className="bg-white">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="px-6 py-4 border-b border-gray-200">
                <div className="flex space-x-6">
                  {[1, 2, 3, 4, 5].map((cell) => (
                    <div
                      key={cell}
                      className="h-4 bg-gray-200 rounded animate-pulse w-24"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  console.log(
    "data business",
    data?.data?.data?.map((plan: any) => plan?.executiveSummary?.slice(0, 20)),
  );

  // const filteredPlans = data?.data?.data?.filter((plan: any) =>
  //   plan?.executiveSummary.toLowerCase().includes(searchTerm.toLowerCase()),
  // );

  const handleViewPresentation = (plan: any) => {
    console.log("User Dashboard Plan Data:", plan);
    setSelectedPlan(plan);
    setIsSlideModalOpen(true);
  };

  const handleCloseSlideModal = () => {
    setIsSlideModalOpen(false);
    setSelectedPlan(null);
  };

  const totalPages = data?.data?.meta.totalPage;
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentPlans = filteredPlans.slice(startIndex, endIndex);

  // Show error state only for account not accepted
  if (
    error &&
    (error as any)?.data?.message === "Your account is not accepted yet!"
  ) {
    return (
      <div className="px-4 md:px-6 lg:px-6">
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
                Account in Attesa di Approvazione
              </h3>
              <p className="text-gray-500">
                Il tuo account non è ancora stato accettato!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" px-4 md:px-6 lg:px-6">
      {/* Header */}
      <div className="pb-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-[2rem] font-medium text-accent">
            Piani Generati
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-0">
            <div className="relative">
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-[41px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Link
              href={`/ai-smart-form`}
              className=" text-white px-6 py-2 rounded-[10px] flex items-center gap-2 bg-primary transition-colors"
            >
              <BsPlus className="text-2xl text-white" />
              Genera Nuovo Piano
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#F2F3F4]">
        <table className="w-full">
          <thead className="bg-[#475466] ">
            <tr>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Data e Ora
              </th>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Nome Piano
              </th>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Presentazione
              </th>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Azione
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data?.data && data?.data?.data?.length > 0 ? (
              data?.data?.data?.map((plan: any) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-accent text-[16px] font-normal">
                    {format(new Date(plan.createdAt), "hh:mm a - MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-accent text-[16px] font-normal">
                    {plan?.executiveSummary?.slice(0, 60) + "..."}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewPresentation(plan)}
                        className="bg-gray-100 text-info px-6 py-1 rounded-[76px] text-xs hover:bg-gray-200 transition-colors border border-[#99A6B8] cursor-pointer"
                      >
                        Visualizza
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs whitespace-nowrap">
                    {getStatusBadge(plan.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      // Check if user is USER role with INCOMPLETED plan and SOLO/TEAM subscription
                      const isUserRole = user?.role === "USER";
                      const isIncompleted = plan.status === "INCOMPLETED";
                      const isRestrictedSubscription = [
                        "SOLO",
                        "TEAM_OWNER",
                        "TEAM_MEMBER",
                      ].includes(plan.subscriptionType);
                      const shouldDisable =
                        isUserRole && isIncompleted && isRestrictedSubscription;

                      if (shouldDisable) {
                        return (
                          <span
                            className="text-gray-400 cursor-not-allowed text-base font-medium"
                            title="Il piano deve essere completato prima di poter visualizzare i dettagli"
                          >
                            Visualizza piano
                          </span>
                        );
                      }

                      return (
                        <Link
                          href={`/approved-ai-plan/${plan.id}`}
                          className="text-primary/80 underline hover:text-primary text-base font-medium"
                        >
                          Visualizza piano
                        </Link>
                      );
                    })()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
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
                        Nessun Dato Trovato
                      </h3>
                      {/* <p className="text-gray-500 mb-4">You haven't generated any business plans yet.</p>
                      <Link href="/ai-smart-form" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        <BsPlus className="text-lg" />
                        Generate Your First Plan
                      </Link> */}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 ">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Mostrando {data?.data?.meta.total} di {data?.data?.meta.limit}
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt; Precedente
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
              Successivo &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Plan Slide Modal */}
      <PlanSlideModal
        isOpen={isSlideModalOpen}
        onClose={handleCloseSlideModal}
        plan={selectedPlan}
      />
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { SuspendUserModal } from "../SuspendUserModal";
import {
  useAdminGetSingleBusinessPlanQuery,
  useSubscriptionDetailsQuery,
  useUserSuspendMutation,
} from "@/redux/api/admin/adminAPI";
import Loading from "@/components/Others/Loading";
import { format } from "date-fns";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import PlanSlideModal from "@/components/common/PlanSlideModal";
// src/components/dashboard/adminDashboard/UserProfile.tsx
const UserProfile = ({ id }: { id: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const { data: subscriptionDetails, isLoading } =
    useSubscriptionDetailsQuery(id);
  const [suspendUser] = useUserSuspendMutation();

  // Fetch full plan data when a plan is selected
  const { data: fullPlanData, isLoading: isFullPlanLoading } =
    useAdminGetSingleBusinessPlanQuery(selectedPlanId || "", {
      skip: !selectedPlanId,
    });

  if (isLoading) {
    return <Loading />;
  }

  if (!subscriptionDetails || !subscriptionDetails.data) {
    return <p className="">Nessun dettaglio di abbonamento trovato.</p>;
  }

  const {
    subscriptionType,
    memberSince,
    totalPlansGenerated,
    totalTeamMembers,
    planExpireDate,
    generatedPlans,
    teamInfo,
    user,
  } = subscriptionDetails.data;
  console.log(subscriptionDetails.data);

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

  // Filter plans based on search term
  const filteredPlans = generatedPlans.filter(
    (plan: any) =>
      plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPlans = filteredPlans.slice(startIndex, endIndex);
  console.log(currentPlans);

  const handleSuspendUser = () => {
    setIsSuspendModalOpen(true);
  };

  const handleConfirmSuspend = async (id: string, status: string) => {
    const res = await suspendUser({ id, body: { status } });
    // Check response success
    if (res.data?.success) {
      toast.success(res.data.message || "Utente sospeso con successo!");
      setIsSuspendModalOpen(false);
    } else {
      toast.error(res.data?.message || "Impossibile sospendere l'utente!");
    }

    // console.log(`Suspending user: ${user.firstName} ${user.lastName}`);
    // setIsSuspendModalOpen(false);
  };

  const handleCloseSuspendModal = () => {
    setIsSuspendModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary ">
          Profilo Utente
        </h1>
      </div>

      {/* User Profile Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 w-full lg:w-auto">
            {/* Profile Picture */}
            <div className="w-20 h-20 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image
                src={user.image ? user.image : "/images/placeholderProfile.jpg"}
                alt={`${user.firstName}`}
                className="w-full h-full object-cover"
                width={96}
                height={96}
              />
            </div>

            {/* User Details */}
            <div className="space-y-1 sm:space-y-2 text-center sm:text-left flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-primary break-words">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg break-all">
                {user.email}
              </p>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                {user.location || "N/A"}
              </p>
            </div>
          </div>

          {/* Suspend User Button */}
          <div className="w-full sm:w-auto flex justify-center lg:justify-end">
            <button
              onClick={handleSuspendUser}
              className="w-full sm:w-auto border cursor-pointer border-red-500 text-red-500 px-4 py-2 text-sm sm:text-base rounded-md hover:bg-red-50 transition-colors min-w-[120px]"
            >
              {user.status === "BLOCKED" ? "Sblocca Utente" : "Blocca Utente"}
            </button>
          </div>
        </div>

        {/* User Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 p-3 sm:p-4 rounded-lg min-h-[80px] sm:min-h-[100px]">
            <h3 className="text-sm md:text-base font-medium text-accent mb-1 sm:mb-0 flex-shrink-0 ">
              Tipo di Abbonamento
            </h3>
            <div className="hidden sm:block w-px h-8 lg:h-12 bg-gray-300 mx-2 lg:mx-4"></div>
            <p className="text-base sm:text-lg lg:text-xl font-medium text-primary break-words text-right sm:text-left">
              {subscriptionType ? subscriptionType : "N/A"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 p-3 sm:p-4 rounded-lg min-h-[80px] sm:min-h-[100px]">
            <h3 className="text-sm md:text-base font-medium text-accent mb-1 sm:mb-0 flex-shrink-0 ">
              Membro Dal
            </h3>
            <div className="hidden sm:block w-px h-8 lg:h-12 bg-gray-300 mx-2 lg:mx-4"></div>
            <p className="text-base sm:text-lg lg:text-xl font-medium text-primary break-words text-right sm:text-left">
              {format(new Date(memberSince), "MMM dd, yyyy")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 p-3 sm:p-4 rounded-lg min-h-[80px] sm:min-h-[100px]">
            <h3 className="text-sm md:text-base font-medium text-accent mb-1 sm:mb-0 flex-shrink-0 ">
              Totale Piani Generati
            </h3>
            <div className="hidden sm:block w-px h-8 lg:h-12 bg-gray-300 mx-2 lg:mx-4"></div>
            <p className="text-xl sm:text-[1.4rem] lg:text-[2rem] font-medium text-primary text-right sm:text-left">
              {totalPlansGenerated}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 p-3 sm:p-4 rounded-lg min-h-[80px] sm:min-h-[100px]">
            <h3 className="text-sm md:text-base font-medium text-accent mb-1 sm:mb-0 flex-shrink-0 ">
              Membri del Team
            </h3>
            <div className="hidden sm:block w-px h-8 lg:h-12 bg-gray-300 mx-2 lg:mx-4"></div>
            <p className="text-xl sm:text-[1.4rem] lg:text-[2rem] font-medium text-primary text-right sm:text-left">
              {totalTeamMembers}
            </p>
          </div>

          {subscriptionType === "TEAM" && planExpireDate && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 p-3 sm:p-4 rounded-lg min-h-[80px] sm:min-h-[100px]">
              <h3 className="text-sm md:text-base font-medium text-accent mb-1 sm:mb-0 flex-shrink-0 ">
                Validità del Piano
              </h3>
              <div className="hidden sm:block w-px h-8 lg:h-12 bg-gray-300 mx-2 lg:mx-4"></div>
              <p className="text-base sm:text-xl lg:text-2xl font-medium text-primary break-words text-right sm:text-left">
                {format(new Date(planExpireDate), "MMM dd, yyyy")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generated Plans Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-accent ">
              Piani Generati
            </h2>
          </div>

          {/* Search Bar */}
          <div className="w-full sm:w-auto sm:min-w-[250px] lg:min-w-[300px]">
            <div className="bg-white relative">
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Cerca piani..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-[41px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="min-w-[600px]">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-[#475466]">
                <tr>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm md:text-base lg:text-lg font-medium text-white uppercase tracking-wider whitespace-nowrap">
                    Data
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm md:text-base lg:text-lg font-medium text-white uppercase tracking-wider whitespace-nowrap">
                    Nome Piano
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm md:text-base lg:text-lg font-medium text-white uppercase tracking-wider whitespace-nowrap">
                    Presentazione
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm md:text-base lg:text-lg font-medium text-white uppercase tracking-wider whitespace-nowrap">
                    Stato
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm md:text-base lg:text-lg font-medium text-white uppercase tracking-wider whitespace-nowrap">
                    Azione
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPlans.map((plan: any) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm lg:text-base text-accent font-normal whitespace-nowrap">
                      {format(
                        new Date(plan.createdAt),
                        "hh:mm a - MMM dd, yyyy"
                      )}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm lg:text-base text-accent font-normal">
                      <div className="min-w-[150px] max-w-[250px]">
                        <div className="truncate" title={plan.planName}>
                          {plan.planName.length > 40
                            ? plan.planName.slice(0, 40) + "..."
                            : plan.planName}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewPresentation(plan)}
                        className="bg-gray-100 text-info px-4 lg:px-6 py-1 rounded-[76px] text-xs sm:text-sm hover:bg-gray-200 transition-colors border border-[#99A6B8] cursor-pointer"
                      >
                        <span className="">Visualizza</span>
                      </button>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${
                          plan.status === "COMPLETED"
                            ? "bg-green-100 text-green-800/40 border border-green-800/40"
                            : "bg-red-100 text-red-800/40 border border-red-800/40"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </td>
                    {/* <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <button className="text-primary hover:text-primary/80 font-medium text-xs sm:text-sm lg:text-base">
                        View Plan
                      </button>
                    </td> */}
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <Link
                        href={`/generated-planfor-admin/${plan.id}`}
                        className="text-primary hover:text-primary/80 font-medium underline text-xs sm:text-sm lg:text-base"
                      >
                        <span className="">Visualizza Piano</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile scroll indicator */}
          <div className="sm:hidden mt-2 text-xs text-gray-500 text-center">
            ← Scorri orizzontalmente per vedere di più →
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="pb-8 ">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Mostrando {currentPlans.length} di {filteredPlans.length}
            </span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
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
              &lt; <span className="">Precedente</span>
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
              <span className="">Successivo</span> &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Suspend User Modal */}
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        onClose={handleCloseSuspendModal}
        onConfirm={() =>
          handleConfirmSuspend(
            user.id,
            user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"
          )
        }
        userName={`${user.firstName} ${user.lastName}`}
      />

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

export default UserProfile;

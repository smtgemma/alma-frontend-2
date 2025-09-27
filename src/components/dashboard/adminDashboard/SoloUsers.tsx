"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { SuspendUserModal } from "../SuspendUserModal";
import { HiOutlineUserGroup } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useSoloAnalyticsQuery } from "@/redux/api/admin/adminAPI";
import DashboardLoading from "@/components/dashboard/soloDashboard/DashboardLoading";
import { format } from "date-fns";

const SoloUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // 🔹 Call API with pagination + search params
  const {
    data: soloAnalyticsData,
    isLoading,
    error,
  } = useSoloAnalyticsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Utenti Solo</h1>
        </div>
        <DashboardLoading
          type="table"
          title="Caricamento Utenti Solo"
          message="Recupero analisi utenti e dati dei piani..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Utenti Solo</h1>
        </div>
        <DashboardLoading
          type="table"
          title="Errore nel Caricamento degli Utenti Solo"
          message="Impossibile caricare i dati degli utenti solo. Si prega di riprovare."
        />
      </div>
    );
  }

  const { stats, plans = [], pagination } = soloAnalyticsData?.data || {};

  const summaryData = [
    {
      title: "Totale Utenti Piano Solo",
      value: stats?.totalUsers || 0,
      icon: <HiOutlineUserGroup className="w-8 h-8 text-primary" />,
      bgColor: "bg-white",
      textColor: "text-blue-600",
    },
    {
      title: "Totale Piani Solo Generati",
      value: stats?.totalPlansGenerated || 0,
      icon: <CgProfile className="w-8 h-8 text-primary" />,
      bgColor: "bg-white",
      textColor: "text-green-600",
    },
    {
      title: "Ricavi Totali Piano Solo",
      value: stats?.totalRevenue || 0,
      icon: <MdOutlineGroupAdd className="w-8 h-8 text-primary" />,
      bgColor: "bg-white",
      textColor: "text-purple-600",
    },
  ];

  const totalPages = pagination?.totalPages || 1;

  const handleSuspendUser = (user: { id: string; name: string }) => {
    setSelectedUser(user);
    setIsSuspendModalOpen(true);
  };

  const handleConfirmSuspend = () => {
    if (selectedUser) {
      console.log(
        `Suspending user: ${selectedUser.name} (ID: ${selectedUser.id})`
      );
      // API call to suspend here
    }
    setIsSuspendModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseSuspendModal = () => {
    setIsSuspendModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6 px-4 lg:px-6 py-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Utenti Solo</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryData.map((card, index) => (
          <div key={index} className={`${card.bgColor} p-6 rounded-lg `}>
            <div className="flex items-center justify-between">
              <div>
                <div className={card.textColor}>{card.icon}</div>
                <p className="text-base font-medium text-accent mt-4 mb-2">
                  {card.title}
                </p>
                <p className="text-[28px] font-normal text-accent ">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-medium text-accent">
            Piani Generati
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative rounded-[41px]">
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca piani..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to page 1 when searching
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-[41px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#475466]">
              <tr>
                <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  Data e Ora
                </th>
                <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  Nome Piano
                </th>
                <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  Nome Utente
                </th>
                <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  Profilo
                </th>
                <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  Azione
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans?.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-base text-accent font-normal">
                    {format(new Date(user.updatedAt), "hh:mm a - MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-accent font-normal">
                    {user.name?.slice(0, 40) + "..."}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-accent font-normal">
                    {user.user.firstName} {user.user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    <Link href={`/admin/user-profile/${user.user.id}`}>
                      <button className="px-3 cursor-pointer py-1 text-sm border border-gray-300 rounded-[41px] bg-gray-100 hover:bg-gray-200 text-gray-700">
                        Visualizza
                      </button>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                        user.status == "INCOMPLETED"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : user.status === "COMPLETED"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/generated-planfor-admin/${user.id}`}
                      className="text-primary underline info"
                    >
                      Visualizza Piano
                    </Link>
                  </td>
                </tr>
              ))}

              {plans?.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nessun piano trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Mostrando {plans.length} di {pagination?.total || 0}
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset to first page
              }}
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

      {/* Suspend User Modal */}
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        onClose={handleCloseSuspendModal}
        onConfirm={handleConfirmSuspend}
        userName={selectedUser?.name}
      />
    </div>
  );
};

export default SoloUsers;

"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { SuspendUserModal } from "../SuspendUserModal";
import { HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineGroupAdd } from "react-icons/md";
import {
  useAllReviewGetQuery,
  useReviewStatsQuery,
} from "@/redux/api/admin/adminAPI";
import { useUpdateReviewStatusMutation } from "@/redux/api/expertReview/expertReviewApi";
import { toast } from "sonner";
import { format } from "date-fns";

const ExpertReview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: allReviews, isLoading, refetch } = useAllReviewGetQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || "",
  });
  const reviews = allReviews?.data || [];
  const meta = allReviews?.meta;
  const totalPages = meta ? meta.totalPage : 1;

  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { data: reviewStats } = useReviewStatsQuery({});
  const [updateReviewStatus, { isLoading: updatingStatus }] =
    useUpdateReviewStatusMutation();
  const STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      const res = await updateReviewStatus({
        reviewId,
        status: newStatus.toUpperCase(),
      }).unwrap();
      toast.success((res as any)?.message || "Stato aggiornato con successo");
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Aggiornamento dello stato non riuscito"
      );
    }
  };

  console.log("reviewStats", reviewStats);
  useEffect(() => {
    const delay = setTimeout(() => {
      setCurrentPage(1); // reset to page 1 on search
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const summaryData = [
    {
      title: "Totale Revisioni Richieste",
      value: reviewStats?.data?.totalReviews || 0,
      icon: <HiOutlineUserGroup className="w-8 h-8 text-primary" />,
      bgColor: "bg-white",
      textColor: "text-blue-600",
    },
    {
      title: "Revisioni Esperto Piano Solo Richieste",
      value: reviewStats?.data?.soloReviews || 0,
      icon: <CgProfile className="w-8 h-8 text-primary" />,
      bgColor: "bg-white",
      textColor: "text-green-600",
    },
    {
      title: "Revisioni Esperto Piano Team Richieste",
      value: reviewStats?.data?.teamReviews || 0,
      icon: <MdOutlineGroupAdd className="w-8 h-8 text-primary" />,
      bgColor: "bg-white",
      textColor: "text-purple-600",
    },
  ];

  const handleSuspendUser = (user: { id: string; name: string }) => {
    setSelectedUser(user);
    setIsSuspendModalOpen(true);
  };

  const handleConfirmSuspend = () => {
    if (selectedUser) {
      // Here you would typically make an API call to suspend the user
      console.log(
        `Suspending user: ${selectedUser.name} (ID: ${selectedUser.id})`
      );
      // You can add your API call here
      // await suspendUser(selectedUser.id);
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
        <h1 className="text-2xl font-semibold text-gray-900">
          Revisione Esperto
        </h1>
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
        <div className="">
          <h2 className="text-xl md:text-2xl font-medium text-accent">
            Richieste di Revisione Esperto
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="bg-white rounded-[41px]">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca piani..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-[41px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
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
                {/* <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  Send Email
                </th> */}
                <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  Visualizza
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review: any) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-base text-accent font-normal">
                    {format(
                      new Date(review.createdAt),
                      "hh:mm a - MMM dd, yyyy"
                    )}
                    <br />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-accent font-normal">
                    {review.plan?.subscriptionType || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-accent font-normal">
                    {review.user?.firstName} {review.user?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link href={`/admin/user-profile/${review.user?.id}`}>
                      <button className="px-3 cursor-pointer py-1 text-sm border border-gray-300 rounded-[41px] bg-gray-100 hover:bg-gray-200 text-gray-700">
                        Visualizza
                      </button>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={review.status}
                      onChange={(e) =>
                        handleStatusChange(review.id, e.target.value)
                      }
                      disabled={updatingStatus}
                      className={`px-2 py-1 text-xs font-semibold rounded-full border focus:outline-none cursor-pointer ${
                        review.status === "PENDING"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : review.status === "REJECTED"
                          ? "bg-orange-100 text-orange-800 border-orange-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="text-black">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${
                        review.user?.email
                      }&su=${encodeURIComponent(
                        "Business Plan Review"
                      )}&body=${encodeURIComponent(
                        `Hello ${review.user?.firstName},

We would like to discuss your business plan. Please review the details and get back to us.

Best regards,
- Almamuzhaqi`
                      )}`}
                      target="_blank"
                    >
                      <button className="px-3 cursor-pointer py-1 text-sm border border-gray-300 rounded-[41px] bg-gray-100 hover:bg-gray-200 text-gray-700">
                        Send
                      </button>
                    </Link>
                  </td> */}

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/generated-planfor-admin/${review.plan?.id}?from=expert-review`}
                      className="text-primary underline info"
                    >
                      Visualizza Piano
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Mostrando pagina {meta?.page} di {meta?.totalPage}, totale{" "}
              {meta?.total} revisioni
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
              &lt; Precedente
            </button>
            {Array.from({ length: totalPages }, (_, i) => {
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

export default ExpertReview;

"use client";
import {
  useSubscriptionDetailsQuery,
  useUserSuspendMutation,
} from "@/redux/api/admin/adminAPI";
import React, { useState } from "react";
import { toast } from "sonner";
import { SuspendUserModal } from "../SuspendUserModal";
import Loading from "@/components/Others/Loading";
import { format } from "date-fns";
// src/components/dashboard/adminDashboard/UserInfo.tsx
const UserInfo = ({ id }: { id: string }) => {
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const { data: subscriptionDetails, isLoading } =
    useSubscriptionDetailsQuery(id);
  const [suspendUser] = useUserSuspendMutation();

  if (isLoading) {
    return <Loading />;
  }
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
  const handleSuspendUser = () => {
    setIsSuspendModalOpen(true);
  };
  const handleCloseSuspendModal = () => {
    setIsSuspendModalOpen(false);
  };

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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className=" ">
          <h1 className="text-2xl font-semibold text-gray-900 ">
            Informazioni Utente
          </h1>
          <p className="text-gray-600 ">
            Questo profilo appartiene a un membro di un utente del piano team.
          </p>
        </div>
        <div>
          <button
            onClick={handleSuspendUser}
            className="border cursor-pointer border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
          >
            {"BLOCKED" == "BLOCKED" ? "Sblocca Utente" : "Blocca Utente"}
          </button>
        </div>
      </div>
      {/* User Info Section */}
      <div className="bg-white max-w-[1000px] mx-auto rounded-lg  md:p-12 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              <img
                src={user.image ? user.image : "/images/placeholderProfile.jpg"}
                alt="Profilo Utente"
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{user.location || "N/A"}</p>
            </div>
          </div>

          {/* Suspend User Button */}
        </div>

        {/* Description */}

        {/* User Information List */}
        <div className="mt-8 space-y-4">
          <div className=" border-t border-gray-200 ">
            <div className="space-y-6">
              <div className="flex justify-between items-center py-2 pt-8">
                <span className="text-base font-medium text-gray-600 ">
                  Nome Utente
                </span>
                <span className="text-[20px] text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 ">
                <span className="text-base font-medium text-gray-600 ">
                  Email Utente
                </span>
                <span className="text-[20px] text-gray-900">{user.email}</span>
              </div>

              {/* <div className="flex justify-between items-center py-2 ">
                <span className="text-base font-medium text-gray-600">
                  Member No
                </span>
                <span className="text-[20px] text-gray-900">01</span>
              </div> */}

              <div className="flex justify-between items-center py-2 ">
                <span className="text-base font-medium text-gray-600 ">
                  Nome Amministratore
                </span>
                <span className="text-[20px] text-primary underline">
                  {teamInfo?.owner.firstName}
                  {teamInfo?.owner.lastName}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 ">
                <span className="text-base font-medium text-gray-600 ">
                  Email Amministratore
                </span>
                <span className="text-[20px] text-primary underline">
                  {teamInfo?.owner.email}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 ">
                <span className="text-base font-medium text-gray-600 ">
                  Posizione
                </span>
                <span className="text-[20px] text-primary underline">
                  {teamInfo?.owner.location || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 ">
                <span className="text-base font-medium text-gray-600 ">
                  Data di Iscrizione
                </span>
                <span className="text-[20px] text-primary underline">
                  {format(new Date(memberSince), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Suspend User Modal */}
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        onClose={handleCloseSuspendModal}
        onConfirm={() => handleConfirmSuspend("juio", "ACTIVE")}
        userName={"iuooi"}
      />
    </div>
  );
};

export default UserInfo;
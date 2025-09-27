"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BsPlus } from "react-icons/bs";
import GeneratedPlanList from "./GeneratedPlanList";
import TeamMemberSummary from "./TeamMemberSummary";
import { useGetMemberTeamQuery } from "@/redux/api/team/teamApi";
import Loading from "@/components/Others/Loading";

interface User {
  id: number;
  userName: string;
  userEmail: string;
  plansGenerated: string;
  userNo: string;
  location: string;
  joinDate: string;
  profileImage: string;
}

export default function UserList() {
  const [selectedUserForPlans, setSelectedUserForPlans] = useState<User | null>(
    null
  );
  const { data: teamMembers, isLoading } = useGetMemberTeamQuery({});
  console.log("teamMembers ===>", teamMembers);

  const goBackToList = () => {
    setSelectedUserForPlans(null);
  };

  // Show Generated Plan List (only when useInlineView is true)
  if (selectedUserForPlans) {
    return (
      <GeneratedPlanList
        user={selectedUserForPlans}
        onBackToList={goBackToList}
      />
    );
  }
  if (isLoading) {
    return <Loading />;
  }
  // Show User List
  return (
    <div className="">
      {/* Summary Cards */}
      <TeamMemberSummary />

      {/* Header */}
      <div className="pt-6 pb-4 px-4 lg:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Lista Utenti</h2>
          <Link href="/dashboard/manage-users/add">
            <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer">
              <BsPlus className="text-xl" />
              Aggiungi nuovo utente
            </button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-4 lg:px-6 ">
        <table className="w-full bg-white rounded-xl ">
          <thead className="bg-[#475466]">
            <tr>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Nome Utente
              </th>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Email Utente
              </th>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Piani generati
              </th>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Lista Piani
              </th>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Azione
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers?.data?.members.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-accent text-[16px] font-normal">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-accent text-[16px] font-normal">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-accent text-[16px] font-normal">
                  {user?.businessPlans?.complete +
                    user?.businessPlans?.incomplete}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/dashboard/manage-users/${user.id}/plans`}>
                    <button className="bg-gray-100 cursor-pointer text-info px-6 py-1 rounded-[76px] text-xs hover:bg-gray-200 transition-colors border border-[#99A6B8]">
                      Visualizza
                    </button>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/dashboard/manage-users/${user.id}/${teamMembers?.data.team?.id}`}
                  >
                    <button className="text-primary/80 underline cursor-pointer hover:text-primary text-base font-medium">
                      Visualizza profilo
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

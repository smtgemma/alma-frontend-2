import { useGetMemberTeamQuery } from "@/redux/api/team/teamApi";
import React from "react";
import { BsCalendar2Check, BsPeople, BsSearch, BsClock } from "react-icons/bs";

const TeamMemberSummary = () => {
  const { data: teamMembers, isLoading } = useGetMemberTeamQuery({});

  const summaryCards = [
    {
      title: "Total Member",
      value: teamMembers?.data?.team?.totalMember || 0,
      icon: BsPeople,
    },
    {
      title: "Remaining Member",
      value: teamMembers?.data?.team?.remainingMember || 0,
      icon: BsPeople,
    },
    {
      title: "Plans Completed",
      value: teamMembers?.data?.totals?.complete || 0,
      icon: BsCalendar2Check,
    },
    {
      title: "Plans Reviewed",
      value: teamMembers?.data?.totals?.incomplete || 0,
      icon: BsClock,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 px-4 lg:px-6">
      {summaryCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-600 mt-1">{card.title}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center relative">
              <card.icon className="text-blue-600 text-xl" />
              {/* Orange accent circle */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMemberSummary;

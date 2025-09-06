"use client";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineGroupAdd } from "react-icons/md";
import { IoReaderSharp } from "react-icons/io5";

const AdminSummaryCards = ({ cardInfo }: any) => {
  const summaryData = [
    {
      title: "Total Registered Users",
      value: cardInfo?.totalRegisteredUsers || 0,
      icon: <HiOutlineUserGroup className="w-8 h-8 text-primary" />,
      bgColor: "bg-white",
      textColor: "text-blue-600",
    },
    {
      title: "Solo Plan Users",
      value: cardInfo?.soloPlanUsers || 0,
      icon: <CgProfile className="w-8 h-8 text-primary" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Team Plan Users",
      value: cardInfo?.teamPlanUsers || 0,
      icon: <MdOutlineGroupAdd className="w-8 h-8 text-primary" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Total Plan Generated",
      value: cardInfo?.totalPlanGenerated || 0,
      icon: <IoReaderSharp className="w-8 h-8 text-primary" />,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 lg:px-6">
      {summaryData.map((card, index) => (
        <div
          key={index}
          className={`bg-white p-6 rounded-lg `}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className={card.textColor}>{card.icon}</div>
              <p className="text-sm font-medium text-gray-600 mt-2">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {card.value}
              </p>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSummaryCards;

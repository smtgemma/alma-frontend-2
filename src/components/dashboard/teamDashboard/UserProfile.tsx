"use client";

import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";

interface UserProfileProps {
  user: any;
  onRemoveUser: () => void;
  onBackToList: () => void;
}

export default function UserProfile({
  user,
  onRemoveUser,
  onBackToList,
}: UserProfileProps) {
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0 ">
      {/* User Info Section */}
      <div className=" rounded-lg p-3 sm:p-4 lg:p-6 ">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 border-b-2 border-gray-400 pb-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Informazioni Utente
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base lg:text-lg">
              Tutti i dettagli chiave sui tuoi membri del team in un posto{" "}
              <br /> veloce, chiaro e facile da gestire
            </p>
          </div>
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <button
              onClick={() => onRemoveUser()}
              className="w-full sm:w-auto px-4 cursor-pointer py-2 text-sm sm:text-base bg-red-50 border border-red-500 text-red-500  rounded-lg hover:bg-red-50 transition-colors min-w-[120px]"
            >
              Rimuovi Utente
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-lg  p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
            <div className="w-20 h-20 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image
                src={
                  user?.image ? user?.image : "/images/placeholderProfile.jpg"
                }
                alt={user?.firstName}
                className="w-full h-full object-cover"
                width={96}
                height={96}
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start space-y-1 sm:space-y-0 sm:space-x-2">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words">
                  {user?.firstName} {user?.lastName}
                </h3>
                <BsCheckCircleFill className="text-blue-500 text-base sm:text-lg mx-auto sm:mx-0" />
              </div>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg break-all mt-1">
                {user.email}
              </p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 py-2 sm:py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base font-medium sm:font-normal">
                Nome Completo:
              </span>
              <span className="font-medium text-gray-900 text-sm sm:text-base break-words text-right sm:text-left">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 py-2 sm:py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base font-medium sm:font-normal">
                Indirizzo Email:
              </span>
              <span className="font-medium text-gray-900 text-sm sm:text-base break-all text-right sm:text-left">
                {user?.email}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 py-2 sm:py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base font-medium sm:font-normal">
                Numero Utente:
              </span>
              <span className="font-medium text-gray-900 text-sm sm:text-base break-words text-right sm:text-left">
                {/* {user?.location ? user?.location : "N/A"} */}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 py-2 sm:py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base font-medium sm:font-normal">
                Posizione:
              </span>
              <span className="font-medium text-gray-900 text-sm sm:text-base break-words text-right sm:text-left">
                {user?.location ? user?.location : "N/A"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 py-2 sm:py-3">
              <span className="text-gray-600 text-sm sm:text-base font-medium sm:font-normal">
                Data di Iscrizione:
              </span>
              <span className="font-medium text-gray-900 text-sm sm:text-base text-right sm:text-left">
                {format(new Date(user.createdAt), "MMMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        {/* <div className="mt-4 sm:mt-6">
          <button
            onClick={onBackToList}
            className="w-full sm:w-auto px-4 cursor-pointer py-2 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors min-w-[150px]"
          >
            ← Back to User List
          </button>
        </div> */}
      </div>
    </div>
  );
}

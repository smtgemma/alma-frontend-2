"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import { MdOutlineErrorOutline } from "react-icons/md";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const LogoutPopup = ({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-30"
            aria-hidden="true"
          />
        )}

        <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-xl p-10 min-w-sm md:min-w-xl mx-auto z-50 relative shadow-xl">
          <div className="bg-[#FDE1E1] p-1 rounded-full  text-center">
            <MdOutlineErrorOutline className="text-[#FF7878] text-2xl" />
          </div>
          <div>
            <h1 className="text-[20px] font-medium text-gray-900 text-center">
              Are you sure you want to <br /> Log out?
            </h1>
          </div>

          <div className="mt-3 flex justify-end gap-6 ">
            <button
              onClick={onConfirm}
              className="px-10 py-2 rounded-md bg-white text-accent border border-accent w-full cursor-pointer"
            >
              Logout
            </button>

            <button
              onClick={onClose}
              className="px-10 py-2 rounded-md bg-primary text-white w-full cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

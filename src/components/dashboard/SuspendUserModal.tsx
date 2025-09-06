"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import { MdOutlineErrorOutline } from "react-icons/md";

type SuspendUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
};

export const SuspendUserModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName = "this user",
}: SuspendUserModalProps) => {
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
          <div className="bg-[#FDE1E1] p-1 rounded-full text-center">
            <MdOutlineErrorOutline className="text-[#FF7878] text-2xl" />
          </div>
          <div>
            <h1 className="text-[20px] font-medium text-gray-900 text-center">
              Are you sure you want to change {userName}'s status?
            </h1>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row justify-center gap-3 w-full">
            <button
              onClick={onClose}
              className="px-10 py-2 cursor-pointer rounded-md bg-white text-accent border border-accent hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-10 py-2 cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

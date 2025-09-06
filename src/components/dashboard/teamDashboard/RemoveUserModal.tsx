'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import { BsInfoCircle } from 'react-icons/bs';

interface RemoveUserModalProps {
  isOpen: boolean;
  isRemoving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function RemoveUserModal({ isOpen, isRemoving, onConfirm, onCancel }: RemoveUserModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50"
            aria-hidden="true"
          />
        )}

        <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-xl p-10 min-w-sm md:min-w-xl mx-auto z-50 relative shadow-xl">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BsInfoCircle className="text-red-500 text-xl" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Are you sure you want to remove this user?
            </h3>
          </div>

          <div className="mt-3 flex justify-end gap-6">
            <button
              onClick={onConfirm}
              disabled={isRemoving}
              className="px-10 py-2 cursor-pointer rounded-md bg-white text-gray-700 border border-gray-300 w-full hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isRemoving ? "Removing..." : "Remove"}
            </button>

            <button
              onClick={onCancel}
              className="px-10 py-2 cursor-pointer rounded-md bg-primary text-white w-full hover:bg-primary/90 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

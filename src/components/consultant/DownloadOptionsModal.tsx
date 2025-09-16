"use client";
import React from "react";
import { GoDownload } from "react-icons/go";
import { FiFileText, FiFile } from "react-icons/fi";
import { generateEmpathyPDF } from "../generated-plans-graph/pdf-downloader/PdfDownload";

interface DownloadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadPDF: () => void;
  onDownloadDOC: () => void;
}

const DownloadOptionsModal: React.FC<DownloadOptionsModalProps> = ({
  isOpen,
  onClose,
  onDownloadPDF,
  onDownloadDOC,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Download Options
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Choose your preferred download format:
        </p>

        <div className="space-y-3">
          {/* PDF Download Option */}
          <button
            onClick={() => {
              onDownloadPDF();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FiFile className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left ">
              <div className="font-medium text-gray-800">PDF Download</div>
              <div className="text-sm text-gray-500">
                Download as PDF document
              </div>
            </div>
            <GoDownload className="w-5 h-5 text-gray-400 ml-auto" />
          </button>

          {/* DOC Download Option */}
          <button
            onClick={() => {
              onDownloadDOC();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiFileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left ">
              <div className="font-medium text-gray-800">DOC Download</div>
              <div className="text-sm text-gray-500">
                Download as Word document
              </div>
            </div>
            <GoDownload className="w-5 h-5 text-gray-400 ml-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadOptionsModal;

import React from "react";

interface ErrorMessage {
  path: string;
  message: string;
}

interface PaymentValidationProps {
  error?: {
    success: boolean;
    message: string;
    errorMessages: ErrorMessage[];
    err: {
      statusCode: number;
    };
    stack?: string;
    applicant: number;
    cost: number;
  };
  handleJobPayment: () => void;
}

const PaymentValidation: React.FC<PaymentValidationProps> = ({
  error,
  handleJobPayment,
}) => {
  if (!error || error.success) return null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="bg-red-100 p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="ml-3 text-lg font-medium text-red-800">
          Payment Required
        </h2>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-primary p-4 mb-4 rounded-r">
        <div className="flex items-start">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Application Summary
            </h4>
            <p className="text-sm text-primary mb-1">
              <span className="font-semibold">Total Applicants:</span>{" "}
              {error.applicant}
            </p>
            <p className="text-sm text-primary">
              <span className="font-semibold">Total Cost:</span> {error.cost}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleJobPayment}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Complete Payment Now
        </button>
      </div>
    </div>
  );
};

export default PaymentValidation;

'use client';

import React from 'react';
import { BsCheckCircle, BsXCircle, BsClock } from 'react-icons/bs';

interface PaymentStatusProps {
  status: 'processing' | 'success' | 'error' | 'idle';
  message?: string;
  onClose?: () => void;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  message,
  onClose,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: <BsClock className="text-blue-600 text-2xl animate-spin" />,
          title: 'Processing Payment',
          message: 'Please wait while we process your payment...',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
        };
      case 'success':
        return {
          icon: <BsCheckCircle className="text-green-600 text-2xl" />,
          title: 'Payment Successful',
          message: message || 'Your subscription has been activated successfully!',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
        };
      case 'error':
        return {
          icon: <BsXCircle className="text-red-600 text-2xl" />,
          title: 'Payment Failed',
          message: message || 'There was an error processing your payment.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (!config) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} ${config.textColor} shadow-lg max-w-sm`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium">{config.title}</h3>
          <p className="text-sm mt-1">{config.message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <BsXCircle className="text-lg" />
          </button>
        )}
      </div>
    </div>
  );
};

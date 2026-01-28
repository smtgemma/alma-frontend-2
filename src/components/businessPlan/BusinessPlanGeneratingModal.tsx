import { Modal } from "../modal/Modal";
import { FiMail, FiClock, FiCheckCircle } from "react-icons/fi";

interface BusinessPlanGeneratingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessPlanGeneratingModal: React.FC<BusinessPlanGeneratingModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-md mx-auto text-center py-6 px-4">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Business Plan Submitted Successfully! 🎉
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Your business plan is now being generated. This process may take a few minutes.
        </p>

        {/* Info Cards */}
        <div className="space-y-4 mb-6 text-left">
          {/* Email Notification Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <FiMail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Check Your Email</h3>
              <p className="text-sm text-blue-700">
                We'll send you an email notification when your business plan is ready or if there are any issues.
              </p>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
            <FiClock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">Processing Time</h3>
              <p className="text-sm text-purple-700">
                Generation typically takes 2-5 minutes. Once complete, it will be reviewed by our experts within 48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Important:</span> Please check your email inbox (and spam folder) for updates on your business plan status.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Got it, thanks!
        </button>
      </div>
    </Modal>
  );
};

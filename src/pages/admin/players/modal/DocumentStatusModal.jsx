import { IoMdClose } from "react-icons/io";
import { Loader, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function DocumentStatusModal({
  isOpen,
  onClose,
  onUpdate,
  player,
  documentType,
  isProcessing,
  error
}) {
  if (!isOpen) return null;

  // Get document type display name
  const getDocumentDisplayName = () => {
    switch (documentType) {
      case 'medical_certificate':
        return 'Medical Certificate';
      case 'parents_consent':
        return 'Parent\'s Consent';
      case 'cor':
        return 'Certificate of Registration';
      default:
        return 'Document';
    }
  };

  const documentDisplayName = getDocumentDisplayName();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto max-h-[90vh] flex flex-col">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] overflow-hidden">
          {/* Header - Fixed at top */}
          <div className="flex items-center justify-between p-5 border-b border-[#E6F2E8] bg-[#F7FAF7]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              Update Document Status
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-[#2A6D3A]/70 hover:bg-[#F7FAF7] hover:text-[#2A6D3A] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors duration-200"
              aria-label="Close modal"
            >
              <IoMdClose size={22} />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="p-5 overflow-y-auto flex-1">
            <p className="text-gray-700 mb-4">
              Update status for <span className="font-medium">{player?.name || "player"}'s {documentDisplayName}</span>
            </p>
            
            <div className="p-3 bg-[#F7FAF7] rounded-lg border border-[#E6F2E8] mb-4">
              <p className="text-sm text-gray-600">
                The player will be automatically approved when all three documents are marked as valid.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={() => onUpdate('valid')}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <CheckCircle size={18} />
                Mark as Valid
              </button>
              
              <button
                onClick={() => onUpdate('invalid')}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <AlertCircle size={18} />
                Mark as Invalid
              </button>
              
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex justify-end p-5 space-x-3 border-t border-[#E6F2E8] bg-white">
            <button
              type="button"
              onClick={onClose}
              className="text-[#2A6D3A] bg-white border border-[#E6F2E8] hover:bg-[#F7FAF7] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
              disabled={isProcessing}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
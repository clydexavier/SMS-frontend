import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Loader, AlertCircle } from "lucide-react";

export default function PlayerStatusModal({
  isOpen,
  onClose,
  onConfirm,
  player,
  action,
  isProcessing,
  error
}) {
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    // Initialize rejection reason if provided in player data
    if (player && action === "reject") {
      setRejectionReason(player.rejection_reason || "");
    }
  }, [player, action]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (action === "reject" && !rejectionReason.trim()) {
      return; // Don't submit if rejection reason is empty
    }
    
    onConfirm(action === "reject" ? rejectionReason : null);
  };

  if (!isOpen) return null;

  // Determine title, descriptions, and button colors based on action
  const getModalContent = () => {
    switch (action) {
      case "reject":
        return {
          title: "Reject Player",
          description: `Are you sure you want to reject ${player?.name || "this player"}?`,
          note: "This will override the automated approval process.",
          buttonText: "Reject Player",
          buttonColor: "bg-red-600 hover:bg-red-700",
          buttonTextColor: "text-white",
          icon: <AlertCircle className="text-red-600 w-5 h-5 mr-2" />
        };
      case "clear-rejection":
        return {
          title: "Clear Rejection Status",
          description: `Are you sure you want to clear ${player?.name || "this player"}'s rejection status?`,
          note: "This will return the player to the automated approval system based on document validation.",
          buttonText: "Clear Rejection",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
          buttonTextColor: "text-white",
          icon: <AlertCircle className="text-yellow-600 w-5 h-5 mr-2" />
        };
      default:
        return {
          title: "Update Player Status",
          description: "Update player status",
          note: "",
          buttonText: "Submit",
          buttonColor: "bg-[#6BBF59] hover:bg-[#5CAF4A]",
          buttonTextColor: "text-white",
          icon: null
        };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] overflow-hidden">
          {/* Header - Fixed at top */}
          <div className="flex items-center justify-between p-5 border-b border-[#E6F2E8] bg-[#F7FAF7]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              {content.title}
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

          {/* Form - Scrollable content */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-5 overflow-y-auto flex-1">
              <div className="flex items-start mb-4">
                {content.icon}
                <p className="text-gray-700">{content.description}</p>
              </div>
              
              {content.note && (
                <div className="p-3 bg-[#F7FAF7] rounded-lg border border-[#E6F2E8] mb-4">
                  <p className="text-sm text-gray-600">{content.note}</p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {action === "reject" && (
                <div className="mb-4">
                  <label htmlFor="rejectionReason" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Rejection Reason*
                  </label>
                  <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection"
                    rows={3}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    required
                  />
                </div>
              )}
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex justify-end p-5 space-x-3 border-t border-[#E6F2E8] bg-white">
              <button
                type="button"
                onClick={onClose}
                className="text-[#2A6D3A] bg-white border border-[#E6F2E8] hover:bg-[#F7FAF7] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${content.buttonTextColor} ${content.buttonColor} font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 flex items-center`}
                disabled={isProcessing || (action === "reject" && !rejectionReason.trim())}
              >
                {isProcessing ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  content.buttonText
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
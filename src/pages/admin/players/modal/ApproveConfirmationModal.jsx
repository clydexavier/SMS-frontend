// ApprovalConfirmationModal.jsx
import React from "react";
import { CheckCircle, AlertTriangle, X, Loader } from "lucide-react";

export default function ApprovalConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  message,
  isProcessing,
  error,
  isApproving = true // true for approving, false for marking as pending
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${isApproving ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
          <h3 className={`text-lg font-medium flex items-center ${isApproving ? 'text-green-700' : 'text-yellow-700'}`}>
            {isApproving ? (
              <CheckCircle size={20} className="mr-2 text-green-600" />
            ) : (
              <AlertTriangle size={20} className="mr-2 text-yellow-600" />
            )}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-700 mb-4">
            {message || `Are you sure you want to ${isApproving ? 'approve' : 'mark as pending'} ${itemName}?`}
          </p>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 flex items-center ${
                isApproving 
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" 
                  : "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
              }`}
              onClick={onConfirm}
              disabled={isProcessing}
            >
              {isProcessing && <Loader size={16} className="animate-spin mr-2" />}
              {isApproving ? "Approve" : "Mark as Pending"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
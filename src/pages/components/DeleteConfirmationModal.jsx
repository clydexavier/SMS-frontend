import React, { useRef, useEffect } from "react";
import { AlertTriangle, X, Loader } from "lucide-react";

/**
 * A reusable delete confirmation modal component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {Function} props.onConfirm - Function to call when deletion is confirmed
 * @param {string} props.title - Modal title (default: "Delete Confirmation")
 * @param {string} props.itemName - Name of the item being deleted
 * @param {string} props.message - Custom message (default: "Are you sure you want to delete {itemName}? This action cannot be undone.")
 * @param {boolean} props.isDeleting - Whether deletion is in progress
 * @param {string} props.error - Error message to display if deletion fails
 * @returns {JSX.Element}
 */
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  itemName,
  message,
  isDeleting = false,
  error = null,
}) => {
  const modalRef = useRef(null);

  // Handle clicking outside the modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, isDeleting]);

  // Handle escape key to close the modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose, isDeleting]);

  if (!isOpen) return null;

  const defaultMessage = `Are you sure you want to delete ${itemName ? `"${itemName}"` : "this item"}? This action cannot be undone.`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center bg-red-50 px-6 py-4">
          <div className="flex items-center">
            <AlertTriangle size={20} className="text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-red-600">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">
            {message || defaultMessage}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex justify-center items-center"
            >
              {isDeleting ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
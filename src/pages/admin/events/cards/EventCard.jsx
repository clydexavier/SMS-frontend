import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiMapPin, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";

export default function EventCard({ event, openEditModal, deleteEvent }) {
  const { intrams_id } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Delete confirmation modal states
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const confirmDeleteIntramural = () => {
    setMenuOpen(false);
    setShowDeleteConfirmation(true);
  };

  // Handle the actual deletion after confirmation
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      // Call the deleteIntramural function passed from parent
      await deleteEvent(event);
      
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      setDeleteError("Failed to delete event. Please try again.");
      setIsDeleting(false);
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "completed":
        return {
          icon: <FiCheckCircle className="w-4 h-4" />,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200"
        };
      case "in progress":
        return {
          icon: <FiClock className="w-4 h-4" />,
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200"
        };
      case "pending":
      default:
        return {
          icon: <FiAlertCircle className="w-4 h-4" />,
          bgColor: "bg-amber-100",
          textColor: "text-amber-800",
          borderColor: "border-amber-200"
        };
    }
  };

  const statusDetails = getStatusDetails(event.status);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 relative flex flex-col">
  {/* Status Badge */}
  <div className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-0.5 rounded-full border flex items-center gap-1
    ${statusDetails.bgColor} ${statusDetails.textColor} ${statusDetails.borderColor}`}>
    {statusDetails.icon}
    <span className="capitalize">{event.status}</span>
  </div>

  {/* Header */}
  <Link
    to={`${event.id}/players`}
    state={{ event_name: event.name }}
    className="w-full group"
  >
    <div className="px-4 py-3 bg-green-50 border-b border-green-100 group-hover:bg-green-100 transition-colors duration-300">
      <h3 className="font-semibold text-green-800 truncate">
        {event.category + " " + event.name}
      </h3>
    </div>
  </Link>

  {/* Content */}
  <div className="p-4 pt-3 flex flex-col gap-3 text-sm text-gray-700">
    <div className="flex flex-wrap gap-2">
      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        {event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : "N/A"}
      </span>
      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : "N/A"}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <FiMapPin className="text-green-500" />
      <span className="truncate">{event.venue || "No venue yet"}</span>
    </div>
  </div>

  {/* Action Button */}
  <div className="border-t border-gray-200 px-3 py-2 flex justify-end relative" ref={menuRef}>
    <button
      onClick={() => setMenuOpen((prev) => !prev)}
      className="p-2 rounded-full hover:bg-green-50 text-green-800 transition-colors duration-200"
    >
      <FiMoreVertical className="w-5 h-5" />
    </button>

    {/* Dropdown Menu */}
    {menuOpen && (
      <div className="absolute right-2 bottom-12 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden">
        <button
          className="block w-full px-4 py-2.5 text-left text-sm text-green-800 hover:bg-green-50 transition-colors duration-200 flex items-center gap-2"
          onClick={() => {
            openEditModal(event);
            setMenuOpen(false);
          }}
        >
          Update
        </button>
        <button
          className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
          onClick={confirmDeleteIntramural}
        >
          Delete
        </button>
      </div>
    )}
  </div>

  {/* Delete Confirmation Modal */}
  <DeleteConfirmationModal
    isOpen={showDeleteConfirmation}
    onClose={() => setShowDeleteConfirmation(false)}
    onConfirm={handleDelete}
    title="Delete Event"
    itemName={event.name}
    message={`Are you sure you want to delete "${event.name}"? This action cannot be undone and will remove all associated players, matches, results, and data.`}
    isDeleting={isDeleting}
    error={deleteError}
  />
</div>

  );
}

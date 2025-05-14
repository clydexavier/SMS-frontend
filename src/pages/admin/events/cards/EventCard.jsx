import React, { useState, useRef, useEffect } from "react";
import {
  FiMoreVertical,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCalendar,
} from "react-icons/fi";
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

  const confirmDeleteEvent = () => {
    setMenuOpen(false);
    setShowDeleteConfirmation(true);
  };

  // Handle the actual deletion after confirmation
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);

      // Call the deleteEvent function passed from parent
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
          bgColor: "bg-green-500",
          textColor: "text-white",
          label: "Completed"
        };
      case "in progress":
        return {
          icon: <FiClock className="w-4 h-4" />,
          bgColor: "bg-blue-500",
          textColor: "text-white",
          label: "In Progress"
        };
      case "pending":
      default:
        return {
          icon: <FiAlertCircle className="w-4 h-4" />,
          bgColor: "bg-amber-400",
          textColor: "text-gray-800",
          label: "Pending"
        };
    }
  };

  const statusDetails = getStatusDetails(event.status);
  
  // Format event date/time if available
  const formatSchedule = () => {
    if (event.event_date && event.event_time) {
      try {
        // Format date
        const date = new Date(event.event_date);
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        });
        
        // Format time
        const timeParts = event.event_time.split(':');
        let hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedTime = `${hours}:${minutes} ${ampm}`;
        
        return { date: formattedDate, time: formattedTime };
      } catch (e) {
        return null;
      }
    }
    return null;
  };
  
  const schedule = formatSchedule();

  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-b from-amber-50 to-[#f7faf7] border border-[#E6F2E8] shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col relative">
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm ${statusDetails.bgColor} ${statusDetails.textColor}`}>
          {statusDetails.icon}
          <span>{statusDetails.label}</span>
        </span>
      </div>

      {/* Header */}
      <div className="pt-4 px-4 pb-3 bg-amber-50/70">
        <Link
          to={`${event.id}/players`}
          state={{ event_name: event.name }}
          className="block"
        >
          <h3 className="font-semibold text-[#2A6D3A] text-lg mt-2">
            {event.name}
          </h3>
          
          {/* Category and Type */}
          <div className="flex flex-wrap gap-2 mt-2">
            {event.category && (
              <span className="px-2.5 py-0.5 bg-[#2A6D3A]/10 text-[#2A6D3A] rounded-full text-xs font-medium">
                {event.category}
              </span>
            )}
            {event.type && (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                {event.type}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E6F2E8]"></div>

      {/* Content */}
      <div className="p-4 pt-3 flex-1 flex flex-col">
        {/* Schedule if available */}
        {schedule && (
          <div className="flex items-start mb-3">
            <FiCalendar className="text-[#6BBF59] mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <div className="text-gray-800">{schedule.date}</div>
              <div className="text-[#2A6D3A]">{schedule.time}</div>
            </div>
          </div>
        )}
        
        {/* Venue if available */}
        {event.venue && (
          <div className="flex items-center">
            <FiMapPin className="text-[#6BBF59] mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate">
              {event.venue}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-[#E6F2E8] bg-[#f7faf7]/50 flex justify-end" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-1.5 rounded-full hover:bg-[#E6F2E8] text-[#2A6D3A] transition-colors duration-200"
          aria-label="More options"
        >
          <FiMoreVertical className="w-5 h-5" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-4 bottom-12 w-40 bg-white border border-[#E6F2E8] rounded-lg shadow-lg z-50 overflow-hidden">
            <button
              className="block w-full px-4 py-2.5 text-left text-sm text-[#2A6D3A] hover:bg-[#F7FAF7] transition-colors flex items-center gap-2" 
              onClick={() => {
                openEditModal(event);
                setMenuOpen(false);
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Update
            </button>
            <button
              className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2" 
              onClick={confirmDeleteEvent}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
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
import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiCalendar, FiMapPin, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";

function IntramuralCard({ intramural, openEditModal, deleteIntramural }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Delete confirmation modal states
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Open delete confirmation modal
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
      await deleteIntramural(intramural);
      
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting intramural:", error);
      setDeleteError("Failed to delete intramural. Please try again.");
      setIsDeleting(false);
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get days info
  const getDaysInfo = () => {
    if (!intramural.start_date) return null;
    
    const today = new Date();
    const startDate = new Date(intramural.start_date);
    const endDate = intramural.end_date ? new Date(intramural.end_date) : null;
    
    if (intramural.status === "pending") {
      const daysToStart = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
      if (daysToStart <= 0) return null;
      return {
        count: daysToStart,
        label: `${daysToStart} day${daysToStart !== 1 ? 's' : ''} until start`,
        color: "text-[#2A6D3A]"
      };
    } else if (intramural.status === "in progress" && endDate) {
      const daysToEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      if (daysToEnd <= 0) return null;
      return {
        count: daysToEnd,
        label: `${daysToEnd} day${daysToEnd !== 1 ? 's' : ''} remaining`,
        color: "text-[#2A6D3A]"
      };
    } else if (intramural.status === "completed" && endDate) {
      const daysSinceEnd = Math.ceil((today - endDate) / (1000 * 60 * 60 * 24));
      if (daysSinceEnd <= 0) return null;
      return {
        count: daysSinceEnd,
        label: `Ended ${daysSinceEnd} day${daysSinceEnd !== 1 ? 's' : ''} ago`,
        color: "text-[#2A6D3A]"
      };
    }
    
    return null;
  };

  const daysInfo = getDaysInfo();

  // Get status details
  const getStatusDetails = (status) => {
    switch(status) {
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

  const statusDetails = getStatusDetails(intramural.status);

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
        <Link to={`/admin/${intramural.id}/events`} state={{ intrams_name: intramural.name }} className="block">
          <h3 className="font-semibold text-[#2A6D3A] text-lg mt-2">
            {intramural.name}
          </h3>
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E6F2E8]"></div>

      {/* Content */}
      <div className="p-4 pt-3 flex-1 flex flex-col">
        {/* Date Range */}
        <div className="flex items-start mb-3">
          <FiCalendar className="text-[#6BBF59] mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <div className="text-gray-800">
              {formatDate(intramural.start_date)}{intramural.end_date ? ` - ${formatDate(intramural.end_date)}` : ""}
            </div>
            {daysInfo && (
              <div className={`text-sm ${daysInfo.color}`}>
                {daysInfo.label}
              </div>
            )}
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center">
          <FiMapPin className="text-[#6BBF59] mr-2 flex-shrink-0" />
          <span className="text-sm text-gray-700 truncate">
            {intramural.location ? intramural.location : "No location yet"}
          </span>
        </div>
        
        {/* Stats 
        <div className="grid grid-cols-3 gap-2 mt-auto pt-4">
          <div className="bg-[#f7faf7] rounded-lg p-2 text-center border border-[#E6F2E8]">
            <div className="text-xs text-[#2A6D3A] font-medium">Events</div>
            <div className="font-semibold text-gray-700">{intramural.event_count || 0}</div>
          </div>
          <div className="bg-[#f7faf7] rounded-lg p-2 text-center border border-[#E6F2E8]">
            <div className="text-xs text-[#2A6D3A] font-medium">Teams</div>
            <div className="font-semibold text-gray-700">{intramural.team_count || 0}</div>
          </div>
          <div className="bg-[#f7faf7] rounded-lg p-2 text-center border border-[#E6F2E8]">
            <div className="text-xs text-[#2A6D3A] font-medium">Players</div>
            <div className="font-semibold text-gray-700">{intramural.player_count || 0}</div>
          </div>
        </div>
        */}
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
                openEditModal(intramural);
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
              onClick={confirmDeleteIntramural}
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
        title="Delete Intramural"
        itemName={intramural.name}
        message={`Are you sure you want to delete "${intramural.name}"? This action cannot be undone and will remove all associated events, teams, and data.`}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
}

export default IntramuralCard;
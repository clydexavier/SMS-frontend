import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiCalendar, FiMapPin, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

function IntramuralCard({ intramural, openEditModal, deleteIntramural }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  // Handle delete confirmation
  const handleDelete = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${intramural.name}?`);
    if (confirmDelete) {
      deleteIntramural(intramural.id);
    }
    setMenuOpen(false);
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

  // Get status icon and color
  const getStatusDetails = (status) => {
    switch(status) {
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

  const statusDetails = getStatusDetails(intramural.status);

  return (
    <div className="w-full h-full box-border bg-white rounded-lg shadow-md border border-[#E6F2E8] hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col">
      {/* Status Badge */}
      <div className={`absolute top-3 right-3 ${statusDetails.bgColor} ${statusDetails.textColor} ${statusDetails.borderColor} text-xs font-medium px-2.5 py-0.5 rounded-full border flex items-center gap-1`}>
        {statusDetails.icon}
        <span className="capitalize">{intramural.status}</span>
      </div>

      {/* Header with Link */}
      <Link to={`/${intramural.id}/events`} state={{ intrams_id: intramural.id }} className="w-full group">
        <div className="w-full bg-gradient-to-r from-[#2A6D3A] to-[#6BBF59] text-white p-4 rounded-t-lg flex flex-col items-start group-hover:from-[#1E4D2B] group-hover:to-[#5CAF4A] transition-all duration-300">
          <span className="text-lg font-bold text-left truncate w-full pr-8">
            {intramural.name}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 w-full p-4 pt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FiCalendar className="text-[#6BBF59]" />
          <span>{formatDate(intramural.start_date)}{intramural.end_date ? ` - ${formatDate(intramural.end_date)}` : ""}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FiMapPin className="text-[#6BBF59]" />
          <span className="truncate">
            {intramural.location ? intramural.location : "No location yet"}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-t border-[#E6F2E8] p-2 flex justify-end" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 rounded-full hover:bg-[#F7FAF7] text-[#2A6D3A] transition-colors duration-200"
          aria-label="More options"
        >
          <FiMoreVertical className="w-5 h-5" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-2 bottom-12 w-40 bg-white border border-[#E6F2E8] rounded-lg shadow-lg z-50 overflow-hidden">
            <button 
              className="block w-full px-4 py-2.5 text-left text-sm text-[#2A6D3A] hover:bg-[#F7FAF7] transition-colors duration-200 flex items-center gap-2" 
              onClick={() => {
                openEditModal(intramural);
                console.log(intramural);
                setMenuOpen(false);
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Update
            </button>
            <button 
              className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2" 
              onClick={handleDelete}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IntramuralCard;
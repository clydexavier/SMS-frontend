import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiMapPin, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

export default function EventCard({ event, openEditModal, deleteEvent }) {
  const { intrams_id } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${event.name}?`);
    if (confirmDelete) {
      deleteEvent(event.id);
    }
    setMenuOpen(false);
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
    <div className="w-full h-full box-border bg-white rounded-lg shadow-md border border-[#E6F2E8] hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col">
      {/* Status Badge */}
      <div className={`absolute top-3 right-3 ${statusDetails.bgColor} ${statusDetails.textColor} ${statusDetails.borderColor} text-xs font-medium px-2.5 py-0.5 rounded-full border flex items-center gap-1`}>
        {statusDetails.icon}
        <span className="capitalize">{event.status}</span>
      </div>

      {/* Header with Link */}
      <Link to={`${event.id}/players`} state={{ event_name: event.name}} className="w-full group">
        <div className="w-full bg-gradient-to-r from-[#2A6D3A] to-[#6BBF59] text-white p-4 rounded-t-lg flex flex-col items-start group-hover:from-[#1E4D2B] group-hover:to-[#5CAF4A] transition-all duration-300">
          <span className="text-lg font-bold text-left truncate w-full pr-8">
            {event.name}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 w-full p-4 pt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="px-2 py-0.5 bg-[#E6F2E8] text-[#2A6D3A] rounded-full text-xs font-medium">
            {event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : "N/A"}
          </span>
          <span className="px-2 py-0.5 bg-[#E6F2E8] text-[#2A6D3A] rounded-full text-xs font-medium">
            {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FiMapPin className="text-[#6BBF59]" />
          <span className="truncate">{event.venue || "No venue yet"}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-t border-[#E6F2E8] p-2 flex justify-end" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 rounded-full hover:bg-[#F7FAF7] text-[#2A6D3A] transition-colors duration-200"
        >
          <FiMoreVertical className="w-5 h-5" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-2 bottom-12 w-40 bg-white border border-[#E6F2E8] rounded-lg shadow-lg z-50 overflow-hidden">
            <button
              className="block w-full px-4 py-2.5 text-left text-sm text-[#2A6D3A] hover:bg-[#F7FAF7] transition-colors duration-200 flex items-center gap-2"
              onClick={() => {
                openEditModal(event);
                setMenuOpen(false);
              }}
            >
              Update
            </button>
            <button
              className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

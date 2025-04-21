import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

export default function ParticipantCard({ participant, openEditModal, deleteParticipant }) {
  const { intrams_id, event_id } = useParams();
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
    const confirmDelete = window.confirm(`Are you sure you want to delete ${participant.name}?`);
    if (confirmDelete) {
      deleteParticipant(participant.id);
    }
    setMenuOpen(false);
  };

  return (
    <div className="w-full h-full box-border bg-white rounded-lg shadow-md border border-[#E6F2E8] hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col">
      {/* Status Badge */}
      <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-medium ${
        participant.finalized === "yes" 
        ? "bg-green-100 text-green-800" 
        : "bg-yellow-100 text-yellow-800"
      }`}>
        {participant.finalized === "yes" ? "Approved" : "Pending"}
      </div>

      {/* Team Logo Header */}
      <Link
        to={`/${intrams_id}/events/${event_id}/participants/${participant.id}/players`}
        className="flex-1 w-full p-4 pt-3 flex flex-col gap-1 group"
      >
        <div className="bg-gradient-to-r from-[#2A6D3A] to-[#6BBF59] p-4 rounded-t-lg flex items-center justify-center">
        <img
          src={participant.team_logo}
          alt="Team Logo"
          className="w-16 h-16 object-cover rounded-full border-2 border-white shadow-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder-logo.png";
          }}
        />
        </div>
      </Link>

      {/* Content */}
      <span className="text-lg font-bold text-gray-800 text-green-700 transition-colors duration-200 text-center truncate">
        {participant.name}
      </span>
      <p className="text-sm text-gray-600 text-center">
        Team: {participant.team_name || "N/A"}
      </p>

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
              className="block w-full px-4 py-2.5 text-left text-sm text-[#2A6D3A] hover:bg-[#F7FAF7] transition-colors duration-200"
              onClick={() => {
                openEditModal(participant);
                setMenuOpen(false);
              }}
            >
              Update
            </button>
            <button
              className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
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
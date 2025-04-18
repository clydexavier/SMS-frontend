import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ParticipantCard({ participant, openEditModal, deleteParticipant }) {
  
    const { intrams_id, event_id } = useParams();
    const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  const handleDelete = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${participant.name}?`);
    if (confirmDelete) {
      deleteParticipant(participant.id);
    }
    setMenuOpen(false);
  };

  return (
    <div className="w-full h-full box-border bg-white rounded-lg shadow-md border relative overflow-hidden flex flex-col">
      {/* Header */}
      <Link to={`/${intrams_id}/events/${event_id}/participants/${participant.id}/players`} className="w-full" >
        <div className="bg-green-700 text-white p-2 rounded-t-lg flex flex-col items-center">
            <span className="text-2xl sm:text-xl text-center font-extrabold">
            {participant.name}
            </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
      <span className="text-2xl sm:text-xl text-center font-extrabold">
          {participant.name}
        </span>
        <p className="text-sm font-semibold text-gray-800">
          Team: {participant.team_name || "N/A"}
        </p>
      </div>

      {/* Three-Dot Dropdown */}
      <div className="absolute bottom-2 right-2" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <FiMoreVertical className="text-gray-600 text-[20px] sm:text-[15px]" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 bottom-8 w-40 bg-white border rounded-md shadow-lg z-50">
            <button
              className="block w-full px-4 py-2 text-left text-sm sm:text-xs hover:bg-green-100"
              onClick={() => {
                openEditModal(participant);
                setMenuOpen(false);
              }}
            >
              Update
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm sm:text-xs text-red-600 hover:bg-red-100"
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

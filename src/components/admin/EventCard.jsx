import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function EventCard({ event, openEditModal, deleteEvent }) {
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
    const confirmDelete = window.confirm(`Are you sure you want to delete ${event.name}?`);
    if (confirmDelete) {
      deleteEvent(event.id);
    }
    setMenuOpen(false);
  };

  return (
    <div className="w-full h-full box-border bg-white rounded-lg shadow-md border relative overflow-hidden flex flex-col">
      {/* Header with Link */}
      <Link to="/event" state={{ id: event.id }} className="w-full">
        <div className="bg-gray-800 text-white p-2 rounded-t-lg flex flex-col items-center">
          <span className="text-2xl sm:text-xl text-center font-extrabold">{event.name}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm sm:text-xs md:text-sm lg:text-sm font-semibold text-gray-800">{event.date}</p>
        <p
          className={`text-sm sm:text-xs md:text-sm lg:text-sm font-medium ${
            event.status === "complete" ? "text-green-600" : "text-yellow-600"
          }`}
        >
          Status: {event.status}
        </p>
        <p
          className={`text-sm sm:text-xs md:text-sm lg:text-sm ${
            event.location ? "text-gray-600" : "text-red-600 font-medium"
          }`}
        >
          {event.location ? `Location: ${event.location}` : "No location yet"}
        </p>
      </div>

      {/* Three-Dot Button with Dropdown */}
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
                openEditModal(event);
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

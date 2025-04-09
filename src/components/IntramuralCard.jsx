import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
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

  return (
    <div className="w-full h-full box-border bg-white rounded-lg shadow-md border relative overflow-hidden flex flex-col">

    {/* Header with Link */}
    <Link to={`/${intramural.id}/events`} state={{ id: intramural.id }} className="w-full">
      <div className="w-full bg-gray-800 text-white p-2 rounded-t-lg flex flex-col items-center">
        <span className=" text-2xl font-extrabold text-center sm:text-xl text-sm">
          {intramural.name}
        </span>
      </div>
    </Link>

    {/* Content */}
    <div className="h-full w-full p-4">
      <p className="text-sm sm:text-xs md:text-sm lg:text-sm font-semibold text-gray-800">{intramural.start_date}</p>
      <p
        className={`text-sm sm:text-xs md:text-sm lg:text-sm font-medium ${
          intramural.status === "complete" ? "text-green-600" : "text-yellow-600"
        }`}
      >
        Status: {intramural.status}
      </p>
      <p
        className={`text-sm ${
          intramural.location ? "text-gray-600" : "text-red-600 font-medium"
        }`}
      >
        {intramural.location ? `Location: ${intramural.location}` : "No location yet"}
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

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 bottom-8 w-40 bg-white border rounded-md shadow-lg z-50">
          <button 
            className="block w-full px-4 py-2 text-left text-sm  text-sm sm:text-xs  hover:bg-green-100" 
            onClick={() => {
              openEditModal(intramural);
              setMenuOpen(false);
            }}
          >
            Update
          </button>
          <button 
            className="block w-full px-4 py-2 text-left  text-sm sm:text-xs  text-red-600 hover:bg-red-100" 
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

export default IntramuralCard;

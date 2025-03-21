import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Link } from "react-router-dom";

function IntramuralCard({ intramural, openEditModal }) {
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

  return (
    <div className="m-4 ml-0 bg-white p-4 rounded-lg shadow-md border w-64 relative overflow-hidden">
      {/* Header with Link */}
      <Link to="/intramural/events" state={{ id: intramural.id }}>
        <div className="bg-gray-800 text-white p-2 rounded-t-lg flex flex-col items-center">
          <span className="text-2xl font-extrabold">{intramural.name}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <p className="text-lg font-semibold text-gray-800">{intramural.start_date}</p>
        <p
          className={`text-sm font-medium ${
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
          <FiMoreVertical size={20} className="text-gray-600" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 bottom-8 w-40 bg-white border rounded-md shadow-lg z-50">
            <button className="block w-full px-4 py-2 text-left text-sm hover:bg-green-100" 
              onClick={() => {openEditModal(intramural);
                setMenuOpen((prev) => !prev);

              }}
            >
              Update
            </button>
            <button className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-green-100" onClick={() => setMenuOpen((prev) => !prev)
              }>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IntramuralCard;

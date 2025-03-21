import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";

export default function Filter({ activeTab, setActiveTab, search, setSearch, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "In Progress", value: "in progress" },
    { label: "Pending", value: "pending" },
    { label: "Complete", value: "complete" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-row gap-4 mb-4 relative">
      {/* Dropdown for Filtering */}
      <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-full justify-start items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none whitespace-nowrap"
      >
        <FaFilter className="w-4 h-4 text-green-600" />
        <span>{filterOptions.find((opt) => opt.value === activeTab)?.label}</span>
        <FaChevronDown className="w-4 h-4 text-gray-500" />
      </button>

        {isOpen && (
          <div
            className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          >
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`${
                  activeTab === option.value ? "bg-green-100 text-green-800" : "text-gray-700"
                } flex w-full items-center px-4 py-2 text-sm hover:bg-green-50`}
                onClick={() => {
                  setActiveTab(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder={placeholder || "Search ..."}
        className="w-full p-2 border rounded bg-white text-gray-700 border-gray-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

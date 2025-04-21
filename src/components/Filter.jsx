import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

export default function Filter({ activeTab, setActiveTab, search, setSearch, placeholder, filterOptions }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <div className="flex flex-row gap-4 mb-4 relative flex-wrap">
      {/* Dropdown for Filtering */}
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex w-full justify-start items-center gap-2 px-4 py-2 text-sm font-medium text-[#2A6D3A] bg-white border border-[#6BBF59]/30 rounded-lg shadow-sm hover:bg-[#F7FAF7] focus:outline-none focus:ring-2 focus:ring-[#6BBF59]/50 whitespace-nowrap transition-all duration-200"
        >
          <FiFilter className="w-4 h-4 text-[#6BBF59]" />
          <span>
            {filterOptions.find((opt) => opt.value === activeTab)?.label}
          </span>
          <FaChevronDown className="w-3 h-3 text-[#6BBF59] ml-1" />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-[#E6F2E8] rounded-lg shadow-lg z-50 overflow-hidden">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`${
                  activeTab === option.value
                    ? "bg-[#E6F2E8] text-[#2A6D3A] font-medium"
                    : "text-gray-700 hover:bg-[#F7FAF7]"
                } flex w-full items-center px-4 py-3 text-sm transition-colors duration-150`}
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
        className="w-full sm:w-auto flex-1 px-4 py-2 text-sm border rounded-lg bg-white text-gray-700 border-[#6BBF59]/30 focus:outline-none focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-transparent transition-all duration-200 placeholder-gray-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
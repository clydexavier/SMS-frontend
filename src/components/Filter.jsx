import React from 'react'

export default function Filter({ activeTab, setActiveTab, search, setSearch, placeholder }) {
  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-6 mb-4 text-gray-600">
        {["all", "pending", "in progress", "complete"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 uppercase text-sm border-b-2 cursor-pointer ${
              activeTab === tab ? "text-gray-900 border-gray-900 font-semibold" : "border-transparent"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder={placeholder ||"Search ..."}
        className="w-full p-2 mb-4 border rounded bg-white text-gray-700 border-gray-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}

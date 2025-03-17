import React, { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import IntramuralsCard from "../../components/admin/IntramuralsCard";

const intramuralsData = [
  {
    id: 1,
    name: "Women's Volleyball",
    type: "Double elim",
    participants: 4,
    status: "complete",
    date: "Mar 2025",
  },
  {
    id: 2,
    name: "Men's Basketball",
    type: "Double elim",
    participants: 0,
    status: "pending",
    date: "",
  },
];

export default function IntramuralsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredIntramurals = intramuralsData.filter((intramural) =>
    (activeTab === "all" || intramural.status === activeTab) &&
    intramural.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 text-gray-900">
      {/* Tabs */}
      <div className="flex gap-6 mb-4 text-gray-600">
        {["all", "pending", "in progress", "complete"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 uppercase text-sm border-b-2 ${
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
        placeholder="Search your intramurals"
        className="w-full p-2 mb-4 border rounded bg-white text-gray-700 border-gray-400"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Intramural List */}
      {filteredIntramurals.map((intramural) => (
        <IntramuralsCard key={intramural.id} intramural={intramural} />
      ))}
    </div>
  );
}

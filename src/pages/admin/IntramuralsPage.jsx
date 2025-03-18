import React, { useState } from "react";
import { Link } from "react-router-dom";
import IntramuralCard from "../../components/IntramuralCard";
import Filter from "../../components/Filter";

const intramuralsData = [
  {
    id: 1,
    name: "Salingkusog",
    location: "VSU",
    status: "complete",
    date: "March 2025",
  },
  {
    id: 2,
    name: "Saling Ina mo",
    location: "SLSU",
    status: "pending",
    date: "January 2025",
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
    <div className="flex flex-col w-full h-full">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Intramurals</h2>
      </div>
      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
        <Filter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          placeholder="Search intramural"
        />
        {/* Intramural List */}
        <ul className="flex flex-row">
        {filteredIntramurals.map((intramural) => (
          <li key={intramural.id}>
            <Link to="/intramural" state={{ id: intramural.id }}>
              <IntramuralCard intramural={intramural} />
            </Link>
          </li>
        ))}
        </ul>

      </div>
    </div>
  );
}

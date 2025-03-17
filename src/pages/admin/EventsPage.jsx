import React, { useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../../components/admin/EventCard";

const eventsData = [
  {
    id: 1,
    name: "Basketball",
    type: "Double elim",
    participants: 4,
    location: "VSU",
    status: "complete",
    month: "March",
    date: "March 2025",
  },
  {
    id: 2,
    name: "Volleyball",
    type: "Double elim",
    participants: 0,
    location: "SLSU",
    status: "pending",
    month: "January",
    date: "January 2025",
  },
];


export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredEvents = eventsData.filter((event) =>
    (activeTab === "all" || event.status === activeTab) &&
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full w-full p-6 bg-gray-100 text-gray-900">
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
        placeholder="Search your events"
        className="w-full p-2 mb-4 border rounded bg-white text-gray-700 border-gray-400"
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="flex flex-row">
      {filteredEvents.map((event) => (
        <li key={event.id}>
          <Link to="/intramural" state={{ id: event.id }}>
            <EventCard event={event} />
          </Link>
        </li>
      ))}
      </ul>

    </div>
  )
}

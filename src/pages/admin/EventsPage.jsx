import React, { useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../../components/admin/EventCard";
import Filter from "../../components/Filter";

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
    <div className="flex flex-col w-full h-full">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Events</h2>
      </div>
      <div className=" flex-1 p-6 bg-gray-100 text-gray-900">   
        <Filter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          placeholder="Search event"
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
    </div>
  )
}

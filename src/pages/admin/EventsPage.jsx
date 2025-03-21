import React, { useState } from "react";
import EventCard from "../../components/admin/EventCard";
import Filter from "../../components/Filter";
import EventModal from "../../components/admin/EventModal";

export default function EventsPage() {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Basketball",
      tournament_type: "Double elim",
      category: "Men",
      type: "Sports",
      participants: 4,
      gold: "5",
      silver: "5",
      bronze: "5",
      venue: "VSU",
      status: "complete",
      date: "March 2025",
    },
    {
      id: 2,
      name: "Volleyball",
      tournament_type: "Double elim",
      category: "Women",
      type: "Sports",
      participants: 0,
      gold: "5",
      silver: "5",
      bronze: "5",
      venue: "SLSU",
      status: "pending",
      date: "January 2025",
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const updateEvent = (id, updatedData) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updatedData } : e)));
    setSelectedEvent(null);
  };

  const addEvent = (newEvent) => {
    setEvents([...events, { id: events.length + 1, ...newEvent }]);
  };

  const openModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredEvents = events.filter(
    (event) =>
      (activeTab === "all" || event.status === activeTab) &&
      event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Events</h2>
      </div>

      {/* Add Button */}
      <div className="flex justify-end pt-4 pb-4 pr-4 mb-4 bg-gray-100">
        <button
          type="button"
          className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={openModal}
        >
          Add event
        </button>
      </div>

      {/* Filter and List */}
      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
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
              <EventCard event={event} openEditModal={openEditModal} />
            </li>
          ))}
        </ul>
      </div>

      {/* Event Modal */}
      <EventModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addEvent={addEvent}
        updateEvent={updateEvent}
        existingEvent={selectedEvent} // Pass the selected item for editing
      />
    </div>
  );
}

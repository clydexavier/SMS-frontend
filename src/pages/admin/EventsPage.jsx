import React, { useState, useEffect } from "react";
import EventCard from "../../components/admin/EventCard";
import Filter from "../../components/Filter";
import EventModal from "../../components/admin/EventModal";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";

export default function EventsPage() {
  const { intrams_id } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Create new event
  const addEvent = async (newEvent) => {
    try {
      setLoading(true);
      const response = await axiosClient.post(`/intramurals/${intrams_id}/events/create`, newEvent);
      setEvents([...events, response.data]);
      closeModal();
    } catch (err) {
      setError("Failed to create event");
      console.error("Error creating event:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update existing event
  const updateEvent = async (id, updatedData) => {
    try {
      setLoading(true);
      const response = await axiosClient.put(`/intramurals/${intrams_id}/events/${id}/edit`, updatedData);
      setEvents(prev => prev.map(event => event.id === id ? response.data : event));
      closeModal();
    } catch (err) {
      setError("Failed to update event");
      console.error("Error updating event:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        setLoading(true);
        await axiosClient.delete(`/intramurals/${intrams_id}/events/${id}`);
        setEvents(prev => prev.filter(event => event.id !== id));
      } catch (err) {
        setError("Failed to delete event");
        console.error("Error deleting event:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setError(null);
  };

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredEvents = events.filter(
    (event) =>
      (activeTab === "all" || event.status === activeTab) &&
      event.name.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/events`);
      setEvents(data);
    } catch (err) {
      setError("Failed to fetch events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (intrams_id) {
      fetchEvents();
    }
  }, [intrams_id]);

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
          disabled={loading}
        >
          Add event
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Filter and List */}
      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
        <Filter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          placeholder="Search event"
        />
        {events.length === 0 && !loading ? (
          <div className="text-center py-8 text-gray-500">
            No events found. Click "Add event" to create one.
          </div>
        ) : (
          <ul className="flex flex-row flex-wrap gap-4">
            {filteredEvents.map((event) => (
              <li key={event.id}>
                <EventCard 
                  event={event} 
                  openEditModal={openEditModal} 
                  deleteEvent={deleteEvent}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addEvent={addEvent}
        updateEvent={updateEvent}
        existingEvent={selectedEvent}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}
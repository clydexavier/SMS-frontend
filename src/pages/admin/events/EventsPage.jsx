import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import EventCard from "./cards/EventCard";
import EventModal from "./modal/EventModal";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { useParams } from "react-router-dom";
import { CalendarClock, Loader } from "lucide-react";

export default function EventsPage() {
  const { intrams_id } = useParams();

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "In Progress", value: "in progress" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ];

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const openModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setError(null);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  // Instead of calling fetchEvents directly, we trigger a refetch
  const addEvent = async (newEvent) => {
    try {
      setLoading(true);
      await axiosClient.post(
        `/intramurals/${intrams_id}/events/create`,
        newEvent
      );
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
      closeModal();
    } catch (err) {
      setError("Failed to create event");
      console.error("Error creating event:", err);
      setLoading(false);
    }
  };

  const updateEvent = async (id, updatedData) => {
    try {
      setLoading(true);
      console.log("Updating event with ID:", id, "and data:", updatedData);
      await axiosClient.patch(
        `/intramurals/${intrams_id}/events/${id}/edit`,
        updatedData
      );
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
      closeModal();
    } catch (err) {
      setError("Failed to update event");
      console.error("Error updating event:", err);
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    try {
      setLoading(true);
      await axiosClient.delete(`/intramurals/${intrams_id}/events/${id}`);
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
    } catch (err) {
      setError("Failed to delete event");
      console.error("Error deleting event:", err);
      setLoading(false);
    }
  };

  // Single source of truth for data fetching
  useEffect(() => {
    if (!intrams_id) return;
    
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const { data } = await axiosClient.get(
          `/intramurals/${intrams_id}/events`, 
          {
            params: {
              page: pagination.currentPage,
              status: activeTab,
              search: search,
            },
          }
        );
        
        setEvents(data.data);
        setPagination({
          currentPage: data.meta.current_page,
          perPage: data.meta.per_page,
          total: data.meta.total,
          lastPage: data.meta.last_page,
        });
      } catch (err) {
        setError("Failed to fetch events");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search input
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [search, activeTab, pagination.currentPage, intrams_id, shouldRefetch]);

  const handleFilterChange = (value, type) => {
    // Reset pagination to first page when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    if (type === 'tab') {
      setActiveTab(value);
    } else if (type === 'search') {
      setSearch(value);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-col w-full h-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <CalendarClock size={20} className="mr-2" /> Events
            </h2>
            <button
              type="button"
              className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
              onClick={openModal}
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Event
            </button>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
              {error}
            </div>
          )}

          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md border border-[#E6F2E8]">
            <Filter
              activeTab={activeTab}
              setActiveTab={(value) => handleFilterChange(value, 'tab')}
              search={search}
              setSearch={(value) => handleFilterChange(value, 'search')}
              placeholder="Search event"
              filterOptions={filterOptions}
            />
          </div>

          {/* Scrollable content area */}
          <div className="mt-4 flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : events.length === 0 ? (
              <div className="mt-4 flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <CalendarClock size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No events found</h3>
                <p className="text-gray-500 mt-1">Click "Add Event" to create one</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl border border-[#E6F2E8] shadow-sm">
                    <EventCard
                      event={event}
                      openEditModal={openEditModal}
                      deleteEvent={deleteEvent}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination in a fixed position at the bottom */}
          {!loading && events.length > 0 && (
            <div className="bg-white shadow-md rounded-xl border border-[#E6F2E8] p-2 mt-4 overflow-x-auto">
              <PaginationControls
                pagination={pagination}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

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
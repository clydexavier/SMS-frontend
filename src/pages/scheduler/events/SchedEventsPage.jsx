import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../../../axiosClient";
import EventCard from "./cards/EventCard";
import EventModal from "./modal/EventModal";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { useParams } from "react-router-dom";
import { CalendarClock, Loader, ArrowLeft } from "lucide-react";

export default function SchedEventsPage() {
  const { intrams_id } = useParams();

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Sports", value: "sports" },
    { label: "Dance", value: "dance" },
    { label: "Music", value: "music" },
  ];

  const [events, setEvents] = useState([]);
  const [umbrellaEvents, setUmbrellaEvents] = useState([]);
  const [intramsName, setEventName] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  
  // New state for tracking active umbrella event filter
  const [activeUmbrellaEvent, setActiveUmbrellaEvent] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const openModal = useCallback(() => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setError(null);
  }, []);

  const openEditModal = useCallback((event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handlePageChange = useCallback((page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  }, []);
  
  
  const handleUmbrellaClick = useCallback((umbrellaEvent) => {
    // Don't set state if we're already on this umbrella event to prevent double refresh
    if (activeUmbrellaEvent?.id === umbrellaEvent.id) return;
    
    // Set loading immediately to show spinner
    setLoading(true);
    
    setActiveUmbrellaEvent(umbrellaEvent);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [activeUmbrellaEvent]);
  
  // Clear umbrella filter
  const clearUmbrellaFilter = useCallback(() => {
    // Set loading immediately to show spinner
    setLoading(true);
    
    setActiveUmbrellaEvent(null);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Instead of calling fetchEvents directly, we trigger a refetch
  const addEvent = useCallback(async (newEvent) => {
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
  }, [intrams_id, closeModal]);

  const updateEvent = useCallback(async (id, updatedData) => {
    try {
      setLoading(true);
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
  }, [intrams_id, closeModal]);

  const deleteEvent = useCallback(async (event) => {
    try {
      await axiosClient.delete(`/intramurals/${intrams_id}/events/${event.id}`);
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
      return true;
    } catch (err) {
      setError("Failed to delete event");
      console.error("Error deleting event:", err);
      throw err;
    }
  }, [intrams_id]);

  // Single source of truth for data fetching
  useEffect(() => {
    if (!intrams_id) return;
    
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Add parent_id parameter if an umbrella event is selected
        const params = {
          page: pagination.currentPage,
          type: activeTab,
          search: search,
          show_umbrella: !activeUmbrellaEvent, // Don't show umbrella events when a parent is selected
        };
        
        if (activeUmbrellaEvent) {
          params.parent_id = activeUmbrellaEvent.id;
          params.show_subevents = true;
        }
        
        const { data } = await axiosClient.get(
          `/intramurals/${intrams_id}/events`, 
          { params }
        );
        
        setEvents(data.data);
        setEventName(data.event_name);
        setUmbrellaEvents(data.umbrella_events || []);
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
  }, [search, activeTab, pagination.currentPage, intrams_id, shouldRefetch, activeUmbrellaEvent]);

  const handleFilterChange = useCallback((value, type) => {
    // Reset pagination to first page when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    if (type === 'tab') {
      setActiveTab(value);
    } else if (type === 'search') {
      setSearch(value);
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-col w-full h-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <CalendarClock size={20} className="mr-2" /> {intramsName} Events
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

          {/* Umbrella Event Filter */}
          {activeUmbrellaEvent && (
            <div className="bg-[#F7FAF7] p-3 rounded-lg border border-[#E6F2E8] mb-4 flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500">Viewing sub-events for:</span>
                <h3 className="font-medium text-[#2A6D3A]">{activeUmbrellaEvent.name}</h3>
              </div>
              <button
                onClick={clearUmbrellaFilter}
                className="flex items-center text-sm text-[#2A6D3A] hover:text-[#5CAF4A] transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to all events
              </button>
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

          {/* Umbrella Events Quick Filters (only show when not viewing sub-events) */}
          {!activeUmbrellaEvent && umbrellaEvents && umbrellaEvents.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {umbrellaEvents.map(event => (
                <button
                  key={event.id}
                  onClick={() => handleUmbrellaClick(event)}
                  className="px-3 py-1.5 bg-[#E6F2E8] hover:bg-[#D4E8D7] text-[#2A6D3A] rounded-lg text-sm transition-colors"
                >
                  {event.name}
                </button>
              ))}
            </div>
          )}

          {/* Scrollable content area */}
          <div className="mt-4 flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : events.length === 0 ? (
              <div className="flex-1 h-full bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <CalendarClock size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">
                  {activeUmbrellaEvent 
                    ? `No sub-events found for ${activeUmbrellaEvent.name}` 
                    : "No events found"}
                </h3>
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
                      isUmbrella={event.is_umbrella}
                      onUmbrellaClick={event.is_umbrella ? () => handleUmbrellaClick(event) : null}
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
        umbrellaEvents={umbrellaEvents}
      />
    </div>
  );
}
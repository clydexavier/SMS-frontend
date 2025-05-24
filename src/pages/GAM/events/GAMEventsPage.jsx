import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../../../axiosClient";
import EventCard from "./cards/EventCard";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { CalendarClock, Loader, ArrowLeft } from "lucide-react";
import { useAuth } from "../../../auth/AuthContext";

export default function GAMEventsPage() {
  const {user} = useAuth();

  const intrams_id = user?.intrams_id;

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

  

  // Single source of truth for data fetching
  useEffect(() => {
    if (!intrams_id) {
      setLoading(false);
      return;
    }
    
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
        // FIX 4: Clear any previous errors on successful fetch
        setError(null);
      } catch (err) {
        setError("Failed to fetch events");
        console.error("Error fetching events:", err);
      } finally {
        // FIX 3: Ensure loading is always set to false
        setLoading(false);
      }
    };

    // FIX 5: Add proper debounce handling
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, search ? 500 : 0); // No debounce for non-search changes
    
    return () => clearTimeout(debounceTimer);
  }, [intrams_id, search, activeTab, pagination.currentPage, shouldRefetch, activeUmbrellaEvent]);

  const handleFilterChange = useCallback((value, type) => {
    // Reset pagination to first page when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    if (type === 'tab') {
      setActiveTab(value);
    } else if (type === 'search') {
      setSearch(value);
    }
  }, []);

  // FIX 6: Show loading message if user is not available
  if (!user) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader size={32} className="animate-spin text-[#2A6D3A]" />
        <span className="ml-2 text-gray-600">Loading user data...</span>
      </div>
    );
  }

  // FIX 7: Show error if intrams_id is not available
  if (!intrams_id) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-red-50 p-4 rounded-lg text-red-600 mb-4">
          <p>Unable to load events: No intramurals ID found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container - removed overflow-hidden to allow parent scrolling */}
        <div className="flex flex-1 flex-col w-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <CalendarClock size={20} className="mr-2" /> {intramsName} Events
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4 flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
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
                  disabled={loading}
                >
                  {event.name}
                </button>
              ))}
            </div>
          )}

          {/* Content area - removed overflow and let parent handle scrolling */}
          <div className="mt-4 flex flex-1 flex-col">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
                <span className="ml-2 text-gray-600">Loading events...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
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
                      isUmbrella={event.is_umbrella}
                      onUmbrellaClick={event.is_umbrella ? () => handleUmbrellaClick(event) : null}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination outside content area */}
          {!loading && events.length > 0 && (
            <div className="p-2 border-t border-[#E6F2E8] bg-white">
              <PaginationControls
                pagination={pagination}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import EventCard from "../../components/admin/EventCard";
import EventModal from "../../components/admin/EventModal";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { useParams } from "react-router-dom";

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

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="w-full h-40 p-4 bg-[#E6F2E8]/50 animate-pulse rounded-lg shadow-sm"
        >
          <div className="w-3/4 h-4 bg-[#E6F2E8]/70 mb-3 rounded" />
          <div className="w-1/2 h-4 bg-[#E6F2E8]/70 mb-2 rounded" />
          <div className="w-full h-2 bg-[#E6F2E8]/70 rounded" />
          <div className="w-5/6 h-2 bg-[#E6F2E8]/70 mt-2 rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full border-round">
      <div className="bg-[#F7FAF7] px-6 py-3 border-b border-gray-200 flex justify-between items-center">
        
        <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">Events</h2>
        <div>
          {error && (
            <div className="text-red-500 bg-red-50 px-3 py-1 rounded text-sm">
              {error}
            </div>
          )}
        </div>
        <button
          type="button"
          className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center"
          onClick={openModal}
          disabled={loading}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Event
        </button>
      </div>

      <div className="flex flex-col flex-1 p-6 bg-[#F7FAF7]">
        <div className="mb-6">
          <Filter
            activeTab={activeTab}
            setActiveTab={(value) => handleFilterChange(value, 'tab')}
            search={search}
            setSearch={(value) => handleFilterChange(value, 'search')}
            placeholder="Search event"
            filterOptions={filterOptions}
          />
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : events.length === 0 ? (
          <div className="relative flex-col w-full h-full text-center bg-white rounded-lg shadow-sm border border-gray-100">
            <svg className="mx-auto mt-4 h-12 w-12 text-[#2A6D3A]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="mt-4 text-[#2A6D3A]/70 font-medium">No events found</p>
            <p className="text-gray-500 text-sm mt-1">Click "Add Event" to create one</p>
          </div>
        ) : (
          <div className="w-full mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <div key={event.id} className="w-full h-auto">
                  <EventCard
                    event={event}
                    openEditModal={openEditModal}
                    deleteEvent={deleteEvent}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8">
              <PaginationControls
                pagination={pagination}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        )}
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
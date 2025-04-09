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

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const [pendingPage, setPendingPage] = useState(1); // <- Track user intent
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

  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/intramurals/${intrams_id}/events`,
        {
          params: {
            page: page,
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
      setPendingPage(null);
    }
  };

  const handlePageChange = (page) => {
    setPendingPage(page);
  };

  const addEvent = async (newEvent) => {
    try {
      setLoading(true);
      await axiosClient.post(
        `/intramurals/${intrams_id}/events/create`,
        newEvent
      );
      await fetchEvents(pagination.currentPage);
      closeModal();
    } catch (err) {
      setError("Failed to create event");
      console.error("Error creating event:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id, updatedData) => {
    try {
      setLoading(true);
      await axiosClient.patch(
        `/intramurals/${intrams_id}/events/${id}/edit`,
        updatedData
      );
      await fetchEvents(pagination.currentPage);
      closeModal();
    } catch (err) {
      setError("Failed to update event");
      console.error("Error updating event:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    try {
      setLoading(true);
      await axiosClient.delete(`/intramurals/${intrams_id}/events/${id}`);
      await fetchEvents(pagination.currentPage);
    } catch (err) {
      setError("Failed to delete event");
      console.error("Error deleting event:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pendingPage === null && search === "" && activeTab === "all") return;
    setLoading(true); // ← Ensure the skeleton shows during fetch

    const debounce = setTimeout(() => {
      const pageToFetch = pendingPage ?? pagination.currentPage;
      if (intrams_id) {
        fetchEvents(pageToFetch);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [search, activeTab, pendingPage, intrams_id]);

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="w-full h-40 p-4 bg-gray-300 animate-pulse rounded-md"
        >
          <div className="w-3/4 h-4 bg-gray-400 mb-3 rounded" />
          <div className="w-1/2 h-4 bg-gray-400 mb-2 rounded" />
          <div className="w-full h-2 bg-gray-400 rounded" />
          <div className="w-5/6 h-2 bg-gray-400 mt-2 rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full text-sm sm:text-xs md:text-sm lg:text-sm">
      <div>
        <h2 className="text-xl sm:text-lg md:text-xl font-semibold mb-2 text-[#006600]">
          Events
        </h2>
      </div>

      <div className="w-full bg-gray-100 pt-4 pb-4 px-4 mb-4">
        <div className="flex justify-end">
          <button
            type="button"
            className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm px-5 py-2.5 mb-2"
            onClick={openModal}
            disabled={loading}
          >
            Add Event
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
        <Filter
          activeTab={activeTab}
          setActiveTab={(value) => {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
            setPendingPage(1);
            setActiveTab(value);
          }}
          search={search}
          setSearch={(value) => {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
            setPendingPage(1);
            setSearch(value);
          }}
          placeholder="Search event"
          filterOptions={filterOptions}
        />

        {loading ? (
          <SkeletonLoader />
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No events found. Click "Add Event" to create one.
          </div>
        ) : (
          <div className="w-full mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="w-full h-40 p-4 bg-blue-200 outline outline-1 outline-black rounded-md"
                >
                  <EventCard
                    event={event}
                    openEditModal={openEditModal}
                    deleteEvent={deleteEvent}
                  />
                </div>
              ))}
            </div>

            <PaginationControls
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
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

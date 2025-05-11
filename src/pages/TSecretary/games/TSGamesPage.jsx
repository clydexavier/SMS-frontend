import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import PaginationControls from "../../components/PaginationControls";
import TSGameModal from "./modal/TSGamesModal";
import Filter from "../../components/Filter";
import { Calendar, Loader } from "lucide-react";

export default function TSGamePage() {
  const [schedules, setSchedules] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]); // Store all schedules for filtering
  const [eventStatus, setEventStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  // Filter state - similar to PlayersPage
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filterOptions, setFilterOptions] = useState([
    { label: "All", value: "All" },
    { label: "Scheduled", value: "Scheduled" },
    { label: "Unscheduled", value: "Unscheduled" },
  ]);

  const fetchEventStatus = async () => {
    try {
      const { data } = await axiosClient.get(`/tsecretary/event/status`);
      console.log("Event status:", data);

      setEventStatus(data); // expected to be 'pending', 'in_progress', or 'completed'
    } catch (err) {
      console.error("Failed to fetch event status", err);
      setError("Could not load event status.");
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/tsecretary/event/schedules`
      );
      
      // Store all schedules in a separate state
      setAllSchedules(data);
      
      // Initial filter will be applied in the useEffect
      applyFilters(data);
    } catch (err) {
      console.error("Failed to load schedules", err);
      setError("Could not load schedules.");
    } finally {
      setLoading(false);
    }
  };

  // Separate function to apply filters, doesn't fetch data
  const applyFilters = (data) => {
    // Apply filters
    let filteredData = data;
    if (activeTab === "Scheduled") {
      filteredData = data.filter(match => match.date && match.time);
    } else if (activeTab === "Unscheduled") {
      filteredData = data.filter(match => !match.date || !match.time);
    }
    
    // Apply search if needed
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(match => 
        (match.team1_name && match.team1_name.toLowerCase().includes(searchLower)) ||
        (match.team2_name && match.team2_name.toLowerCase().includes(searchLower)) ||
        match.match_id.toString().includes(searchLower)
      );
    }
    
    setSchedules(filteredData);
    setPagination((prev) => ({
      ...prev,
      total: filteredData.length,
      lastPage: Math.ceil(filteredData.length / prev.perPage),
    }));
  };

  // Load data once when component mounts
  useEffect(() => {
    const loadData = async () => {
      await fetchEventStatus();
      await fetchSchedules();
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only re-run if IDs change
  
  // Apply filtering without refetching data
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      applyFilters(allSchedules);
    }, 300); // Reduced from 1000ms as we're not making API calls
    
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, allSchedules]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const openScoreModal = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  const submitSchedule = async (id, scheduleData) => {
    try {
      await axiosClient.patch(
        `/intramurals/${intrams_id}/events/${event_id}/schedule/${id}/edit`,
        scheduleData
      );
      // Only fetch the schedules again, not the status
      await fetchSchedules();
    } catch (err) {
      console.error("Failed to update match schedule", err);
      setError("Failed to update match schedule."); // Use consistent error handling
    }
  };

  const currentItems = schedules.slice(
    (pagination.currentPage - 1) * pagination.perPage,
    pagination.currentPage * pagination.perPage
  );

  const generateMatches = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      // Replace with your actual API endpoint for generating matches
      await axiosClient.post(`/intramurals/${intrams_id}/events/${event_id}/generate_matches`);
      // Refetch all data since status might change too
      await fetchEventStatus();
      await fetchSchedules();
    } catch (err) {
      console.error("Failed to generate matches", err);
      setError("Failed to generate matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-col w-full h-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header section with responsive layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Calendar size={20} className="mr-2" /> Bracket Matches
            </h2>
            {eventStatus === "in_progress" && (
              <button
                type="button"
                onClick={generateMatches}
                disabled={loading}
                className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Generate Matches
              </button>
            )}
          </div>
          
          {/* Filter section */}
          {eventStatus === "in_progress" && (
            <div className="mb-4">
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md border border-[#E6F2E8]">
                <Filter
                  activeTab={activeTab}
                  setActiveTab={(value) => {
                    setPagination((prev) => ({ ...prev, currentPage: 1 }));
                    setActiveTab(value);
                  }}
                  search={search}
                  setSearch={(value) => {
                    setPagination((prev) => ({ ...prev, currentPage: 1 }));
                    setSearch(value);
                  }}
                  placeholder="Search team name or match ID"
                  filterOptions={filterOptions}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
              {error}
            </div>
          )}

          {/* Scrollable content area */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {loading ? (
              <div className="flex justify-center items-center py-16 bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : eventStatus === "completed" ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">Event Completed</h3>
                <p className="text-gray-500 mt-1">This event has been completed. No matches to show.</p>
              </div>
            ) : eventStatus === "pending" ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">Event Pending</h3>
                <p className="text-gray-500 mt-1">This event is pending. Matches will appear once the event begins.</p>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No matches found</h3>
                {eventStatus === "in_progress" && (
                  <p className="text-gray-500 mt-1">Click "Generate Matches" to create brackets</p>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#E6F2E8] shadow-md overflow-hidden min-h-0">
                {/* Matches grid with scrolling */}
                <div className="flex-1 overflow-auto p-4">
                  <div className="grid gap-4">
                    {currentItems.map((match) => (
                      <div
                        key={match.id}
                        className="bg-white rounded-xl border border-[#E6F2E8] shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-[#F7FAF7] transition"
                      >
                        <div className="text-sm text-gray-500 font-medium">
                          Match ID: {match.match_id}
                        </div>
                        <div className="flex items-center gap-2 font-medium text-base text-gray-800">
                          <span>{match.team1_name || "TBD"}</span>
                          <span className="text-gray-400">vs</span>
                          <span>{match.team2_name || "TBD"}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {match.date && match.time
                            ? new Date(`${match.date}T${match.time}`).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "TBA"}
                        </div>

                        <button
                          onClick={() => openScoreModal(match)}
                          className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-4 py-2 transition-colors"
                        >
                          Set Schedule
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Pagination with horizontal scroll if needed */}
                <div className="p-2 overflow-x-auto border-t border-[#E6F2E8] bg-white">
                  <PaginationControls
                    pagination={pagination}
                    handlePageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedMatch && (
        <TSGameModal
          isOpen={isModalOpen}
          selectedMatch={selectedMatch}
          onClose={closeModal}
          submitSchedule={submitSchedule}
        />
      )}
    </div>
  );
}
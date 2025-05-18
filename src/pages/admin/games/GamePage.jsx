import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import PaginationControls from "../../components/PaginationControls";
import MatchScheduleModal from "./modal/MatchScheduleModal";
import ScoreSubmissionModal from "./modal/ScoreSubmissionModal"; // You'll need to create this component
import Filter from "../../components/Filter";
import { Calendar, Loader, Award } from "lucide-react";

export default function GamePage() {
  const { intrams_id, event_id } = useParams();

  const [schedules, setSchedules] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [eventStatus, setEventStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  // Schedule modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  // Score submission modal state
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [selectedScoreMatch, setSelectedScoreMatch] = useState(null);
  
  // Filter state with added "Completed" option
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filterOptions, setFilterOptions] = useState([
    { label: "All", value: "All" },
    { label: "Scheduled", value: "Scheduled" },
    { label: "Unscheduled", value: "Unscheduled" },
    { label: "Completed", value: "Completed" },
  ]);

  const fetchEventStatus = async () => {
    try {
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/events/${event_id}/status`);
      setEventStatus(data);
    } catch (err) {
      console.error("Failed to fetch event status", err);
      setError("Could not load event status.");
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/schedule`
      );
      
      setAllSchedules(data);
      applyFilters(data);
    } catch (err) {
      console.error("Failed to load schedules", err);
      setError("Could not load schedules.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data) => {
    let filteredData = data;
    if (activeTab === "Scheduled") {
      filteredData = data.filter(match => match.date && match.time && !match.is_completed);
    } else if (activeTab === "Unscheduled") {
      filteredData = data.filter(match => (!match.date || !match.time) && !match.is_completed);
    } else if (activeTab === "Completed") {
      filteredData = data.filter(match => match.is_completed);
    }
    
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

  useEffect(() => {
    const loadData = async () => {
      await fetchEventStatus();
      await fetchSchedules();
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intrams_id, event_id]);
  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      applyFilters(allSchedules);
    }, 300);
    
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, allSchedules]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Schedule modal handlers
  const openScheduleModal = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  // Score modal handlers
  const openScoreModal = (match) => {
    setSelectedScoreMatch(match);
    setIsScoreModalOpen(true);
  };

  const closeScoreModal = () => {
    setIsScoreModalOpen(false);
    setSelectedScoreMatch(null);
  };

  const submitSchedule = async (id, scheduleData) => {
    try {
      await axiosClient.patch(
        `/intramurals/${intrams_id}/events/${event_id}/schedule/${id}/edit`,
        scheduleData
      );
      await fetchSchedules();
    } catch (err) {
      console.error("Failed to update match schedule", err);
      setError("Failed to update match schedule.");
    }
  };

  // Score submission handler
  const submitScore = async (matchId, scoreData) => {
    try {
      await axiosClient.post(
        `/intramurals/${intrams_id}/events/${event_id}/matches/${matchId}/score`,
        scoreData
      );
      console.log(scoreData); 
      await fetchSchedules();
    } catch (err) {
      console.error("Failed to submit match score", err);
      setError("Failed to submit match score.");
      throw err;
    }
  };

  const currentItems = schedules.slice(
    (pagination.currentPage - 1) * pagination.perPage,
    pagination.currentPage * pagination.perPage
  );

  const generateMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      await axiosClient.post(`/intramurals/${intrams_id}/events/${event_id}/generate_matches`);
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
        <div className="flex flex-col w-full h-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Calendar size={20} className="mr-2" /> Bracket Matches
            </h2>
            {eventStatus === "in progress" && (
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
          
          {eventStatus === "in progress" && (
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

          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {loading ? (
              <div className="flex justify-center items-center py-16 bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : eventStatus === "completed" ? (
              <div className="flex-1 bg-green-50 p-4 sm:p-8 rounded-xl text-center shadow-sm border border-green-200">
                <Calendar size={48} className="mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-medium text-green-800">Event Completed</h3>
                <p className="text-gray-600 mt-1">This event has been completed. No matches to show.</p>
              </div>
            ) : eventStatus === "pending" ? (
              <div className="flex-1 bg-yellow-50 p-4 sm:p-8 rounded-xl text-center shadow-sm border border-yellow-200">
                <Calendar size={48} className="mx-auto mb-4 text-yellow-400" />
                <h3 className="text-lg font-medium text-yellow-800">Event Pending</h3>
                <p className="text-gray-600 mt-1">This event is pending. Matches will appear once the event begins.</p>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="flex-1 bg-blue-50 p-4 sm:p-8 rounded-xl text-center shadow-sm border border-blue-200">
                <Calendar size={48} className="mx-auto mb-4 text-blue-400" />
                <h3 className="text-lg font-medium text-blue-800">No matches found</h3>
                {eventStatus === "in progress" && (
                  <p className="text-gray-600 mt-1">Click "Generate Matches" to create brackets</p>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#E6F2E8] shadow-md overflow-hidden min-h-0">
                <div className="flex-1 overflow-auto p-4">
                  <div className="grid gap-3">
                    {currentItems.map((match) => (
                      <div
                        key={match.id}
                        className={`bg-white rounded-xl border ${match.is_completed ? "border-green-200" : "border-[#E6F2E8]"} shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-[#F7FAF7] transition`}
                      >
                        <div className="text-sm text-gray-500 font-medium">
                          <span>
                        {match.date && match.time
                            ? new Date(`${match.date}T${match.time}`).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "TBA"}
                            </span>
                             
                        </div>
                        
                        <div className="flex items-center gap-2 font-medium text-base text-gray-800">
                          {/* Show winner in green if completed */}
                          <span className={match.winner_id === match.team_1 ? "font-bold text-green-600" : ""}>
                            {match.team1_name || "TBD"}
                          </span>
                              vs.
                          
                          <span className={match.winner_id === match.team_2 ? "font-bold text-green-600" : ""}>
                            {match.team2_name || "TBD"}
                          </span>
                        </div>
                        
                        

                        <div className="flex space-x-2">
                          {/* If match is scheduled but not completed, show both buttons */}
                          {match.date && match.time && !match.is_completed && (
                            <>
                              <button
                                onClick={() => openScheduleModal(match)}
                                className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-4 py-2 transition-colors"
                              >
                                Edit Schedule
                              </button>
                              <button
                                onClick={() => openScoreModal(match)}
                                className="text-white bg-[#2A6D3A] hover:bg-[#225E2F] font-medium rounded-lg text-xs px-4 py-2 transition-colors"
                              >
                                <Award size={12} className="inline mr-1" />
                                Submit Score
                              </button>
                            </>
                          )}
                          
                          {/* If match is not scheduled yet, only show schedule button */}
                          {(!match.date || !match.time) && !match.is_completed && (
                            <>
                            <button
                              onClick={() => openScheduleModal(match)}
                              className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-4 py-2 transition-colors"
                            >
                              Set Schedule
                            </button>
                            <button
                                onClick={() => openScoreModal(match)}
                                className="text-white bg-[#2A6D3A] hover:bg-[#225E2F] font-medium rounded-lg text-xs px-4 py-2 transition-colors"
                              >
                                <Award size={12} className="inline mr-1" />
                                Submit Score
                              </button>
                          </> 
                          )}
                         
                          {/* If match is completed, show completed status */}
                          {match.is_completed && (
                            <div className="text-green-600 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Completed
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
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

      {/* Schedule Modal */}
      {isModalOpen && selectedMatch && (
        <MatchScheduleModal
          isOpen={isModalOpen}
          selectedMatch={selectedMatch}
          onClose={closeScheduleModal}
          submitSchedule={submitSchedule}
        />
      )}

      {/* Score Submission Modal */}
      {isScoreModalOpen && selectedScoreMatch && (
        <ScoreSubmissionModal
          isOpen={isScoreModalOpen}
          match={selectedScoreMatch}
          onClose={closeScoreModal}
          submitScore={submitScore}
        />
      )}
    </div>
  );
}
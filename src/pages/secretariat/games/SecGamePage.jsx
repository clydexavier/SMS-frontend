import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import PaginationControls from "../../components/PaginationControls";
import MatchScheduleModal from "./modal/MatchScheduleModal";
import ScoreSubmissionModal from "./modal/ScoreSubmissionModal";
import Filter from "../../components/Filter";
import { Calendar, Loader, Award, FileText } from "lucide-react";

export default function SecGamePage() {
  const { intrams_id, event_id } = useParams();

  const [schedules, setSchedules] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [eventStatus, setEventStatus] = useState(null);
  const [tournamentType, setTournamentType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  
  // Filter state with added "Completed" option
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filterOptions, setFilterOptions] = useState([
    { label: "All", value: "All" },
    { label: "Scheduled", value: "Scheduled" },
    { label: "Unscheduled", value: "Unscheduled" },
    { label: "Completed", value: "Completed" },
  ]);

  // Download schedule function
  const downloadSchedulePDF = async () => {
    try {
      setIsDownloading(true);
      
      const response = await axiosClient.post(
        `/intramurals/${intrams_id}/events/${event_id}/schedule_pdf`,
        {},
        { responseType: 'blob' } // Important for handling binary data
      );
      
      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `schedule_${event_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Failed to download schedule PDF", err);
      setError("Failed to download schedule PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const fetchEventStatus = async () => {
    try {
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/events/${event_id}/status`);
      setEventStatus(data.status);
      setTournamentType(data.tournament_type);
    } catch (err) {
      console.error("Failed to fetch event status", err);
      setError("Could not load event status.");
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      // Skip fetching schedules if tournament type is "no bracket"
      if (tournamentType === "no bracket") {
        setAllSchedules([]);
        setSchedules([]);
        setLoading(false);
        return;
      }
      
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
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intrams_id, event_id]);
  
  useEffect(() => {
    if (tournamentType !== "") {
      fetchSchedules();
    }
  }, [tournamentType]);
  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      applyFilters(allSchedules);
    }, 300);
    
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, allSchedules]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const currentItems = schedules.slice(
    (pagination.currentPage - 1) * pagination.perPage,
    pagination.currentPage * pagination.perPage
  );

  // Render the "no bracket" message
  const renderNoBracketMessage = () => {
    return (
      <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
        <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-600">This event has no bracket</h3>
        <p className="text-gray-500 mt-1">This type of event doesn't use brackets or match scheduling.</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container - removed overflow-hidden to allow parent scrolling */}
        <div className="flex flex-1 flex-col w-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Calendar size={20} className="mr-2" /> Bracket Matches
            </h2>
            
            {/* Download Schedule Button - Only show when there are schedules */}
            {allSchedules.length > 0 && tournamentType !== "no bracket" && !loading && eventStatus === "in progress"&& (
              <button
                onClick={downloadSchedulePDF}
                disabled={isDownloading}
                className={`bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isDownloading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Download Schedule
                  </>
                )}
              </button>
            )}
          </div>
          
          {eventStatus === "in progress" && tournamentType !== "no bracket" && (
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

          {/* Content area - removed overflow and let parent handle scrolling */}
          <div className="flex flex-1 flex-col">
            {loading ? (
              <div className="flex justify-center items-center py-16 bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : tournamentType === "no bracket" ? (
              renderNoBracketMessage()
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
              <div className="flex flex-col bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                <div className="p-4">
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
                            </>
                          )}
                          
                          {/* If match is not scheduled yet, only show schedule button */}
                          {(!match.date || !match.time) && !match.is_completed && (
                            <>
                            
                          </> 
                          )}
                         
                          {/* If match is completed, show completed status */}
                          {match.is_completed === 1 && (
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
                
                  <PaginationControls
                    pagination={pagination}
                    handlePageChange={handlePageChange}
                  />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
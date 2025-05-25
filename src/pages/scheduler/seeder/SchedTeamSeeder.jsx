import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { useParams } from "react-router-dom";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { Users, Loader, Trophy } from "lucide-react";

export default function SchedTeamSeeder() {
  const { intrams_id, event_id } = useParams();

  const [teams, setTeams] = useState([]);
  const [seeds, setSeeds] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventStatus, setEventStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [tournamentType, setTournamentType] = useState("");

  // Added for consistency with PlayersPage
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filterOptions, setFilterOptions] = useState([
    { label: "All", value: "All" },
    { label: "Seeded", value: "Seeded" },
    { label: "Not Seeded", value: "Not Seeded" },
  ]);

  // Added pagination state similar to PlayersPage
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  useEffect(() => {
    const fetchEventStatus = async () => {
      setLoading(true);
      try {
        // Get event status first
        const { data } = await axiosClient.get(`/intramurals/${intrams_id}/events/${event_id}/status`);
        setEventStatus(data.status);
        setTournamentType(data.tournament_type);
        
        // Get event name
        const eventResponse = await axiosClient.get(`intramurals/${intrams_id}/events/${event_id}`);
        if (eventResponse.data && eventResponse.data.name) {
          setEventName(eventResponse.data.name);
        }
        
        // If event is pending and not "no bracket", load teams for seeding
        if (data.status === "pending" && data.tournament_type !== "no bracket") {
          const teamsResponse = await axiosClient.get(`intramurals/${intrams_id}/events/${event_id}/team_names`);
          const fetchedTeams = teamsResponse.data;
          setTeams(fetchedTeams);

          // Ensure team IDs are stored as numbers if they come as numbers
          const initialSeeds = {};
          fetchedTeams.forEach((team, index) => {
            // Store team.id as a number if it's numeric
            const teamId = typeof team.id === 'string' ? parseInt(team.id, 10) : team.id;
            initialSeeds[teamId] = index + 1;
          });
          setSeeds(initialSeeds);
          
          // Set pagination based on teams count
          setPagination(prev => ({
            ...prev,
            total: fetchedTeams.length,
            lastPage: Math.ceil(fetchedTeams.length / prev.perPage)
          }));
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching event data:", err);
        setError("Failed to load event data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventStatus();
  }, [intrams_id, event_id]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const randomizeSeeds = () => {
    try {
      // Use actual team IDs directly from the teams array to maintain data type consistency
      const teamIds = teams.map(team => team.id);
      const positions = Array.from({ length: teamIds.length }, (_, i) => i + 1);

      // Fisher-Yates shuffle algorithm for positions
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      // Create new seeds object
      const randomSeeds = {};
      teamIds.forEach((teamId, index) => {
        randomSeeds[teamId] = positions[index];
      });

      setSeeds(randomSeeds);
      // Clear any validation errors after randomizing
      setValidationErrors({});

    } catch (err) {
      console.error("Error in randomizeSeeds:", err);
      setError("Failed to randomize seeds. Please try again.");
    }
  };

  const resetSeeds = () => {
    try {
      const initialSeeds = {};
      teams.forEach((team, index) => {
        // Ensure consistent data type for team IDs
        const teamId = typeof team.id === 'string' ? parseInt(team.id, 10) : team.id;
        initialSeeds[teamId] = index + 1;
      });
      setSeeds(initialSeeds);
      // Clear any validation errors after resetting
      setValidationErrors({});
      
      } catch (err) {
      console.error("Error in resetSeeds:", err);
      setError("Failed to reset seeds. Please try again.");
    }
  };

  const validateSeeds = () => {
    try {
      const values = Object.values(seeds);
      const allInRange = values.every((seed) => seed >= 1 && seed <= teams.length);
      const valueSet = new Set(values);
      const allUnique = valueSet.size === values.length;
      
      // Check if all teams have a seed
      const allTeamsHaveSeeds = teams.every(team => seeds[team.id] !== undefined);
      if (!allTeamsHaveSeeds) {
        setError("Some teams are missing seed values. Please reset and try again.");
        return false;
      }
      
      // If seeds are valid, reset errors and return true
      if (allInRange && allUnique && allTeamsHaveSeeds) {
        setValidationErrors({});
        return true;
      }
      
      // Find and set specific validation errors
      const newErrors = {};
      
      // Check for duplicates
      if (!allUnique) {
        // Create a map to track count of each seed value
        const valueCounts = {};
        values.forEach(seed => {
          valueCounts[seed] = (valueCounts[seed] || 0) + 1;
        });
        
        // Find duplicate seeds and their teams
        Object.entries(seeds).forEach(([teamId, seed]) => {
          if (valueCounts[seed] > 1) {
            newErrors[teamId] = `Duplicate seed ${seed}`;
          }
        });
      }
      
      // Check for out of range values
      Object.entries(seeds).forEach(([teamId, seed]) => {
        if (seed < 1 || seed > teams.length) {
          newErrors[teamId] = `Seed must be between 1 and ${teams.length}`;
        }
      });
      
      setValidationErrors(newErrors);
      return false;
    } catch (err) {
      console.error("Error in validateSeeds:", err);
      setError("Failed to validate seeds. Please try again.");
      return false;
    }
  };

  const submitSeeds = async () => {
    if (!validateSeeds()) {
      setError(`Invalid seeding. Each team must have a unique seed between 1 and ${teams.length}.`);
      return;
    }
  
    setSubmitting(true);
    try {
      // Create a sorted array of participants to ensure they're in seed order
      // This is important as the backend might expect a specific ordering
      const sortedParticipants = [];
      
      // First, create objects with proper team info and seed
      teams.forEach(team => {
        sortedParticipants.push({
          id: team.id,
          name: team.name,
          seed: seeds[team.id]
        });
      });
      
      // Sort by seed value
      sortedParticipants.sort((a, b) => a.seed - b.seed);
      
      const participants = sortedParticipants.map(team => ({
        participant: {
          name: team.name, 
          seed: team.seed
        }
      }));
  
      // Try with a slightly different payload structure
      const payload = { 
        participants: participants
      };
      
      const response = await axiosClient.post(
        `/intramurals/${intrams_id}/events/${event_id}/start`, 
        payload
      );
  
      setSuccess(true);
      setEventStatus("in progress");
    } catch (err) {
      console.error("Error starting tournament:", err);
      if (err.response?.data) {
        console.error("Response data:", err.response.data);
      }
      setError(`Failed to start tournament: ${err.response?.data?.message || err.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter teams based on search and active tab
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === "All") return matchesSearch;
    if (activeTab === "Seeded") return matchesSearch && seeds[team.id] > 0;
    if (activeTab === "Not Seeded") return matchesSearch && (!seeds[team.id] || seeds[team.id] <= 0);
    
    return matchesSearch;
  });

  // Sort teams by seed value
  const sortedTeams = filteredTeams.length > 0 ? [...filteredTeams].sort((a, b) => {
    // Handle undefined seeds
    const seedA = seeds[a.id] !== undefined ? seeds[a.id] : Number.MAX_SAFE_INTEGER;
    const seedB = seeds[b.id] !== undefined ? seeds[b.id] : Number.MAX_SAFE_INTEGER;
    return seedA - seedB;
  }) : [];
  
  // Get paginated teams
  const paginatedTeams = sortedTeams.slice(
    (pagination.currentPage - 1) * pagination.perPage,
    pagination.currentPage * pagination.perPage
  );

  const renderStatusMessage = () => {
    let icon, title, message, bgColor, borderColor, textColor;

    switch (eventStatus) {
      case "in progress":
        icon = (
          <svg className="w-12 h-12 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
        title = "Event in Progress";
        message = "This event is currently in progress. The bracket has been created and matches are underway.";
        bgColor = "bg-green-50";
        borderColor = "border-green-200";
        textColor = "text-green-700";
        break;
      case "completed":
        icon = (
          <svg className="w-12 h-12 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
        title = "Event Completed";
        message = "This event has been completed. No further changes can be made to the tournament.";
        bgColor = "bg-blue-50";
        borderColor = "border-blue-200";
        textColor = "text-blue-700";
        break;
      default:
        return null;
    }

    return (
      <div className={`${bgColor} ${borderColor} flex flex-col w-full h-full border rounded-xl shadow-md p-8 text-center `}>
        {icon}
        <h3 className={`${textColor} text-xl font-medium mb-2`}>{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-1 flex-col w-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 ">
          {/* Header section with responsive layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Trophy size={20} className="mr-2" /> Team Seeder {eventName && <span className="ml-2 text-gray-600 font-normal">- {eventName}</span>}
            </h2>
            {eventStatus === "pending" && teams.length > 0 && tournamentType !== "no bracket" && (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={randomizeSeeds}
                  className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
                  disabled={loading || submitting}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Randomize Seeds
                </button>
                <button
                  type="button"
                  onClick={resetSeeds}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
                  disabled={loading || submitting}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Reset
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 p-4 rounded-lg text-green-600 text-center mb-4">
              Event started successfully! Redirecting to bracket view...
            </div>
          )}

          {/* Informational message about randomized seeding */}
          {eventStatus === "pending" && teams.length > 0 && tournamentType !== "no bracket" && (
            <div className="bg-blue-50 p-4 rounded-lg text-blue-600 text-sm mb-4 border border-blue-100">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  <strong>Note:</strong> Team seeding can only be done using the Randomize button. Click "Randomize Seeds" to automatically assign positions to all teams.
                </span>
              </div>
            </div>
          )}

          {/* Scrollable content area */}
          <div className="flex-1 flex flex-col min-h-0">
            {loading ? (
              <div className="flex justify-center items-center py-16 bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : tournamentType === "no bracket" ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Trophy size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">This event has no bracket</h3>
                <p className="text-gray-500 mt-1">This type of event doesn't require seeding or brackets and will be tracked directly in the system.</p>
              </div>
            ): eventStatus !== "pending" ? (
              <div className="flex-1 overflow-auto">
                {renderStatusMessage()}
              </div>
            )  : teams.length === 0 ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Trophy size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No teams found</h3>
                <p className="text-gray-500 mt-1">Add teams to the event before seeding</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#E6F2E8] shadow-md overflow-hidden min-h-0">
                {/* Table with horizontal and vertical scrolling */}
                <div className="flex-1 overflow-auto">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-[#F7FAF7] text-[#2A6D3A] border-b border-[#E6F2E8] sticky top-0">
                      <tr>
                        <th className="px-6 py-3 font-medium tracking-wider">Seed</th>
                        <th className="px-6 py-3 font-medium tracking-wider">Team Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTeams.map((team, idx) => (
                        <tr
                          key={team.id}
                          className={`border-b border-[#E6F2E8] hover:bg-[#F7FAF7] transition duration-200 ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 w-24">
                            <div className="relative">
                              <div className="border border-gray-200 rounded-lg px-3 py-2 w-full text-center bg-gray-50 font-medium">
                                {seeds[team.id] !== undefined ? seeds[team.id] : "-"}
                              </div>
                              {validationErrors[team.id] && (
                                <div className="absolute right-0 top-0 -mt-1 -mr-1">
                                  <span className="flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                  </span>
                                </div>
                              )}
                            </div>
                            {validationErrors[team.id] && (
                              <p className="text-red-500 text-xs mt-1">{validationErrors[team.id]}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium">{team.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination with horizontal scroll if needed */}
                <div className="p-2  border-t border-[#E6F2E8] bg-white">
                  <div className="flex justify-between items-center">
                    <div>
                      {paginatedTeams.length > 0 && (
                        <span className="text-sm text-gray-600">
                          Showing {(pagination.currentPage - 1) * pagination.perPage + 1} to {Math.min(pagination.currentPage * pagination.perPage, sortedTeams.length)} of {sortedTeams.length} teams
                        </span>
                      )}
                    </div>
                    {pagination.lastPage > 1 && (
                      <PaginationControls
                        currentPage={pagination.currentPage}
                        lastPage={pagination.lastPage}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Start Tournament Button - Only shown for pending events with teams and not "no bracket" type */}
          {eventStatus === "pending" && teams.length > 0 && tournamentType !== "no bracket" && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={submitSeeds}
                disabled={loading || submitting || Object.keys(validationErrors).length > 0}
                className={`px-5 py-2.5 rounded-lg shadow text-sm font-medium flex items-center ${
                  loading || submitting || Object.keys(validationErrors).length > 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#6BBF59] hover:bg-[#5CAF4A] text-white"
                }`}
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                )}
                Start Tournament
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
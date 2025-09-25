import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { useParams } from "react-router-dom";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { Users, Loader, Trophy } from "lucide-react";

export default function SchedTeamSeeder() {
  const { intrams_id, event_id } = useParams();

  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState(new Set());
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
    { label: "Selected", value: "Selected" },
    { label: "Not Selected", value: "Not Selected" },
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

          // Initialize with all teams selected by default
          const allTeamIds = new Set(fetchedTeams.map(team => team.id));
          setSelectedTeams(allTeamIds);

          // Initialize seeds for all teams
          const initialSeeds = {};
          fetchedTeams.forEach((team, index) => {
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

  // Handle seed input change
  const handleSeedChange = (teamId, value) => {
    const parsedValue = value === '' ? '' : parseInt(value, 10);
    
    // Allow empty value or valid numbers
    if (value === '' || (!isNaN(parsedValue) && parsedValue > 0)) {
      setSeeds(prev => ({
        ...prev,
        [teamId]: parsedValue
      }));
      
      // Clear validation error for this team when user starts typing
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[teamId];
        return newErrors;
      });
    }
  };

  // Handle individual team selection
  const handleTeamSelection = (teamId, isSelected) => {
    const newSelectedTeams = new Set(selectedTeams);
    if (isSelected) {
      newSelectedTeams.add(teamId);
      // Assign next available seed number if not already set
      if (!seeds[teamId]) {
        const selectedCount = newSelectedTeams.size;
        setSeeds(prev => ({
          ...prev,
          [teamId]: selectedCount
        }));
      }
    } else {
      newSelectedTeams.delete(teamId);
      // Remove seed for unselected team
      const newSeeds = { ...seeds };
      delete newSeeds[teamId];
      setSeeds(newSeeds);
    }
    setSelectedTeams(newSelectedTeams);
    setValidationErrors({});
  };

  // Handle select all/deselect all
  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      const allTeamIds = new Set(teams.map(team => team.id));
      setSelectedTeams(allTeamIds);
      // Re-initialize seeds for all teams
      const initialSeeds = {};
      teams.forEach((team, index) => {
        const teamId = typeof team.id === 'string' ? parseInt(team.id, 10) : team.id;
        initialSeeds[teamId] = seeds[teamId] || index + 1;
      });
      setSeeds(initialSeeds);
    } else {
      setSelectedTeams(new Set());
      setSeeds({});
    }
    setValidationErrors({});
  };

  const randomizeSeeds = () => {
    try {
      const selectedTeamsList = teams.filter(team => selectedTeams.has(team.id));
      if (selectedTeamsList.length === 0) {
        setError("Please select at least one team before randomizing seeds.");
        return;
      }

      const teamIds = selectedTeamsList.map(team => team.id);
      const positions = Array.from({ length: teamIds.length }, (_, i) => i + 1);

      // Fisher-Yates shuffle algorithm for positions
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      // Create new seeds object only for selected teams
      const randomSeeds = {};
      teamIds.forEach((teamId, index) => {
        randomSeeds[teamId] = positions[index];
      });

      setSeeds(randomSeeds);
      setValidationErrors({});

    } catch (err) {
      console.error("Error in randomizeSeeds:", err);
      setError("Failed to randomize seeds. Please try again.");
    }
  };

  const resetSeeds = () => {
    try {
      const selectedTeamsList = teams.filter(team => selectedTeams.has(team.id));
      if (selectedTeamsList.length === 0) {
        setError("Please select at least one team before resetting seeds.");
        return;
      }

      const initialSeeds = {};
      selectedTeamsList.forEach((team, index) => {
        const teamId = typeof team.id === 'string' ? parseInt(team.id, 10) : team.id;
        initialSeeds[teamId] = index + 1;
      });
      setSeeds(initialSeeds);
      setValidationErrors({});
      
    } catch (err) {
      console.error("Error in resetSeeds:", err);
      setError("Failed to reset seeds. Please try again.");
    }
  };

  // Auto-fill missing seeds
  const autoFillSeeds = () => {
    try {
      const selectedTeamsList = teams.filter(team => selectedTeams.has(team.id));
      if (selectedTeamsList.length === 0) {
        setError("Please select at least one team before auto-filling seeds.");
        return;
      }

      const existingSeeds = selectedTeamsList
        .map(team => seeds[team.id])
        .filter(seed => seed !== undefined && seed !== '');
      
      const usedSeeds = new Set(existingSeeds);
      const availableSeeds = [];
      
      // Find available seed numbers
      for (let i = 1; i <= selectedTeamsList.length; i++) {
        if (!usedSeeds.has(i)) {
          availableSeeds.push(i);
        }
      }

      const newSeeds = { ...seeds };
      let availableIndex = 0;

      // Assign available seeds to teams without seeds
      selectedTeamsList.forEach(team => {
        if (seeds[team.id] === undefined || seeds[team.id] === '') {
          if (availableIndex < availableSeeds.length) {
            newSeeds[team.id] = availableSeeds[availableIndex];
            availableIndex++;
          }
        }
      });

      setSeeds(newSeeds);
      setValidationErrors({});
    } catch (err) {
      console.error("Error in autoFillSeeds:", err);
      setError("Failed to auto-fill seeds. Please try again.");
    }
  };

  const validateSeeds = () => {
    try {
      const selectedTeamsList = teams.filter(team => selectedTeams.has(team.id));
      if (selectedTeamsList.length === 0) {
        setError("Please select at least one team for the tournament.");
        return false;
      }

      if (selectedTeamsList.length < 2) {
        setError("At least 2 teams must be selected for a tournament.");
        return false;
      }

      const selectedTeamIds = selectedTeamsList.map(team => team.id);
      const values = selectedTeamIds.map(teamId => seeds[teamId]).filter(seed => seed !== undefined && seed !== '');
      
      const allInRange = values.every((seed) => seed >= 1 && seed <= selectedTeamsList.length);
      const valueSet = new Set(values);
      const allUnique = valueSet.size === values.length;
      
      // Check if all selected teams have a seed
      const allSelectedTeamsHaveSeeds = selectedTeamIds.every(teamId => seeds[teamId] !== undefined && seeds[teamId] !== '');
      if (!allSelectedTeamsHaveSeeds) {
        setError("Some selected teams are missing seed values. Please fill all seed values or use Auto-fill.");
        return false;
      }
      
      // If seeds are valid, reset errors and return true
      if (allInRange && allUnique && allSelectedTeamsHaveSeeds) {
        setValidationErrors({});
        return true;
      }
      
      // Find and set specific validation errors
      const newErrors = {};
      
      // Check for duplicates
      if (!allUnique) {
        const valueCounts = {};
        values.forEach(seed => {
          valueCounts[seed] = (valueCounts[seed] || 0) + 1;
        });
        
        Object.entries(seeds).forEach(([teamId, seed]) => {
          if (selectedTeams.has(parseInt(teamId)) && valueCounts[seed] > 1) {
            newErrors[teamId] = `Duplicate seed ${seed}`;
          }
        });
      }
      
      // Check for out of range values
      Object.entries(seeds).forEach(([teamId, seed]) => {
        if (selectedTeams.has(parseInt(teamId)) && (seed < 1 || seed > selectedTeamsList.length)) {
          newErrors[teamId] = `Seed must be between 1 and ${selectedTeamsList.length}`;
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
    const selectedTeamsList = teams.filter(team => selectedTeams.has(team.id));
    
    if (!validateSeeds()) {
      setError(`Invalid seeding. Each selected team must have a unique seed between 1 and ${selectedTeamsList.length}.`);
      return;
    }
  
    setSubmitting(true);
    try {
      // Create a sorted array of participants to ensure they're in seed order
      const sortedParticipants = [];
      
      // Only include selected teams
      selectedTeamsList.forEach(team => {
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
    if (activeTab === "Selected") return matchesSearch && selectedTeams.has(team.id);
    if (activeTab === "Not Selected") return matchesSearch && !selectedTeams.has(team.id);
    if (activeTab === "Seeded") return matchesSearch && selectedTeams.has(team.id) && seeds[team.id] > 0;
    if (activeTab === "Not Seeded") return matchesSearch && selectedTeams.has(team.id) && (!seeds[team.id] || seeds[team.id] <= 0);
    
    return matchesSearch;
  });

  // Sort teams by seed value
  const sortedTeams = filteredTeams.length > 0 ? [...filteredTeams].sort((a, b) => {
    // Selected teams with seeds first, then selected without seeds, then unselected
    const aSelected = selectedTeams.has(a.id);
    const bSelected = selectedTeams.has(b.id);
    const aSeed = seeds[a.id];
    const bSeed = seeds[b.id];

    if (aSelected && bSelected) {
      if (aSeed !== undefined && bSeed !== undefined) {
        return aSeed - bSeed;
      }
      if (aSeed !== undefined) return -1;
      if (bSeed !== undefined) return 1;
      return 0;
    }
    if (aSelected) return -1;
    if (bSelected) return 1;
    return 0;
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

  const selectedCount = selectedTeams.size;
  const totalCount = teams.length;
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-1 flex-col w-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 ">
          {/* Header section with responsive layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Trophy size={20} className="mr-2" /> Team Seeder {eventName && <span className="ml-2 text-gray-600 font-normal">- {eventName}</span>}
              {selectedCount > 0 && (
                <span className="ml-2 text-sm bg-[#E6F2E8] text-[#2A6D3A] px-2 py-1 rounded-lg">
                  {selectedCount} of {totalCount} selected
                </span>
              )}
            </h2>
            {eventStatus === "pending" && teams.length > 0 && tournamentType !== "no bracket" && (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={autoFillSeeds}
                  className="bg-[#4A90E2] hover:bg-[#3A7FD1] text-white px-3 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
                  disabled={loading || submitting || selectedCount === 0}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Auto-fill
                </button>
                <button
                  type="button"
                  onClick={randomizeSeeds}
                  className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-3 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
                  disabled={loading || submitting || selectedCount === 0}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Randomize
                </button>
                <button
                  type="button"
                  onClick={resetSeeds}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
                  disabled={loading || submitting || selectedCount === 0}
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

          {/* Informational message about team selection and seeding */}
          {eventStatus === "pending" && teams.length > 0 && tournamentType !== "no bracket" && (
            <div className="bg-blue-50 p-4 rounded-lg text-blue-600 text-sm mb-4 border border-blue-100">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  <strong>Note:</strong> Select teams and assign seed numbers manually. You can also use "Auto-fill" for missing seeds, "Randomize" for random positions, or "Reset" to return to sequential order. Seeds must be unique numbers between 1 and {selectedCount || 'N'}.
                </span>
              </div>
            </div>
          )}

          {/* Filter section */}
          {eventStatus === "pending" && teams.length > 0 && tournamentType !== "no bracket" && (
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
                  placeholder="Search team name"
                  filterOptions={filterOptions}
                />
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
                <p className="text-gray-500 mt-1">Add teams to the intramural before seeding</p>
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
                        <th className="px-6 py-3 font-medium tracking-wider text-right">
                          <div className="flex items-center justify-end">
                            <span className="mr-2">Select</span>
                            <input
                              type="checkbox"
                              checked={allSelected}
                              ref={input => {
                                if (input) input.indeterminate = someSelected;
                              }}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                              className="rounded border-gray-300 text-[#6BBF59] focus:ring-[#6BBF59] h-4 w-4"
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTeams.map((team, idx) => (
                        <tr
                          key={team.id}
                          className={`border-b border-[#E6F2E8] hover:bg-[#F7FAF7] transition duration-200 ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } ${selectedTeams.has(team.id) ? "ring-1 ring-[#6BBF59] ring-opacity-20" : ""}`}
                        >
                          <td className="px-6 py-4 w-32">
                            <div className="relative">
                              {selectedTeams.has(team.id) ? (
                                <input
                                  type="number"
                                  value={seeds[team.id] || ''}
                                  onChange={(e) => handleSeedChange(team.id, e.target.value)}
                                  placeholder="Enter seed"
                                  min="1"
                                  max={selectedCount}
                                  className={`border rounded-lg px-3 py-2 w-full text-center font-medium focus:outline-none focus:ring-2 ${
                                    validationErrors[team.id] 
                                      ? "border-red-500 bg-red-50 focus:ring-red-500" 
                                      : "border-gray-300 bg-white focus:ring-[#6BBF59] focus:border-[#6BBF59]"
                                  }`}
                                />
                              ) : (
                                <div className="border border-gray-200 rounded-lg px-3 py-2 w-full text-center font-medium bg-gray-50 text-gray-400">
                                  -
                                </div>
                              )}
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
                          <td className={`px-6 py-4 font-medium ${
                            selectedTeams.has(team.id) ? "text-[#2A6D3A]" : "text-gray-500"
                          }`}>
                            {team.name}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <input
                              type="checkbox"
                              checked={selectedTeams.has(team.id)}
                              onChange={(e) => handleTeamSelection(team.id, e.target.checked)}
                              className="rounded border-gray-300 text-[#6BBF59] focus:ring-[#6BBF59] h-4 w-4"
                            />
                          </td>
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
          
          {/* Start Tournament Button - Only shown for pending events with selected teams and not "no bracket" type */}
          {eventStatus === "pending" && selectedCount > 0 && tournamentType !== "no bracket" && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={submitSeeds}
                disabled={loading || submitting || Object.keys(validationErrors).length > 0 || selectedCount < 2}
                className={`px-5 py-2.5 rounded-lg shadow text-sm font-medium flex items-center ${
                  loading || submitting || Object.keys(validationErrors).length > 0 || selectedCount < 2
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
                Start Event ({selectedCount} teams)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
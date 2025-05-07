import { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import { useParams } from "react-router-dom";

export default function TeamSeeder() {
  const { intrams_id, event_id } = useParams();

  const [teams, setTeams] = useState([]);
  const [seeds, setSeeds] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [eventName, setEventName] = useState(""); 
  const [eventStatus, setEventStatus] = useState(null);

  useEffect(() => {
    const fetchEventStatus = async () => {
      setLoading(true);
      try {
        // Get event status first
        const { data } = await axiosClient.get(`/intramurals/${intrams_id}/events/${event_id}/status`);
        setEventStatus(data);
        
        // Get event name
        const eventResponse = await axiosClient.get(`intramurals/${intrams_id}/events/${event_id}`);
        if (eventResponse.data && eventResponse.data.name) {
          setEventName(eventResponse.data.name);
        }
        
        // If event is pending, load teams for seeding
        if (data === "pending") {
            console.log("pending");
          const teamsResponse = await axiosClient.get(`intramurals/${intrams_id}/events/${event_id}/team_names`);
          console.log(teamsResponse.data);
          const fetchedTeams = teamsResponse.data;
          setTeams(fetchedTeams);

          const initialSeeds = {};
          fetchedTeams.forEach((team, index) => {
            initialSeeds[team.id] = index + 1;
          });
          setSeeds(initialSeeds);
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

  const handleSeedChange = (teamId, value) => {
    const seedValue = Math.max(1, parseInt(value) || 1);
    setSeeds((prev) => ({ ...prev, [teamId]: seedValue }));
  };

  const randomizeSeeds = () => {
    const teamIds = Object.keys(seeds);
    const positions = Array.from({ length: teamIds.length }, (_, i) => i + 1);

    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    const randomSeeds = {};
    teamIds.forEach((teamId, index) => {
      randomSeeds[teamId] = positions[index];
    });

    setSeeds(randomSeeds);
  };

  const resetSeeds = () => {
    const initialSeeds = {};
    teams.forEach((team, index) => {
      initialSeeds[team.id] = index + 1;
    });
    setSeeds(initialSeeds);
  };

  const validateSeeds = () => {
    const values = Object.values(seeds);
    const allInRange = values.every((seed) => seed >= 1 && seed <= teams.length);
    const allUnique = new Set(values).size === values.length;
    return allInRange && allUnique;
  };

  const submitSeeds = async () => {
    if (!validateSeeds()) {
      setError(`Invalid seeding. Each team must have a unique seed between 1 and ${teams.length}.`);
      return;
    }

    setSubmitting(true);
    try {
      const participants = teams.map((team) => ({
        name: team.name,
        seed: seeds[team.id],
      }));
      await axiosClient.post(`/intramurals/${intrams_id}/events/${event_id}/start`, {
        participants,
      });

      setSuccess(true);
      setEventStatus("in progress");
      // Consider adding a redirect here after successful submission
    } catch (err) {
      console.error(err);
      setError("Failed to start tournament. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const sortedTeams = teams.length > 0 ? [...teams].sort((a, b) => seeds[a.id] - seeds[b.id]) : [];

  // Skeleton loader similar to TeamsPage
  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-[#e0f2f1] rounded w-12" />
            <div className="h-4 bg-[#e0f2f1] rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
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

  const renderSeeder = () => {
    if (teams.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-[#E6F2E8]">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-600">No teams available for seeding</h3>
          <p className="text-sm text-gray-500 mt-2">Please add teams to the whole intramural first.</p>
        </div>
      );
    }

    return (
      <>
        <div className="bg-white shadow-md rounded-xl border border-[#E6F2E8] overflow-hidden">
          <div className="p-4 bg-[#F7FAF7] border-b border-[#E6F2E8]">
            <h3 className="font-medium text-[#2A6D3A]">Team Seeding</h3>
            <p className="text-sm text-gray-600 mt-1">
              Assign a unique seed number to each team (1 being the highest). 
              Seeds determine the initial matchups in the tournament bracket.
            </p>
          </div>
          
          <div className="divide-y divide-[#E6F2E8]">
            {sortedTeams.map((team) => (
              <div
                key={team.id}
                className="flex items-center p-4 hover:bg-[#F7FAF7] transition-colors"
              >
                <div className="w-16 flex justify-center">
                  <input
                    type="number"
                    min="1"
                    max={teams.length}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-12 text-center focus:ring-2 focus:ring-[#6BBF59] focus:border-[#6BBF59]"
                    value={seeds[team.id] || ""}
                    onChange={(e) => handleSeedChange(team.id, e.target.value)}
                    disabled={submitting}
                  />
                </div>
                <div className="flex-1 font-medium text-gray-800 ml-4">{team.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={submitSeeds}
            disabled={loading || submitting || teams.length === 0}
            className={`px-5 py-2.5 rounded-lg shadow text-sm font-medium flex items-center ${
              loading || submitting || teams.length === 0
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
            Start Event
          </button>
        </div>
      </>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader />;
    }
    
    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-sm text-red-700 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {error}
        </div>
      );
    }

    if (success) {
      return (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md text-sm text-green-700 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Event started successfully! Redirecting to bracket view...
        </div>
      );
    }

    if (eventStatus === "in progress" || eventStatus === "completed") {
      return renderStatusMessage();
    }

    if (eventStatus === "pending") {
      return renderSeeder();
    }

    return (
      <div className="text-center text-gray-500">
        Unable to determine event status. Please refresh the page.
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header section */}
      <div className="bg-[#F7FAF7] px-6 py-3 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#2A6D3A]">Team Seeder</h2>
          {eventName && (
            <p className="text-sm text-gray-600">{eventName}</p>
          )}
        </div>
        {eventStatus === "pending" && teams.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={randomizeSeeds}
              className="bg-[#E6F2E8] hover:bg-[#D8EBDB] text-[#2A6D3A] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center"
              disabled={submitting || loading}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Randomize
            </button>
            <button
              onClick={resetSeeds}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center"
              disabled={submitting || loading}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-[#F7FAF7]">
        {renderContent()}
      </div>
    </div>
  );
}
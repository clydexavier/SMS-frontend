import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";

export default function BracketPage() {
  const { intrams_id, event_id } = useParams();

  const [bracketId, setBracketId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [eventStatus, setEventStatus] = useState("pending");

  const [teams, setTeams] = useState([]);
  const [seeds, setSeeds] = useState({});

  const handleLoad = () => setIsLoaded(true);

  useEffect(() => {
    const fetchEventStatusAndBracket = async () => {
      try {
        const res = await axiosClient.get(`/intramurals/${intrams_id}/events/${event_id}/bracket`);
        setBracketId(res.data.bracket_id);
        setEventStatus(res.data.status); // Assuming API returns this
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bracket information.");
      }
    };

    fetchEventStatusAndBracket();
  }, [intrams_id, event_id]);

  useEffect(() => {
    if (eventStatus === "pending") {
      axiosClient
        .get(`/intramurals/${intrams_id}/events/${event_id}/team_names`)
        .then(({ data }) => {
          setTeams(data);
          const initialSeeds = {};
          data.forEach((team, index) => {
            initialSeeds[team.id] = index + 1;
          });
          setSeeds(initialSeeds);
        })
        .catch(() => setError("Failed to load teams."));
    }
  }, [eventStatus]);

  const handleSeedChange = (teamId, value) => {
    setSeeds((prev) => ({ ...prev, [teamId]: Number(value) }));
  };

  const submitSeeds = async () => {
    try {
      // Build Challonge-compatible participants payload
      const participants = teams.map((team) => ({
        name: team.name,
        seed: seeds[team.id],
      }));
      console.log(participants);
      await axiosClient.post(`/intramurals/${intrams_id}/events/${event_id}/start`, {
        participants,
      });
  
      // Fetch updated bracket state
      const res = await axiosClient.get(`/intramurals/${intrams_id}/events/${event_id}/bracket`);
      setBracketId(res.data.bracket_id);
      setEventStatus(res.data.status);
    } catch (err) {
      console.error(err);
      alert("Failed to start tournament. Check seeding and try again.");
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-[#F7FAF7] px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">Bracket</h2>
      </div>

      <div className="flex-1 p-6 bg-[#F7FAF7]">
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded mb-4">{error}</div>
        )}

        {eventStatus === "pending" && (
          <div className="bg-white p-6 shadow-md rounded-xl border border-[#E6F2E8]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] mb-4">Assign Team Seeding</h3>
            <div className="space-y-4">
              {teams.map((team) => (
                <div key={team.id} className="flex items-center gap-4">
                  <div className="font-medium w-64">{team.name}</div>
                  <input
                    type="number"
                    min="1"
                    className="border rounded px-2 py-1 w-20"
                    value={seeds[team.id] || ""}
                    onChange={(e) => handleSeedChange(team.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={submitSeeds}
              className="mt-6 bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow text-sm font-medium"
            >
              Submit Seeding & Start Tournament
            </button>
          </div>
        )}

        {eventStatus === "in progress" && bracketId && (
          <div className="relative overflow-x-auto bg-white shadow-md rounded-xl border border-[#E6F2E8] min-h-[500px] mt-4">
            {!isLoaded && (
              <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-80 rounded-xl">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6BBF59] mx-auto"></div>
                  <p className="text-gray-600 text-sm font-medium">Loading bracket...</p>
                </div>
              </div>
            )}
            <iframe
              src={`https://challonge.com/${bracketId}/module`}
              width="100%"
              height="500"
              allowtransparency="true"
              onLoad={handleLoad}
              className={`rounded-xl w-full border-none ${isLoaded ? "block" : "hidden"}`}
              title="Tournament Bracket"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}

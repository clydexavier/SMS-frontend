import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";

const ResultModal = ({ isOpen, onClose, onSubmit, event_id, intrams_id, existingData }) => {
  const [teams, setTeams] = useState([]);
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [bronze, setBronze] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(
          `/intramurals/${intrams_id}/events/${event_id}/team_names`
        );
        setTeams(res.data || []);
        setError(null);

        // Prefill if editing
        if (existingData) {
          setGold(existingData.gold_team_id?.toString() || "");
          setSilver(existingData.silver_team_id?.toString() || "");
          setBronze(existingData.bronze_team_id?.toString() || "");
        } else {
          setGold("");
          setSilver("");
          setBronze("");
        }
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setError("Failed to load teams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [isOpen, event_id, intrams_id, existingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gold || !silver || !bronze) {
      setError("Please select all medalists");
      return;
    }

    if (gold === silver || gold === bronze || silver === bronze) {
      setError("Each medal must be awarded to a different team");
      return;
    }

    try {
      await onSubmit({
        gold_team_id: gold,
        silver_team_id: silver,
        bronze_team_id: bronze,
      });

      setGold("");
      setSilver("");
      setBronze("");
      setError(null);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to submit results. Please try again.");
    }
  };

  if (!isOpen) return null;

  const renderSelect = (label, value, setter, exclude = [], colorTheme = "gray", iconColor = "gray-500", textColor = "gray-700") => (
    <div className={`bg-${colorTheme}-50 border border-${colorTheme}-200 rounded-lg p-4`}>
      <label className={`block text-sm font-medium text-${textColor} mb-2 flex items-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 text-${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => setter(e.target.value)}
        className={`w-full border border-${colorTheme}-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${colorTheme}-500 bg-white`}
        required
      >
        <option value="">Select Team</option>
        {teams
          .filter(team => !exclude.includes(team.id.toString()))
          .map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Tournament Results</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-150"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {renderSelect("Gold Medalist (1st Place)", gold, setGold, [silver, bronze], "amber", "amber-500", "amber-800")}
              {renderSelect("Silver Medalist (2nd Place)", silver, setSilver, [gold, bronze], "gray", "gray-400", "gray-700")}
              {renderSelect("Bronze Medalist (3rd Place)", bronze, setBronze, [gold, silver], "orange", "orange-500", "orange-800")}
            </div>
            <button
              type="submit"
              className="w-full bg-[#6BBF59] hover:bg-[#5CAF4A] text-white py-2 rounded-lg mt-4 transition duration-150"
            >
              {existingData ? "Update Results" : "Submit Results"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResultModal;

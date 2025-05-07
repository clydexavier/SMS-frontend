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

  // Custom medal card components with consistent theme
  const GoldMedalCard = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 transition-all hover:shadow-md">
      <label className="block text-sm font-medium text-amber-800 mb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Gold Medalist (1st Place)
      </label>
      <select
        value={gold}
        onChange={(e) => setGold(e.target.value)}
        className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        required
      >
        <option value="">Select Team</option>
        {teams
          .filter(team => team.id.toString() !== silver && team.id.toString() !== bronze)
          .map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
      </select>
    </div>
  );

  const SilverMedalCard = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Silver Medalist (2nd Place)
      </label>
      <select
        value={silver}
        onChange={(e) => setSilver(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
        required
      >
        <option value="">Select Team</option>
        {teams
          .filter(team => team.id.toString() !== gold && team.id.toString() !== bronze)
          .map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
      </select>
    </div>
  );

  const BronzeMedalCard = () => (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 transition-all hover:shadow-md">
      <label className="block text-sm font-medium text-orange-800 mb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Bronze Medalist (3rd Place)
      </label>
      <select
        value={bronze}
        onChange={(e) => setBronze(e.target.value)}
        className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        required
      >
        <option value="">Select Team</option>
        {teams
          .filter(team => team.id.toString() !== gold && team.id.toString() !== silver)
          .map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-[#F7FAF7] rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
          <h3 className="text-xl font-semibold text-[#2A6D3A]">Tournament Results</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#2A6D3A] transition duration-150"
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
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6BBF59]"></div>
            <p className="mt-3 text-sm text-gray-600">Loading teams...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <GoldMedalCard />
              <SilverMedalCard />
              <BronzeMedalCard />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#6BBF59] hover:bg-[#5CAF4A] text-white py-2.5 rounded-lg transition duration-150 font-medium shadow-sm flex items-center justify-center"
              >
                {existingData ? "Update Results" : "Submit Results"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResultModal;
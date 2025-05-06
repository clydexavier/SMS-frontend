import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";

const ResultModal = ({ isOpen, onClose, onSubmit, event_id, intrams_id }) => {
  const [goldMedalistId, setGoldMedalistId] = useState("");
  const [silverMedalistId, setSilverMedalistId] = useState("");
  const [bronzeMedalistId, setBronzeMedalistId] = useState("");
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        const response = await axiosClient.get(
          `/intramurals/${intrams_id}/events/${event_id}/team_names`
        );
        console.log(response);
        setTeams(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch teams data:", err);
        setError("Failed to load teams. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [isOpen, event_id, intrams_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goldMedalistId || !silverMedalistId || !bronzeMedalistId) {
      setError("Please select all medalists");
      return;
    }

    if (
      goldMedalistId === silverMedalistId ||
      goldMedalistId === bronzeMedalistId ||
      silverMedalistId === bronzeMedalistId
    ) {
      setError("Each medal position must have a different team");
      return;
    }

    try {
      await onSubmit({
        gold_team_id: goldMedalistId,
        silver_team_id: silverMedalistId,
        bronze_team_id: bronzeMedalistId,
      });

      setGoldMedalistId("");
      setSilverMedalistId("");
      setBronzeMedalistId("");
      setError(null);
      onClose();
    } catch (err) {
      setError("Failed to submit medal results. Please try again.");
    }
  };

  if (!isOpen) return null;

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

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Gold Medalist */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-amber-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Gold Medalist (1st Place)
                </label>
                <select
                  value={goldMedalistId}
                  onChange={(e) => setGoldMedalistId(e.target.value)}
                  className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  required
                >
                  <option value="">Select Gold Medalist</option>
                  {teams
                    .filter(team => String(team.id) !== silverMedalistId && String(team.id) !== bronzeMedalistId)
                    .map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
              </div>

              {/* Silver Medalist */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Silver Medalist (2nd Place)
                </label>
                <select
                  value={silverMedalistId}
                  onChange={(e) => setSilverMedalistId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                  required
                >
                  <option value="">Select Silver Medalist</option>
                  {teams
                    .filter(team => String(team.id) !== goldMedalistId && String(team.id) !== bronzeMedalistId)
                    .map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
              </div>

              {/* Bronze Medalist */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-orange-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Bronze Medalist (3rd Place)
                </label>
                <select
                  value={bronzeMedalistId}
                  onChange={(e) => setBronzeMedalistId(e.target.value)}
                  className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  required
                >
                  <option value="">Select Bronze Medalist</option>
                  {teams
                    .filter(team => String(team.id) !== goldMedalistId && String(team.id) !== silverMedalistId)
                    .map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition duration-150"
              >
                Submit Results
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResultModal;

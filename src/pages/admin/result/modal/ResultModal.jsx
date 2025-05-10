import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Loader } from "lucide-react";
import axiosClient from "../../../../axiosClient";

const ResultModal = ({ isOpen, onClose, onSubmit, event_id, intrams_id, existingData }) => {
  const [teams, setTeams] = useState([]);
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [bronze, setBronze] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderMedalSelect = (medal, value, setValue, icon, color) => {
    return (
      <div className="mb-4">
        <label 
          htmlFor={medal} 
          className={`block mb-2 text-sm font-medium text-[#2A6D3A] flex items-center`}
        >
          {icon}
          {medal} Medalist
        </label>
        <select
          id={medal}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
          required
          disabled={submitting}
        >
          <option value="">Select Team</option>
          {teams
            .filter(team => 
              (medal === "Gold" || team.id.toString() !== gold) && 
              (medal === "Silver" || team.id.toString() !== silver) && 
              (medal === "Bronze" || team.id.toString() !== bronze)
            )
            .map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
        </select>
      </div>
    );
  };

  // Medal icons
  const goldIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const silverIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const bronzeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E6F2E8] bg-[#F7FAF7]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              Tournament Results
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-[#2A6D3A]/70 hover:bg-[#F7FAF7] hover:text-[#2A6D3A] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors duration-200"
              aria-label="Close modal"
              disabled={submitting}
            >
              <IoMdClose size={22} />
            </button>
          </div>

          {/* Form */}
          <form className="p-5" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : (
              <div className="space-y-4">
                {renderMedalSelect("Gold", gold, setGold, goldIcon, "amber")}
                {renderMedalSelect("Silver", silver, setSilver, silverIcon, "gray")}
                {renderMedalSelect("Bronze", bronze, setBronze, bronzeIcon, "orange")}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="text-[#2A6D3A] bg-white border border-[#E6F2E8] hover:bg-[#F7FAF7] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white bg-[#6BBF59] hover:bg-[#5CAF4A] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 flex items-center"
                disabled={loading || submitting}
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    {existingData ? "Updating..." : "Submitting..."}
                  </>
                ) : (
                  existingData ? "Update Results" : "Submit Results"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
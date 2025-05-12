import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Loader, Image } from "lucide-react";
import axiosClient from "../../../../axiosClient";

const GenerateGalleryModal = ({ isOpen, onClose, onSubmit, intrams_id, event_id }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(
          `/intramurals/${intrams_id}/team_names`
        );
        setTeams(res.data || []);
        setError(null);
        setSelectedTeam(""); // Reset selection when modal opens
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setError("Failed to load teams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [isOpen, intrams_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeam) {
      setError("Please select a team");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        team_id: selectedTeam,
        event_id: event_id
      });

      setSelectedTeam("");
      setError(null);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to generate gallery. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E6F2E8] bg-[#F7FAF7]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Image size={20} className="mr-2" />
              Generate Gallery
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
                <div className="mb-4">
                  <label 
                    htmlFor="team" 
                    className="block mb-2 text-sm font-medium text-[#2A6D3A] flex items-center"
                  >
                    Select Team
                  </label>
                  <select
                    id="team"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    required
                    disabled={submitting}
                  >
                    <option value="">Select a team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-[#F7FAF7] rounded-lg border border-[#E6F2E8]">
                  <p className="text-sm text-gray-600">
                    Generating a gallery will create a collection of approved players for the selected team. 
                    This process may take a moment depending on the number of players.
                  </p>
                </div>
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
                    Generating...
                  </>
                ) : (
                  "Generate Gallery"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateGalleryModal;
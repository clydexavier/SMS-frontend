import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useParams } from "react-router-dom";

export default function ParticipantModal({
  isModalOpen,
  closeModal,
  addParticipant,
  updateParticipant,
  existingParticipant,
  isLoading,
  error,
  teams,
}) {
  const { event_id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    team_id: "",
    event_id: event_id,
    finalized: "no",
  });

  useEffect(() => {
    if (existingParticipant) {
      setFormData({
        name: existingParticipant.name || "",
        team_id: existingParticipant.team_id || "",
        event_id: existingParticipant.event_id || event_id,
        finalized: existingParticipant.finalized || "no",
      });
    } else {
      setFormData({
        name: "",
        team_id: "",
        event_id: event_id,
        finalized: "no",
      });
    }
  }, [existingParticipant, event_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    existingParticipant
      ? updateParticipant(existingParticipant.id, formData)
      : addParticipant(formData);
    closeModal();
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t border-[#E6F2E8]">
              <h3 className="text-lg font-semibold text-[#2A6D3A]">
                {existingParticipant ? "Update Participant" : "Add New Participant"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer text-[#2A6D3A]/70 hover:bg-[#F7FAF7] hover:text-[#2A6D3A] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors duration-200"
              >
                <IoMdClose size={22} />
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-100 text-red-700 text-sm rounded-md mx-4 mt-4">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                {/* Participant Name */}
                <div className="col-span-2">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Participant Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="off"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="Enter participant name"
                    required
                  />
                </div>

                {/* Team Select */}
                <div className="col-span-2">
                  <label htmlFor="team_id" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Select Team
                  </label>
                  <select
                    name="team_id"
                    id="team_id"
                    value={formData.team_id}
                    onChange={handleChange}
                    required
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                  >
                    <option value="" disabled>
                      Select a team
                    </option>
                    {(teams || []).map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`text-white bg-[#6BBF59] hover:bg-[#5CAF4A] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading
                    ? existingParticipant
                      ? "Updating..."
                      : "Adding..."
                    : existingParticipant
                    ? "Update Participant"
                    : "Add New Participant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

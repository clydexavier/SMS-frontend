import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import axiosClient from "../../axiosClient";
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
  const { intrams_id , event_id} = useParams();

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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingParticipant) {
      updateParticipant(existingParticipant.id, formData);
    } else {
      addParticipant(formData);
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingParticipant ? "Update Participant" : "Add New Participant"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                disabled={isLoading}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form className="p-4" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Participant Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter participant name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                >
                </input>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select Team
                </label>
                <select
                  name="team_id"
                  value={formData.team_id}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                >
                  <option value="" disabled>
                    Select a team
                  </option>
                  {(teams || []).map(team => (
                    <option key={team.id} value={team.id}>
                        {team.name}
                    </option>
                ))}

                  
                </select>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (existingParticipant ? "Updating..." : "Adding...") : (existingParticipant ? "Update" : "Add")}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

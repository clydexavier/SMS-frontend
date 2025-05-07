import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";

export default function EventModal({ 
  isModalOpen, 
  closeModal, 
  addEvent, 
  updateEvent, 
  existingEvent,
  isLoading,
  error
}) {
  const { intrams_id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    tournament_type: "",
    category: "",
    intrams_id: intrams_id,
    type: "",
    gold: "",
    silver: "",
    bronze: "",
    venue: "",
    status: "pending",
  });

  const clearForm = () => {
    setFormData({
      name: "",
      tournament_type: "",
      category: "",
      intrams_id: null,
      type: "",
      gold: "",
      silver: "",
      bronze: "",
      venue: "",
      status: "pending",
    }); 
  }
  
  useEffect(() => {
    if (existingEvent) {
      setFormData({
        name: existingEvent.name || "",
        tournament_type: existingEvent.tournament_type || "",
        category: existingEvent.category || "",
        intrams_id: intrams_id,
        type: existingEvent.type || "",
        gold: existingEvent.gold || "",
        silver: existingEvent.silver || "",
        bronze: existingEvent.bronze || "",
        venue: existingEvent.venue || "",
        status: existingEvent.status || "pending",
      });
    } else {
      setFormData({
        name: "",
        tournament_type: "",
        category: "",
        intrams_id: intrams_id,
        type: "",
        gold: "",
        silver: "",
        bronze: "",
        venue: "",
        status: "pending",
      });
    }
  }, [existingEvent, intrams_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    existingEvent ? updateEvent(existingEvent.id, formData) : addEvent(formData);
    clearForm();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E6F2E8] bg-[#F7FAF7]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              {existingEvent ? "Update Event" : "Add New Event"}
            </h3>
            <button
              type="button"
              onClick={closeModal}
              className="cursor-pointer text-[#2A6D3A]/70 hover:bg-[#F7FAF7] hover:text-[#2A6D3A] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors duration-200"
              aria-label="Close modal"
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

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                  Event Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                  placeholder="Enter event name"
                />
              </div>

              {/* Tournament Type */}
              <div>
                <label htmlFor="tournament_type" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                  Tournament Type
                </label>
                <select
                  id="tournament_type"
                  name="tournament_type"
                  value={formData.tournament_type}
                  onChange={handleChange}
                  required
                  className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                >
                  <option value="" disabled>Select tournament type</option>
                  <option value="single elimination">Single Elimination</option>
                  <option value="double elimination">Double Elimination</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                >
                  <option value="" disabled>Select category</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                >
                  <option value="" disabled>Select type</option>
                  <option value="sports">Sports</option>
                  <option value="music">Music</option>
                  <option value="dance">Dance</option>
                </select>
              </div>

              {/* Venue */}
              <div>
                <label htmlFor="venue" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                  Venue
                </label>
                <input
                  id="venue"
                  name="venue"
                  type="text"
                  value={formData.venue}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                  placeholder="Enter venue"
                />
              </div>

              {/* Medal Count */}
              <div>
                <label htmlFor="medalCount" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                  Medal Count (applies to gold, silver, and bronze)
                </label>
                <input
                  id="medalCount"
                  name="medalCount"
                  type="number"
                  min="0"
                  value={formData.gold} // any of the three will reflect the value
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      gold: value,
                      silver: value,
                      bronze: value,
                    }));
                  }}
                  autoComplete="off"
                  required
                  className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                  placeholder="Enter number of medals"
                />
              </div>

              {/* Status (for updating) */}
              {existingEvent && (
                <div>
                  <label htmlFor="status" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="text-[#2A6D3A] bg-white border border-[#E6F2E8] hover:bg-[#F7FAF7] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white bg-[#6BBF59] hover:bg-[#5CAF4A] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    {existingEvent ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  existingEvent ? "Update Event" : "Add Event"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
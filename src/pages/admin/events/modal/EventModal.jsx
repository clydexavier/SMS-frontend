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
  error,
  umbrellaEvents // New prop for umbrella events list
}) {
  const { intrams_id } = useParams();

  const initialState = {
    name: "",
    tournament_type: "",
    category: "",
    type: "",
    gold: "",
    silver: "",
    bronze: "",
    venue: "",
    is_umbrella: false,
    parent_id: "",
  };

  const [formData, setFormData] = useState(initialState);
  
  useEffect(() => {
    if (existingEvent) {
      setFormData({
        name: existingEvent.name || "",
        tournament_type: existingEvent.tournament_type || "",
        category: existingEvent.category || "",
        type: existingEvent.type || "",
        gold: existingEvent.gold || "",
        silver: existingEvent.silver || "",
        bronze: existingEvent.bronze || "",
        venue: existingEvent.venue || "",
        is_umbrella: existingEvent.is_umbrella || false,
        parent_id: existingEvent.parent_id || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [existingEvent, intrams_id, isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleMedalCountChange = (e) => {
    // Convert input to integer and ensure it's positive
    let value = e.target.value;
    
    // Remove any non-digit characters
    value = value.replace(/\D/g, '');
    
    // Convert to number and ensure it's positive
    let numValue = value === '' ? '' : Math.max(1, parseInt(value, 10));
    
    // If parsing failed (e.g., for empty string), use empty string
    if (isNaN(numValue)) numValue = '';
    
    // Update all medal fields with the same value
    setFormData((prev) => ({
      ...prev,
      gold: numValue.toString(),
      silver: numValue.toString(),
      bronze: numValue.toString(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    existingEvent ? updateEvent(existingEvent.id, formData) : addEvent(formData);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto max-h-[90vh] flex flex-col">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] flex flex-col max-h-[90vh]">
          {/* Header - Fixed at top */}
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

          {/* Form - Scrollable content */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-5 overflow-y-auto flex-1">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Event Structure Fields - New Section */}
                  <div className="p-3 bg-[#F7FAF7] rounded-lg border border-[#E6F2E8]">
                    <h4 className="mb-2 text-sm font-medium text-[#2A6D3A]">Event Structure</h4>
                    <div className="space-y-3">
                      {/* Umbrella Event Checkbox */}
                      <div className="flex items-center">
                        <input
                          id="is_umbrella"
                          name="is_umbrella"
                          type="checkbox"
                          checked={formData.is_umbrella}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-[#6BBF59] focus:ring-[#6BBF59] rounded"
                        />
                        <label htmlFor="is_umbrella" className="ml-2 text-sm text-gray-700">
                          This is an umbrella event (contains sub-events)
                        </label>
                      </div>

                      {/* Parent Event Selection (only shown if not an umbrella event) */}
                      {!formData.is_umbrella && (
                        <div>
                          <label htmlFor="parent_id" className="block mb-1 text-sm font-medium text-[#2A6D3A]">
                            Parent Event (if this is a sub-event)
                          </label>
                          <select
                            id="parent_id"
                            name="parent_id"
                            value={formData.parent_id}
                            onChange={handleChange}
                            className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                          >
                            <option value="">Standalone Event (No Parent)</option>
                            {umbrellaEvents && umbrellaEvents.map(event => (
                              <option key={event.id} value={event.id}>
                                {event.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

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

                  {/* Tournament Type - Only for non-umbrella events */}
                  {!formData.is_umbrella && (
                    <div>
                      <label htmlFor="tournament_type" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                        Tournament Type
                      </label>
                      <select
                        id="tournament_type"
                        name="tournament_type"
                        value={formData.tournament_type}
                        onChange={handleChange}
                        required={!formData.is_umbrella}
                        className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                      >
                        <option value="" disabled>Select tournament type</option>
                        <option value="single elimination">Single Elimination</option>
                        <option value="double elimination">Double Elimination</option>
                        <option value="round robin">Round Robin</option>
                      </select>
                    </div>
                  )}

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
                      disabled={formData.parent_id} // Disabled if it's a sub-event
                      className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    >
                      <option value="" disabled>Select type</option>
                      <option value="sports">Sports</option>
                      <option value="music">Music</option>
                      <option value="dance">Dance</option>
                    </select>
                    {formData.parent_id && (
                      <p className="mt-1 text-xs text-gray-500">Type is inherited from parent event</p>
                    )}
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
                      min="1"
                      step="1"
                      value={formData.gold} // any of the three will reflect the value
                      onChange={handleMedalCountChange}
                      autoComplete="off"
                      required
                      className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                      placeholder="Enter number of medals (minimum 1)"
                      onKeyDown={(e) => {
                        // Prevent entering negative sign or decimal point
                        if (e.key === '-' || e.key === '.') {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        // Prevent pasting non-numeric values
                        const pasteData = e.clipboardData.getData('text');
                        if (!/^\d+$/.test(pasteData)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <p className="mt-1 text-xs text-gray-500">Only positive integers allowed</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex justify-end p-5 space-x-3 border-t border-[#E6F2E8] bg-white">
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
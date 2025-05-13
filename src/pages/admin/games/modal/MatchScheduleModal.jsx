import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Loader } from "lucide-react";

export default function MatchScheduleModal({
  selectedMatch,
  isOpen,
  onClose,
  submitSchedule,
  isLoading,
}) {
  const initialState = {
    date: "",
    time: "",
    venue: "",
  };
  
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && selectedMatch) {
      setFormData({
        date: selectedMatch.date || "",
        time: selectedMatch.time || "",
        venue: selectedMatch.venue || "",
      });
    } else {
      setFormData(initialState);
    }
    // Reset submitting state when modal opens/closes
    setSubmitting(false);
  }, [isOpen, selectedMatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await submitSchedule(selectedMatch.id, formData);
      // Wait a moment to show the loading state before closing
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error submitting schedule:", error);
      setSubmitting(false);
    }
  };

  if (!isOpen || !selectedMatch) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E6F2E8] bg-[#F7FAF7]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              Set Match Schedule
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
            {submitting ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
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
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="Enter venue name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Time
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    required
                  />
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
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Schedule"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}